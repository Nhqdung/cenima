import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Tv, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  Bookmark, 
  Check, 
  Loader2,
  Eye
} from 'lucide-react';
import { movieProvider } from '../services/movieProvider';
import { storage } from '../lib/storage';
import { statsService } from '../services/statsService';
import { MovieCommentsSection } from '../components/movie/MovieCommentsSection';
import { useLanguage } from '../context/LanguageContext';
import { movieTranslator } from '../utils/movieTranslator';
import type { Movie, MovieEpisode, MovieServer } from '../types/movie';
import type { UserProfile } from '../lib/auth';

interface WatchPageProps {
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const WatchPage: React.FC<WatchPageProps> = ({ 
  currentUser = null, 
  onOpenAuth = () => {} 
}) => {
  const { t, language } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const episodeSlugParam = searchParams.get('ep');
  const serverIndexParam = parseInt(searchParams.get('server') || '0', 10);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeServerIndex, setActiveServerIndex] = useState(serverIndexParam || 0);
  const [activeEpisode, setActiveEpisode] = useState<MovieEpisode | null>(null);
  const [inList, setInList] = useState(false);
  const [currentViewers, setCurrentViewers] = useState<number>(36);

  useEffect(() => {
    if (!slug) return;
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await movieProvider.getMovieDetail(slug);
        setMovie(data);
        if (data) {
          setInList(storage.isInMyList(data.id));
          setCurrentViewers(statsService.getMovieViewers(data.slug));

          const server = data.servers?.[activeServerIndex] || data.servers?.[0];
          if (server && server.episodes.length > 0) {
            let ep = server.episodes.find(e => e.slug === episodeSlugParam);
            if (!ep) {
              const savedProgress = storage.getProgressForMovie(slug);
              if (savedProgress && savedProgress.episodeSlug) {
                ep = server.episodes.find(e => e.slug === savedProgress.episodeSlug);
              }
            }
            const selected = ep || server.episodes[0];
            setActiveEpisode(selected);

            storage.saveWatchProgress({
              movieId: data.id,
              movieSlug: data.slug,
              title: data.title,
              poster: data.poster,
              backdrop: data.backdrop,
              episodeSlug: selected.slug,
              episodeName: selected.name,
              serverName: server.serverName,
              currentTime: 0,
              duration: 100
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleSelectEpisode = (ep: MovieEpisode) => {
    setActiveEpisode(ep);
    const params = new URLSearchParams(searchParams);
    params.set('ep', ep.slug);
    setSearchParams(params);

    if (movie) {
      storage.saveWatchProgress({
        movieId: movie.id,
        movieSlug: movie.slug,
        title: movie.title,
        poster: movie.poster,
        backdrop: movie.backdrop,
        episodeSlug: ep.slug,
        episodeName: ep.name,
        serverName: currentServer?.serverName || '',
        currentTime: 0,
        duration: 100
      });
    }
  };

  const handleSelectServer = (idx: number) => {
    setActiveServerIndex(idx);
    if (movie && movie.servers?.[idx]) {
      const srv = movie.servers[idx];
      const matchEp = srv.episodes.find(e => e.slug === activeEpisode?.slug) || srv.episodes[0];
      setActiveEpisode(matchEp);
    }
  };

  const handleToggleList = () => {
    if (!movie) return;
    const res = storage.toggleMyList(movie);
    setInList(res);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3 text-slate-300">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
        <span className="text-xs font-mono text-slate-400">Đang khởi tạo luồng chiếu video...</span>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-xl font-bold text-white">Không tải được phim</h2>
        <Link to="/" className="text-red-400 hover:underline text-sm">Trở về Trang chủ</Link>
      </div>
    );
  }

  const currentServer: MovieServer | undefined = movie.servers?.[activeServerIndex] || movie.servers?.[0];
  const allEpisodes = currentServer?.episodes || [];
  const currentIndex = allEpisodes.findIndex(e => e.slug === activeEpisode?.slug);
  const prevEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex >= 0 && currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md px-4 sm:px-8 py-3.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/movie/${movie.slug}`}
            className="p-2 sm:px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer z-10"
            title={t.movieInfo}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="inline">{t.movieInfo}</span>
          </Link>

          <div>
            <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-[220px] sm:max-w-md">
              {movieTranslator.getTitle(movie.title, movie.originalTitle, language)}
            </h1>
            {activeEpisode && (
              <span className="text-xs text-red-400 font-mono">
                {movieTranslator.getEpisodeName(activeEpisode.name, language)} • {movieTranslator.getServerName(currentServer?.serverName || '', language)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <Eye className="w-3.5 h-3.5 text-red-400" />
            <span className="font-mono font-bold text-white">{currentViewers}</span>
            <span className="text-slate-400 text-[11px] hidden md:inline">{t.currentViewers}</span>
          </div>

          <button
            onClick={handleToggleList}
            className={`p-2 rounded-xl border text-xs transition ${
              inList ? 'bg-red-600/30 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-slate-300'
            }`}
            title={inList ? t.removeFromList : t.addToList}
          >
            {inList ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div className="relative aspect-video w-full bg-black rounded-none sm:rounded-3xl overflow-hidden shadow-2xl border border-white/5">
          {activeEpisode?.linkEmbed ? (
            <iframe
              src={activeEpisode.linkEmbed}
              title={movie.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : activeEpisode?.linkM3u8 ? (
            <video
              src={activeEpisode.linkM3u8}
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400" />
              <h3 className="text-lg font-bold">{t.sourceUnavailable}</h3>
              <p className="text-xs text-slate-400">{t.selectOtherServer}</p>
            </div>
          )}
        </div>

        <div className="mt-4 px-4 sm:px-0 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {prevEpisode && (
              <button
                onClick={() => handleSelectEpisode(prevEpisode)}
                className="px-4 py-2 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-white/5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t.previousEpisode} ({movieTranslator.getEpisodeName(prevEpisode.name, language)})</span>
              </button>
            )}

            {nextEpisode && (
              <button
                onClick={() => handleSelectEpisode(nextEpisode)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-red-600/30"
              >
                <span>{t.nextEpisode} ({movieTranslator.getEpisodeName(nextEpisode.name, language)})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {movie.servers && movie.servers.length > 1 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono hidden sm:inline">{t.changeServer}:</span>
              {movie.servers.map((srv, idx) => (
                <button
                  key={srv.serverName}
                  onClick={() => handleSelectServer(idx)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    activeServerIndex === idx
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-midnight-800 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  {movieTranslator.getServerName(srv.serverName, language)}
                </button>
              ))}
            </div>
          )}
        </div>

        {allEpisodes.length > 1 && (
          <div className="mt-8 px-4 sm:px-0">
            <div className="p-6 rounded-3xl bg-midnight-800/80 border border-white/5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-bold text-white">
                    {t.selectEpisode} ({allEpisodes.length} {language === 'en' ? 'episodes' : 'tập'})
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {language === 'en' ? 'Auto-saves watching progress' : 'Tự động lưu tiến độ xem'}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {allEpisodes.map((ep) => {
                  const isCurrent = ep.slug === activeEpisode?.slug;
                  return (
                    <button
                      key={ep.slug}
                      onClick={() => handleSelectEpisode(ep)}
                      className={`p-3 rounded-xl text-center text-xs font-semibold transition border ${
                        isCurrent
                          ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30'
                          : 'bg-midnight-900/90 border-white/5 text-slate-300 hover:text-white hover:bg-midnight-700'
                      }`}
                    >
                      {movieTranslator.getEpisodeName(ep.name, language)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Khung bình luận, đánh giá sao, thả tim & phản hồi */}
        {movie && (
          <MovieCommentsSection
            movieSlug={movie.slug}
            movieTitle={movie.title}
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
          />
        )}
      </div>
    </div>
  );
};
