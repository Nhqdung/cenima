import type { Movie, MovieServer, FilterParams } from '../types/movie';
import { DEMO_BACKUP_MOVIES } from '../data/demoMovies';

const API_BASE = 'https://phimapi.com';
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

function getFromCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache<T>(key: string, data: T): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

// Convert raw API item to unified Movie structure
function normalizeMovieListItem(item: any): Movie {
  const posterUrl = item.poster_url?.startsWith('http')
    ? item.poster_url
    : `https://phimimg.com/${item.poster_url}`;

  const thumbUrl = item.thumb_url?.startsWith('http')
    ? item.thumb_url
    : `https://phimimg.com/${item.thumb_url}`;

  return {
    id: item._id || item.slug,
    slug: item.slug,
    title: item.name || 'Không rõ tên',
    originalTitle: item.origin_name || item.name || '',
    description: item.content ? item.content.replace(/<[^>]*>?/gm, '') : 'Đang cập nhật nội dung...',
    poster: posterUrl,
    backdrop: thumbUrl || posterUrl,
    releaseYear: item.year || new Date().getFullYear(),
    genres: Array.isArray(item.category)
      ? item.category.map((c: any) => c.name || c)
      : ['Phim Hot'],
    country: Array.isArray(item.country) && item.country[0]
      ? item.country[0].name || item.country[0]
      : 'Quốc tế',
    duration: item.time || '120 phút',
    rating: item.tmdb?.vote_average ? Number(item.tmdb.vote_average).toFixed(1) : (7.5 + Math.random() * 2).toFixed(1),
    type: item.type === 'single' ? 'single' : (item.type === 'hoathinh' ? 'anime' : 'series'),
    status: item.episode_current || 'Hoàn tất',
    quality: item.quality || 'FHD',
    lang: item.lang || 'Vietsub',
  };
}

