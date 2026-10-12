import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, 
  Plus, 
  Check, 
  Star, 
  Calendar, 
  Clock, 
  Globe, 
  Share2, 
  Users, 
  Clapperboard, 
  Loader2,
  Tv
} from 'lucide-react';
import { movieProvider } from '../services/movieProvider';
import { storage } from '../lib/storage';
import { MovieSection } from '../components/home/MovieSection';
import { MovieCommentsSection } from '../components/movie/MovieCommentsSection';
import { useLanguage } from '../context/LanguageContext';
import { movieTranslator } from '../utils/movieTranslator';
import type { Movie } from '../types/movie';
import type { UserProfile } from '../lib/auth';

interface MovieDetailPageProps {
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const MovieDetailPage: React.FC<MovieDetailPageProps> = ({
  currentUser = null,
  onOpenAuth = () => {}
}) => {
  const { t, language } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [inList, setInList] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await movieProvider.getMovieDetail(slug);
        setMovie(data);
        if (data) {
          setInList(storage.isInMyList(data.id));
          const res = await movieProvider.getByCategory('phim-le', 1, 10);
          setSimilarMovies(res.movies.filter(m => m.slug !== slug));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleToggleList = () => {
    if (!movie) return;
    const res = storage.toggleMyList(movie);
    setInList(res);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex flex-col items-center justify-center gap-3 text-slate-300">
        <Loader2 className="w-9 h-9 text-red-500 animate-spin" />
        <span className="text-xs font-mono text-slate-400">Đang tải hồ sơ điện ảnh...</span>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-midnight-950 flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-2xl font-bold text-white">Không tìm thấy phim</h2>
        <p className="text-slate-400 text-sm">Bộ phim bạn tìm kiếm có thể đã bị gỡ hoặc đường dẫn không đúng.</p>
        <Link to="/explore" className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm">
          Quay lại khám phá
        </Link>
      </div>
    );
  }

  const totalEpisodesCount = movie.servers?.reduce((acc, s) => Math.max(acc, s.episodes.length), 0) || 0;

  return (
    <div className="min-h-screen bg-midnight-900 pb-20">
      <div className="relative w-full h-[65vh] min-h-[460px] max-h-[650px] overflow-hidden">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-900 via-midnight-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight-900 via-midnight-900/80 to-transparent w-full lg:w-3/4" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-52 sm:-mt-64 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          <div className="lg:col-span-4 max-w-[280px] sm:max-w-[320px] mx-auto lg:mx-0 w-full">
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 bg-midnight-800">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => navigate(`/watch/${movie.slug}`)}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{t.watchNow}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleToggleList}
                  className={`py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    inList
                      ? 'bg-red-600/20 border-red-500 text-red-400'
                      : 'bg-midnight-800/80 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{inList ? (language === 'en' ? 'Saved' : 'Đã Lưu') : (language === 'en' ? 'Add to List' : 'Thêm Vào DS')}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="py-3 rounded-xl bg-midnight-800/80 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copied ? (language === 'en' ? 'Copied!' : 'Đã Copy!') : (language === 'en' ? 'Share' : 'Chia Sẻ')}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {movie.quality && (
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/30">
                    {movie.quality}
                  </span>
                )}
                {movie.lang && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-200">
                    {movie.lang}
                  </span>
                )}
                {movie.status && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {movieTranslator.getStatus(movie.status, language)}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white leading-tight">
                {movieTranslator.getTitle(movie.title, movie.originalTitle, language)}
              </h1>
              <p className="text-base sm:text-lg text-slate-400 font-medium mt-1">
                {movieTranslator.getSubtitle(movie.title, movie.originalTitle, language)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 py-3 border-y border-white/5">
              {movie.rating && (
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-base">{movie.rating}</span>
                  <span className="text-slate-500 font-normal">/ 10 IMDb</span>
                </div>
              )}

              <div className="flex items-center gap-1 text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{movie.releaseYear}</span>
              </div>

              <div className="flex items-center gap-1 text-slate-300">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{movie.duration}</span>
              </div>

              <div className="flex items-center gap-1 text-slate-300">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>{movieTranslator.getCountry(movie.country, language)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full bg-midnight-800 text-slate-300 border border-white/5 text-xs font-medium"
                >
                  {movieTranslator.getGenre(g, language)}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                {t.content}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {movie.description || (language === 'en' ? 'Movie description is being updated...' : 'Nội dung phim đang được cập nhật...')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {movie.directors && movie.directors.length > 0 && (
                <div className="p-4 rounded-2xl bg-midnight-800/60 border border-white/5 space-y-1">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clapperboard className="w-3.5 h-3.5 text-red-500" />
                    {t.directors}
                  </span>
                  <div className="text-sm font-semibold text-white">
                    {movie.directors.join(', ')}
                  </div>
                </div>
              )}

              {movie.actors && movie.actors.length > 0 && (
                <div className="p-4 rounded-2xl bg-midnight-800/60 border border-white/5 space-y-1">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-300" />
                    {t.actors}
                  </span>
                  <div className="text-sm font-semibold text-white truncate" title={movie.actors.join(', ')}>
                    {movie.actors.join(', ')}
                  </div>
                </div>
              )}
            </div>

            {totalEpisodesCount > 0 && (
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Tv className="w-4 h-4 text-red-500" />
                    <span>{t.episodeList} ({totalEpisodesCount} {t.episodes.toLowerCase()})</span>
                  </h3>
                  <Link
                    to={`/watch/${movie.slug}`}
                    className="text-xs text-red-400 font-semibold hover:underline"
                  >
                    {t.viewAllInPlayer}
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                  {movie.servers?.[0]?.episodes.slice(0, 15).map((ep) => (
                    <button
                      key={ep.slug}
                      onClick={() => navigate(`/watch/${movie.slug}?ep=${ep.slug}`)}
                      className="px-3 py-1.5 rounded-lg bg-midnight-800 hover:bg-red-600 text-slate-300 hover:text-white border border-white/5 text-xs font-medium transition"
                    >
                      {movieTranslator.getEpisodeName(ep.name, language)}
                    </button>
                  ))}
                  {totalEpisodesCount > 15 && (
                    <button
                      onClick={() => navigate(`/watch/${movie.slug}`)}
                      className="px-3 py-1.5 rounded-lg bg-midnight-800 text-red-400 text-xs font-medium"
                    >
                      +{totalEpisodesCount - 15} {t.moreEpisodes}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Khung Bình Luận & Đánh Giá Phim */}
        <div className="mt-16">
          <MovieCommentsSection
            movieSlug={movie.slug}
            movieTitle={movie.title}
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
          />
        </div>

        {similarMovies.length > 0 && (
          <div className="mt-16">
            <MovieSection
              title={t.similarMovies}
              subtitle={t.similarMoviesSub}
              movies={similarMovies}
              viewAllLink="/explore"
            />
          </div>
        )}
      </div>
    </div>
  );
};
