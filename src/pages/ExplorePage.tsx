import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieProvider } from '../services/movieProvider';
import { MovieCard } from '../components/movie/MovieCard';
import type { Movie } from '../types/movie';
import { 
  Search, 
  Loader2, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  History,
  Flame
} from 'lucide-react';
import { searchHistoryService, POPULAR_SEARCHES } from '../services/searchHistoryService';
import { useLanguage } from '../context/LanguageContext';
import { movieTranslator } from '../utils/movieTranslator';

export const ExplorePage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'phim-moi-cap-nhat';
  const currentKeyword = searchParams.get('keyword') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSort = searchParams.get('sort') || 'default';

  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentKeyword);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => searchHistoryService.getRecentSearches());
  const exploreSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchInput(currentKeyword);
  }, [currentKeyword]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exploreSearchRef.current && !exploreSearchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchInput.trim() || searchInput.trim().length < 2) {
      setSuggestions([]);
      setIsSuggesting(false);
      return;
    }

    setIsSuggesting(true);
    const timer = setTimeout(async () => {
      try {
        const results = await movieProvider.searchMovies(searchInput.trim(), 8);
        setSuggestions(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSuggesting(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (currentKeyword.trim()) {
          const res = await movieProvider.searchMovies(currentKeyword);
          setMovies(res);
          setTotalPages(1);
        } else {
          const res = await movieProvider.filterMovies({
            category: currentCategory,
            page: currentPage
          });
          setMovies(res.movies);
          setTotalPages(res.totalPages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentCategory, currentKeyword, currentPage, currentSort]);

  const executeSearch = (query: string) => {
    const trimmed = query.trim();
    setSuggestions([]);
    setIsSearchFocused(false);
    const params = new URLSearchParams(searchParams);
    if (trimmed) {
      const updated = searchHistoryService.addRecentSearch(trimmed);
      setRecentSearches(updated);
      params.set('keyword', trimmed);
      params.delete('category');
    } else {
      params.delete('keyword');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchInput);
  };

  const handleSelectSuggestion = (m: Movie) => {
    setSearchInput(m.title);
    executeSearch(m.title);
  };

  const handleRemoveRecent = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = searchHistoryService.removeRecentSearch(item);
    setRecentSearches(updated);
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    searchHistoryService.clearAllRecentSearches();
    setRecentSearches([]);
  };

  const handleCategoryChange = (cat: string) => {
    setSearchInput('');
    setSuggestions([]);
    setIsSearchFocused(false);
    const params = new URLSearchParams(searchParams);
    params.set('category', cat);
    params.delete('keyword');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

    const categories = [
    { id: 'phim-moi-cap-nhat', name: t.newReleases },
    { id: 'phim-le', name: t.movies },
    { id: 'phim-bo', name: t.series },
    { id: 'hoat-hinh', name: t.anime },
    { id: 'tv-shows', name: t.tvShows },
  ];

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              {t.exploreCategories}
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              {t.exploreTitle}
            </h1>
          </div>

          {/* Search Box with Real-Time Suggestions Dropdown */}
          <div ref={exploreSearchRef} className="relative max-w-2xl">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search movie title, Conan, Batman, anime...' : 'Nhập tên phim, Conan, Batman, anime...'}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    setRecentSearches(searchHistoryService.getRecentSearches());
                  }}
                  className="w-full pl-12 pr-28 py-3.5 bg-midnight-800/95 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition shadow-xl"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4 pointer-events-none" />
                
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      setSuggestions([]);
                    }}
                    className="absolute right-24 top-4 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute right-2 top-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
                >
                  {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{language === 'en' ? 'Search' : 'Tìm kiếm'}</span>}
                </button>
              </div>
            </form>

            {/* Suggestions & Search History Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-midnight-950/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-50 animate-fade-in divide-y divide-white/5">
                {/* Khi chưa nhập hoặc từ khóa < 2 ký tự: Hiện Lịch sử gần đây & Tìm kiếm phổ biến */}
                {(!searchInput.trim() || searchInput.trim().length < 2) && (
                  <div className="max-h-96 overflow-y-auto">
                    {/* GẦN ĐÂY */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="p-3 bg-midnight-900/40 flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5 font-bold text-slate-300">
                            <History className="w-4 h-4 text-slate-400" />
                            {t.recentSearches}
                          </span>
                          <button
                            onClick={handleClearAllRecent}
                            className="text-[11px] text-slate-500 hover:text-red-400 transition"
                          >
                            {t.clearAll}
                          </button>
                        </div>
                        <div className="divide-y divide-white/5">
                          {recentSearches.map((item) => (
                            <div
                              key={item}
                              onClick={() => {
                                setSearchInput(item);
                                executeSearch(item);
                              }}
                              className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center justify-between group transition text-sm text-slate-300 hover:text-white"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <History className="w-4 h-4 text-slate-500 group-hover:text-red-400 shrink-0" />
                                <span className="truncate">{item}</span>
                              </div>
                              <button
                                onClick={(e) => handleRemoveRecent(e, item)}
                                className="text-slate-600 hover:text-slate-300 p-1 transition"
                                title={language === 'en' ? 'Delete this search' : 'Xóa từ khóa này'}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TÌM KIẾM PHỔ BIẾN */}
                    <div>
                      <div className="p-3 bg-midnight-900/40 flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
                        <Flame className="w-4 h-4 text-red-500" />
                        <span>{t.popularSearches}</span>
                      </div>
                      <div className="divide-y divide-white/5">
                        {POPULAR_SEARCHES.map((pop, idx) => (
                          <div
                            key={pop}
                            onClick={() => {
                              setSearchInput(pop);
                              executeSearch(pop);
                            }}
                            className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center justify-between group transition text-sm text-slate-300 hover:text-white"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs w-4 text-center font-bold text-slate-500 group-hover:text-red-400">
                                {idx + 1}
                              </span>
                              <span>{pop}</span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-500 group-hover:text-red-400">
                              {t.hot}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Khi đã nhập >= 2 ký tự: Hiện kết quả gợi ý phim */}
                {searchInput.trim().length >= 2 && suggestions.length > 0 && (
                  <div>
                    <div className="p-3 bg-midnight-900/80 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{language === 'en' ? `AUTO SUGGESTIONS FOR "${searchInput}"` : `GỢI Ý TỰ ĐỘNG CHO "${searchInput}"`}</span>
                      <span className="text-red-400">{suggestions.length} {language === 'en' ? 'titles' : 'phim liên quan'}</span>
                    </div>

                    <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
                      {suggestions.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectSuggestion(item)}
                          className="p-3 hover:bg-white/5 cursor-pointer flex items-center gap-3.5 transition group"
                        >
                          <img
                            src={item.poster}
                            alt={item.title}
                            className="w-12 h-16 object-cover rounded-xl bg-midnight-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white group-hover:text-red-400 transition truncate">
                              {movieTranslator.getTitle(item.title, item.originalTitle, language)}
                            </h4>
                            <div className="text-xs text-slate-400 truncate mt-0.5">
                              {movieTranslator.getSubtitle(item.title, item.originalTitle, language) || item.releaseYear}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                              <span className="text-red-400 font-medium">{item.releaseYear}</span>
                              <span>•</span>
                              <span className="truncate">{item.genres.slice(0, 3).map(g => movieTranslator.getGenre(g, language)).join(', ')}</span>
                              {item.status && (
                                <>
                                  <span>•</span>
                                  <span className="text-amber-400 font-mono">{movieTranslator.getStatus(item.status, language)}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {item.rating && (
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-black/40 px-2 py-1 rounded-md shrink-0 border border-white/5">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{item.rating}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
            {categories.map((c) => {
              const active = currentCategory === c.id && !currentKeyword;
              return (
                <button
                  key={c.id}
                  onClick={() => handleCategoryChange(c.id)}
                  className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 font-semibold'
                      : 'bg-midnight-800/80 text-slate-300 hover:text-white border border-white/5 hover:bg-midnight-700/80'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5 text-xs sm:text-sm text-slate-400 font-mono">
          <div>
            {currentKeyword ? (
              <span>{t.searchResultsFor} <strong className="text-red-400 font-bold">"{currentKeyword}"</strong></span>
            ) : (
              <span>{t.showingPage} {currentPage} / {totalPages}</span>
            )}
          </div>
          <div>{movies.length} {t.titlesCount}</div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <span className="text-xs font-mono text-red-400">{language === 'en' ? 'Loading movies catalog...' : 'Đang tải kho phim...'}</span>
          </div>
        ) : movies.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-midnight-800 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.noMoviesFound}</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              {t.tryDifferentKeyword}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && !currentKeyword && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2.5 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition border border-white/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm font-mono text-slate-300 px-4 py-2 rounded-xl bg-midnight-800/80 border border-white/5">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2.5 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition border border-white/5"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