export const movieProvider = {
  // Lấy danh sách phim mới cập nhật
  async getNewlyUpdated(page = 1): Promise<{ movies: Movie[]; totalPages: number }> {
    const cacheKey = `newly_updated_${page}`;
    const cached = getFromCache<{ movies: Movie[]; totalPages: number }>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`${API_BASE}/danh-sach/phim-moi-cap-nhat?page=${page}`, {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();

      const movies: Movie[] = (data.items || []).map(normalizeMovieListItem);
      const result = {
        movies,
        totalPages: data.pagination?.totalPages || 50
      };
      setCache(cacheKey, result);
      return result;
    } catch (err) {
      console.warn('Fallback to demo movies for getNewlyUpdated:', err);
      return { movies: DEMO_BACKUP_MOVIES, totalPages: 1 };
    }
  },

  // Lấy theo thể loại / danh mục (phim-le, phim-bo, hoat-hinh, tv-shows)
  async getByCategory(categoryType: string, page = 1, limit = 24): Promise<{ movies: Movie[]; totalPages: number; title: string }> {
    const cacheKey = `cat_${categoryType}_${page}_${limit}`;
    const cached = getFromCache<any>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`${API_BASE}/v1/api/danh-sach/${categoryType}?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error('API category failed');
      const json = await res.json();
      const items = json.data?.items || [];
      const movies = items.map(normalizeMovieListItem);

      const result = {
        movies,
        totalPages: json.data?.params?.pagination?.totalPages || 20,
        title: json.data?.titlePage || 'Danh sách phim'
      };
      setCache(cacheKey, result);
      return result;
    } catch (err) {
      console.warn('Category fetch error, filtering demo:', err);
      return {
        movies: DEMO_BACKUP_MOVIES,
        totalPages: 1,
        title: 'Phim Chọn Lọc'
      };
    }
  },

  // Tìm kiếm phim theo từ khóa thông minh (Hỗ trợ movie 22, phần 2, season 3, tên gốc,...)
  async searchMovies(keyword: string, limit = 24): Promise<Movie[]> {
    const raw = keyword.trim();
    if (!raw) return [];
    const cacheKey = `search_${encodeURIComponent(raw)}_${limit}`;
    const cached = getFromCache<Movie[]>(cacheKey);
    if (cached) return cached;

    // Sinh các biến thể từ khóa tìm kiếm
    const queries = [raw];
    const qLower = raw.toLowerCase();

    // 1. movie X / phần X / season X / ss X / tập X -> chuyển thành "tên X" và "tên"
    const partMatch = qLower.match(/(?:movie|phần|phan|ss|season|tập|tap)\s*(\d+)/i);
    if (partMatch) {
      const num = partMatch[1];
      const base = qLower.replace(/(?:movie|phần|phan|ss|season|tập|tap)\s*\d+/ig, '').replace(/\s+/g, ' ').trim();
      if (base) {
        queries.push((base + ' ' + num).trim());
        queries.push(base);
      }
    }

    // 2. Tách bỏ chữ 'movie' nếu đứng riêng
    if (qLower.includes('movie')) {
      const withoutMovie = qLower.replace(/\bmovie\b/ig, '').replace(/\s+/g, ' ').trim();
      if (withoutMovie) queries.push(withoutMovie);
    }

    // 3. Năm phát hành (ví dụ: 'doraemon 2024' -> 'doraemon')
    const yearMatch = qLower.match(/\b(19\d\d|20\d\d)\b/);
    if (yearMatch) {
      const withoutYear = qLower.replace(/\b(19\d\d|20\d\d)\b/g, '').replace(/\s+/g, ' ').trim();
      if (withoutYear) queries.push(withoutYear);
    }

    const uniqueQueries = Array.from(new Set(queries.filter(Boolean)));
    const allMovies: Movie[] = [];
    const seenSlugs = new Set<string>();

    for (const q of uniqueQueries) {
      try {
        const res = await fetch(`${API_BASE}/v1/api/tim-kiem?keyword=${encodeURIComponent(q)}&limit=${limit}`);
        if (res.ok) {
          const json = await res.json();
          const items = json.data?.items || [];
          for (const item of items) {
            if (!seenSlugs.has(item.slug)) {
              seenSlugs.add(item.slug);
              allMovies.push(normalizeMovieListItem(item));
            }
          }
          // Nếu đã tìm thấy kết quả khớp sát, ưu tiên dừng sớm để không loãng
          if (allMovies.length >= 8) break;
        }
      } catch (err) {
        console.warn(`Search attempt failed for query "${q}":`, err);
      }
    }

    // Nếu query có số (ví dụ '22' trong conan movie 22), đẩy các phim có chứa số đó lên đầu
    const numInQuery = raw.match(/\b(\d+)\b/)?.[1];
    if (numInQuery && allMovies.length > 0) {
      allMovies.sort((a, b) => {
        const aHas = (a.title + ' ' + (a.originalTitle || '')).includes(numInQuery);
        const bHas = (b.title + ' ' + (b.originalTitle || '')).includes(numInQuery);
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;
        return 0;
      });
    }

    if (allMovies.length > 0) {
      const result = allMovies.slice(0, limit);
      setCache(cacheKey, result);
      return result;
    }

    // Fallback dữ liệu nội bộ nếu API hoàn toàn không có
    const kw = raw.toLowerCase();
    return DEMO_BACKUP_MOVIES.filter(m =>
      m.title.toLowerCase().includes(kw) ||
      m.originalTitle.toLowerCase().includes(kw) ||
      m.genres.some(g => g.toLowerCase().includes(kw))
    );
  },

  // Lấy chi tiết phim và danh sách tập phim thực tế
  async getMovieDetail(slug: string): Promise<Movie | null> {
    const cacheKey = `movie_detail_${slug}`;
    const cached = getFromCache<Movie>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`${API_BASE}/phim/${slug}`);
      if (!res.ok) throw new Error('Movie detail failed');
      const data = await res.json();
      if (!data.movie) return null;

      const m = data.movie;
      const posterUrl = m.poster_url?.startsWith('http') ? m.poster_url : `https://phimimg.com/${m.poster_url}`;
      const thumbUrl = m.thumb_url?.startsWith('http') ? m.thumb_url : `https://phimimg.com/${m.thumb_url}`;

      // Xử lý danh sách tập và máy chủ phát
      const servers: MovieServer[] = (data.episodes || []).map((srv: any) => ({
        serverName: srv.server_name || 'Máy chủ chính (VIP)',
        episodes: (srv.server_data || []).map((ep: any) => ({
          serverName: srv.server_name || 'Máy chủ chính (VIP)',
          name: ep.name,
          slug: ep.slug,
          filename: ep.filename,
          linkEmbed: ep.link_embed,
          linkM3u8: ep.link_m3u8
        }))
      }));

      const fullMovie: Movie = {
        id: m._id || m.slug,
        slug: m.slug,
        title: m.name,
        originalTitle: m.origin_name || m.name,
        description: m.content ? m.content.replace(/<[^>]*>?/gm, '') : '',
        poster: posterUrl,
        backdrop: thumbUrl || posterUrl,
        releaseYear: m.year,
        genres: Array.isArray(m.category) ? m.category.map((c: any) => c.name || c) : [],
        country: Array.isArray(m.country) && m.country[0] ? (m.country[0].name || m.country[0]) : 'Quốc tế',
        duration: m.time || '120 phút',
        rating: m.tmdb?.vote_average ? Number(m.tmdb.vote_average).toFixed(1) : '8.5',
        type: m.type === 'single' ? 'single' : (m.type === 'hoathinh' ? 'anime' : 'series'),
        status: m.episode_current || 'Full',
        currentEpisode: m.episode_current,
        totalEpisodes: m.episode_total,
        quality: m.quality || 'HD',
        lang: m.lang || 'Vietsub',
        actors: Array.isArray(m.actor) ? m.actor : [],
        directors: Array.isArray(m.director) ? m.director : [],
        trailerUrl: m.trailer_url || undefined,
        servers
      };

      setCache(cacheKey, fullMovie);
      return fullMovie;
    } catch (err) {
      console.warn('Detail error, checking demo backup:', err);
      const found = DEMO_BACKUP_MOVIES.find(m => m.slug === slug || m.id === slug);
      return found || null;
    }
  },

  // Bộ lọc khám phá tổng hợp
  async filterMovies(params: FilterParams): Promise<{ movies: Movie[]; totalPages: number }> {
    const { category = 'phim-moi-cap-nhat', page = 1 } = params;

    if (params.keyword) {
      const searched = await this.searchMovies(params.keyword);
      return { movies: searched, totalPages: 1 };
    }

    if (category === 'phim-le' || category === 'phim-bo' || category === 'hoat-hinh' || category === 'tv-shows') {
      const res = await this.getByCategory(category, page);
      return { movies: res.movies, totalPages: res.totalPages };
    }

    const res = await this.getNewlyUpdated(page);
    return { movies: res.movies, totalPages: res.totalPages };
  }
};
