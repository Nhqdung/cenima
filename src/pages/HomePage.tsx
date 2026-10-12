import React, { useEffect, useState } from 'react';
import { CinematicHero } from '../components/home/CinematicHero';
import { MovieSection } from '../components/home/MovieSection';
import { DiscoverySection } from '../components/home/DiscoverySection';
import { movieProvider } from '../services/movieProvider';
import { storage } from '../lib/storage';
import { useLanguage } from '../context/LanguageContext';
import type { Movie, WatchHistoryItem } from '../types/movie';
import { Loader2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<Movie[]>([]);
  const [animeMovies, setAnimeMovies] = useState<Movie[]>([]);
  const [singleMovies, setSingleMovies] = useState<Movie[]>([]);
  const [historyItems, setHistoryItems] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Parallel fetching categories from movieProvider
        const [newlyRes, seriesRes, animeRes, singleRes] = await Promise.all([
          movieProvider.getNewlyUpdated(1),
          movieProvider.getByCategory('phim-bo', 1, 15),
          movieProvider.getByCategory('hoat-hinh', 1, 15),
          movieProvider.getByCategory('phim-le', 1, 15),
        ]);

        const allNew = newlyRes.movies;
        const initialHero = allNew.slice(0, 5);
        setHeroMovies(initialHero);
        setTrendingMovies(allNew.slice(5, 20));
        setSeriesMovies(seriesRes.movies);
        setAnimeMovies(animeRes.movies);
        setSingleMovies(singleRes.movies);

        // Nâng cấp chi tiết nội dung mô tả cho top hero movies
        Promise.all(
          initialHero.map(m => movieProvider.getMovieDetail(m.slug).catch(() => null))
        ).then(detailedHeroes => {
          const validHeroes = detailedHeroes.map((dh, i) => (dh && dh.description ? dh : initialHero[i]));
          setHeroMovies(validHeroes);
        });
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
    setHistoryItems(storage.getWatchHistory());
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex flex-col items-center justify-center gap-4 text-slate-300">
        <Loader2 className="w-10 h-10 text-cinemora-cyan animate-spin" />
        <span className="text-sm font-mono tracking-wider text-cinemora-cyan">Đang tải phim...</span>
      </div>
    );
  }

  // Chuyển history thành Movie dạng danh sách tiếp tục xem
  const continueWatchingMovies: Movie[] = historyItems.map(h => ({
    id: h.movieId,
    slug: h.movieSlug,
    title: h.title,
    originalTitle: h.episodeName || '',
    description: '',
    poster: h.poster,
    backdrop: h.backdrop,
    releaseYear: 'Đang xem',
    genres: ['Xem tiếp'],
    country: '',
    duration: '',
    type: 'single'
  }));

  return (
    <div className="min-h-screen bg-midnight-900 pb-20">
      {/* 1. Cinematic Hero Banner */}
      <CinematicHero movies={heroMovies} />

      {/* 2. Tiếp tục xem (Nếu có lịch sử) */}
      {continueWatchingMovies.length > 0 && (
        <MovieSection
          title={t.continueWatching}
          subtitle={t.continueWatchingSub}
          movies={continueWatchingMovies}
          viewAllLink="/my-list"
        />
      )}

      {/* 3. Đang thịnh hành */}
      <MovieSection
        title={t.trendingTitle}
        subtitle={t.trendingSub}
        movies={trendingMovies}
        viewAllLink="/explore"
      />

      {/* 4. Cinematic Discovery Visual Mood Filters */}
      <DiscoverySection />

      {/* 5. Phim Lẻ Điện Ảnh Nổi Bật */}
      <MovieSection
        title={t.blockbusterTitle}
        subtitle={t.blockbusterSub}
        movies={singleMovies}
        viewAllLink="/explore?category=phim-le"
      />

      {/* 6. Phim Bộ Đáng Xem */}
      <MovieSection
        title={t.seriesTitle}
        subtitle={t.seriesSub}
        movies={seriesMovies}
        viewAllLink="/explore?category=phim-bo"
      />

      {/* 7. Thế Giới Anime */}
      <MovieSection
        title={t.animeTitle}
        subtitle={t.animeSub}
        movies={animeMovies}
        viewAllLink="/explore?category=hoat-hinh"
      />
    </div>
  );
};
