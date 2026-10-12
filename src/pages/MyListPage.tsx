import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, History, Trash2, Play, Sparkles } from 'lucide-react';
import { storage } from '../lib/storage';
import { MovieCard } from '../components/movie/MovieCard';
import type { Movie, WatchHistoryItem } from '../types/movie';
import { useLanguage } from '../context/LanguageContext';
import { movieTranslator } from '../utils/movieTranslator';

export const MyListPage: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<Movie[]>([]);
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    setBookmarks(storage.getMyList());
    setHistory(storage.getWatchHistory());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to clear your entire watch history?' : 'Bạn có chắc muốn xóa toàn bộ lịch sử xem phim?')) {
      storage.clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cinemora-cyan uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'en' ? 'PERSONALIZED' : 'CÁ NHÂN HÓA'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            {language === 'en' ? 'My Library' : 'Bộ Sưu Tập Của Tôi'}
          </h1>

          {/* Tabs switch */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition ${
                activeTab === 'bookmarks'
                  ? 'bg-cinemora-violet text-white shadow-lg shadow-cinemora-violet/25 font-semibold'
                  : 'bg-midnight-800 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{language === 'en' ? `Watchlist (${bookmarks.length})` : `Phim Yêu Thích (${bookmarks.length})`}</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition ${
                activeTab === 'history'
                  ? 'bg-cinemora-violet text-white shadow-lg shadow-cinemora-violet/25 font-semibold'
                  : 'bg-midnight-800 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{language === 'en' ? `Watch History (${history.length})` : `Lịch Sử Xem (${history.length})`}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Bookmarks Content */}
        {activeTab === 'bookmarks' && (
          <div>
            {bookmarks.length === 0 ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-midnight-800 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                  <Bookmark className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {language === 'en' ? 'Your watchlist is empty' : 'Danh sách yêu thích đang trống'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                  {language === 'en' ? 'Click on the bookmark button on any movie to save it for later.' : 'Hãy bấm vào biểu tượng dấu cộng (＋) trên bất kỳ phim nào để lưu lại xem sau.'}
                </p>
                <Link
                  to="/explore"
                  className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-cinemora-cyan text-midnight-950 font-bold text-xs sm:text-sm shadow-lg shadow-cinemora-cyan/20"
                >
                  {language === 'en' ? 'Explore movies now' : 'Khám phá phim ngay'}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {bookmarks.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: History Content */}
        {activeTab === 'history' && (
          <div>
            {history.length > 0 && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-mono transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Clear all watch history' : 'Xóa toàn bộ lịch sử'}</span>
                </button>
              </div>
            )}

            {history.length === 0 ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-midnight-800 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                  <History className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {language === 'en' ? 'No watch history yet' : 'Chưa có lịch sử xem phim'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                  {language === 'en' ? 'When you watch an episode, your progress will be saved here automatically.' : 'Khi bạn thưởng thức bất kỳ tập phim nào, hệ thống sẽ tự động lưu lại để bạn có thể xem tiếp.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item) => (
                  <div
                    key={item.movieSlug}
                    className="p-4 rounded-2xl bg-midnight-800/80 border border-white/5 flex items-center gap-4 hover:border-cinemora-cyan/40 transition group"
                  >
                    <div className="relative w-20 aspect-[2/3] rounded-xl overflow-hidden bg-midnight-900 shrink-0">
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-h-[70px] flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-cinemora-cyan transition truncate">
                          {movieTranslator.getTitle(item.title, undefined, language)}
                        </h4>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {language === 'en' ? 'Watching: ' : 'Đang xem: '}
                          <strong className="text-slate-200">
                            {movieTranslator.getEpisodeName(item.episodeName || 'Tập 1', language)}
                          </strong>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {new Date(item.updatedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN')}
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link
                          to={`/watch/${item.movieSlug}?ep=${item.episodeSlug || ''}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cinemora-violet hover:bg-cinemora-violet/90 text-white text-xs font-semibold shadow-md transition"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>{language === 'en' ? 'Resume' : 'Xem Tiếp'}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
