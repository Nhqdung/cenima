import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Film, 
  Search, 
  Bookmark, 
  Menu, 
  X, 
  Star, 
  Loader2, 
  LogOut, 
  ChevronDown,
  Globe,
  History,
  Flame
} from 'lucide-react';
import { movieProvider } from '../../services/movieProvider';
import { searchHistoryService, POPULAR_SEARCHES } from '../../services/searchHistoryService';
import { SITE_CONFIG } from '../../config/site';
import { statsService } from '../../services/statsService';
import { useLanguage } from '../../context/LanguageContext';
import type { UserProfile } from '../../lib/auth';
import type { Movie } from '../../types/movie';

interface HeaderProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, currentUser, onLogout }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => searchHistoryService.getRecentSearches());
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Tải lại lịch sử tìm kiếm khi mở search
    if (isSearchOpen) {
      setRecentSearches(searchHistoryService.getRecentSearches());
    }
  }, [isSearchOpen]);

  useEffect(() => {
    // Gửi tín hiệu online và đồng bộ đám mây
    statsService.sendHeartbeat();
    statsService.fetchCloudOnline().then(val => setOnlineCount(val));

    const interval = setInterval(() => {
      statsService.sendHeartbeat();
      statsService.fetchCloudOnline().then(val => setOnlineCount(val));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await movieProvider.searchMovies(searchQuery.trim(), 6);
        setSuggestions(results);
      } catch (err) {
        console.error('Search suggestion error', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const executeSearch = (query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      const updated = searchHistoryService.addRecentSearch(trimmed);
      setRecentSearches(updated);
      navigate(`/explore?keyword=${encodeURIComponent(trimmed)}`);
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
      setSuggestions([]);
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleSelectSuggestion = (slug: string, title?: string) => {
    if (title) {
      const updated = searchHistoryService.addRecentSearch(title);
      setRecentSearches(updated);
    }
    navigate(`/movie/${slug}`);
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
    setSuggestions([]);
    setSearchQuery('');
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

  const navLinks = [
    { name: t.home, href: '/' },
    { name: t.explore, href: '/explore' },
    { name: t.movies, href: '/explore?category=phim-le' },
    { name: t.series, href: '/explore?category=phim-bo' },
    { name: t.anime, href: '/explore?category=hoat-hinh' },
    { name: t.tvShows, href: '/explore?category=tv-shows' },
    { name: t.myList, href: '/my-list' },
  ];

  if (location.pathname.startsWith('/watch')) {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-midnight-950/90 backdrop-blur-md border-b border-white/10 py-3 shadow-xl' 
          : 'bg-gradient-to-b from-midnight-950/90 via-midnight-950/40 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-[1px] shadow-lg shadow-red-600/30 group-hover:shadow-red-600/50 transition">
                <div className="w-full h-full bg-midnight-950 rounded-[11px] flex items-center justify-center">
                  <Film className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-display font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-[9px] text-slate-400 font-mono tracking-widest hidden sm:inline -mt-1 uppercase">
                  {SITE_CONFIG.domain}
                </span>
              </div>
            </Link>

            {/* Live Online Badge */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono font-semibold">{onlineCount}</span>
              <span className="text-slate-400 text-[11px]">{t.onlineUsers}</span>
            </div>

            <nav className="hidden xl:flex items-center gap-6">
              {navLinks.map((item) => {
                const isActive = location.pathname + location.search === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition duration-200 hover:text-white ${
                      isActive 
                        ? 'text-red-500 font-semibold drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' 
                        : 'text-slate-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Input Box */}
            <div ref={searchContainerRef} className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Tìm phim, anime..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-56 sm:w-80 pl-9 pr-9 py-1.5 text-xs sm:text-sm bg-midnight-800/95 border border-red-500/40 rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-inner"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    {isSearching ? (
                      <Loader2 className="w-3.5 h-3.5 text-red-400 animate-spin absolute right-3" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSuggestions([]);
                        }}
                        className="absolute right-2.5 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 sm:p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
                  aria-label="Mở tìm kiếm"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* Suggestions / History Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 sm:w-96 bg-midnight-950/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-50 animate-fade-in divide-y divide-white/5">
                  {/* Trạng thái 1: Khi chưa nhập từ khóa hoặc từ khóa < 2 ký tự -> Hiện Lịch sử gần đây & Tìm kiếm phổ biến */}
                  {(!searchQuery.trim() || searchQuery.trim().length < 2) && (
                    <div className="max-h-96 overflow-y-auto">
                      {/* GẦN ĐÂY */}
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="p-3 bg-midnight-900/40 flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5 font-bold text-slate-300">
                              <History className="w-3.5 h-3.5 text-slate-400" />
                              GẦN ĐÂY
                            </span>
                            <button
                              onClick={handleClearAllRecent}
                              className="text-[10px] text-slate-500 hover:text-red-400 transition"
                            >
                              Xóa tất cả
                            </button>
                          </div>
                          <div className="divide-y divide-white/5">
                            {recentSearches.map((item) => (
                              <div
                                key={item}
                                onClick={() => executeSearch(item)}
                                className="px-3.5 py-2.5 hover:bg-white/5 cursor-pointer flex items-center justify-between group transition text-xs text-slate-300 hover:text-white"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <History className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 shrink-0" />
                                  <span className="truncate">{item}</span>
                                </div>
                                <button
                                  onClick={(e) => handleRemoveRecent(e, item)}
                                  className="text-slate-600 hover:text-slate-300 p-1 transition"
                                  title="Xóa tìm kiếm này"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* TÌM KIẾM PHỔ BIẾN */}
                      <div>
                        <div className="p-3 bg-midnight-900/40 flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                          <Flame className="w-3.5 h-3.5 text-red-500" />
                          <span>TÌM KIẾM PHỔ BIẾN</span>
                        </div>
                        <div className="divide-y divide-white/5">
                          {POPULAR_SEARCHES.map((pop, idx) => (
                            <div
                              key={pop}
                              onClick={() => executeSearch(pop)}
                              className="px-3.5 py-2.5 hover:bg-white/5 cursor-pointer flex items-center justify-between group transition text-xs text-slate-300 hover:text-white"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-[11px] w-4 text-center font-bold text-slate-500 group-hover:text-red-400">
                                  {idx + 1}
                                </span>
                                <span>{pop}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 group-hover:text-red-400">
                                Hot
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Trạng thái 2: Khi đã nhập từ khóa >= 2 ký tự -> Hiện Gợi ý phim */}
                  {searchQuery.trim().length >= 2 && (
                    <div>
                      <div className="p-2.5 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>GỢI Ý TÌM KIẾM</span>
                        {isSearching && <span className="text-red-400">Đang tìm...</span>}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                        {suggestions.length === 0 && !isSearching ? (
                          <div className="p-4 text-center text-xs text-slate-500">
                            Không có kết quả tức thì. Nhấn Enter để tìm nâng cao!
                          </div>
                        ) : (
                          suggestions.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleSelectSuggestion(item.slug, item.title)}
                              className="p-2.5 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition group"
                            >
                              <img
                                src={item.poster}
                                alt={item.title}
                                className="w-10 h-14 object-cover rounded-lg bg-midnight-800 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold text-white group-hover:text-red-400 transition truncate">
                                  {item.title}
                                </h4>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {item.originalTitle || item.releaseYear}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                  <span className="text-red-400 font-medium">{item.releaseYear}</span>
                                  <span>•</span>
                                  <span className="truncate">{item.genres.slice(0, 2).join(', ')}</span>
                                </div>
                              </div>
                              {item.rating && (
                                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-black/40 px-1.5 py-0.5 rounded shrink-0">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  <span>{item.rating}</span>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      <button
                        onClick={handleSearchSubmit}
                        className="w-full p-2.5 bg-midnight-900 hover:bg-red-500/20 text-red-400 text-xs font-semibold text-center border-t border-white/5 transition"
                      >
                        Xem tất cả kết quả cho "{searchQuery}" →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/my-list"
              className="p-2 sm:p-2.5 rounded-full text-slate-300 hover:text-red-400 hover:bg-white/10 transition relative"
              title="Danh sách của tôi"
            >
              <Bookmark className="w-5 h-5" />
            </Link>

            {/* Auth User Menu or Login Button */}
            {currentUser ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 border-l border-white/10 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-red-500/40 bg-midnight-800">
                    <img 
                      src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-200 hidden md:inline max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-midnight-950 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 text-xs">
                    <div className="p-2.5 border-b border-white/5">
                      <div className="font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                    </div>

                    <Link
                      to="/my-list"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block p-2 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white"
                    >
                      Danh sách đã lưu & Lịch sử
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-red-500/10 text-red-400 flex items-center gap-2 border-t border-white/5 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="hidden sm:inline-block px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/30 transition"
                >
                  {t.register}
                </button>
              </div>
            )}

            {/* Language Switcher Button VI / EN */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition"
              title="Đổi ngôn ngữ / Change language"
            >
              <Globe className="w-3.5 h-3.5 text-red-400" />
              <span className="font-mono tracking-wider">{language === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="xl:hidden bg-midnight-950/95 backdrop-blur-xl border-b border-white/10 px-5 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm phim, diễn viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-midnight-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </form>

          <div className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-200 hover:bg-midnight-800 hover:text-red-400"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-300 truncate font-semibold">
                  Tài khoản: {currentUser.name}
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="text-xs text-red-400 font-semibold"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="py-2.5 rounded-xl text-xs font-semibold text-center bg-white/10 text-white"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="py-2.5 rounded-xl text-xs font-semibold text-center bg-red-600 text-white"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
