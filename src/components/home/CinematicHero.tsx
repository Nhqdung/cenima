import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Plus, 
  Check, 
  Info, 
  Star, 
  Sparkles
} from 'lucide-react';
import type { Movie } from '../../types/movie';
import { storage } from '../../lib/storage';
import { useLanguage } from '../../context/LanguageContext';
import { movieTranslator } from '../../utils/movieTranslator';

interface CinematicHeroProps {
  movies: Movie[];
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ movies }) => {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!movies || movies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex] || movies[0];
  const inList = storage.isInMyList(currentMovie.id);

  const handleToggleMyList = () => {
    storage.toggleMyList(currentMovie);
  };

  return (
    <div className="relative w-full h-[80vh] min-h-[580px] max-h-[850px] overflow-hidden select-none bg-midnight-950">
      {/* Background Backdrop */}
      <div className="absolute inset-0">
        <img
          key={currentMovie.id}
          src={currentMovie.backdrop || currentMovie.poster}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center animate-fade-in transition-all duration-1000 scale-105"
        />

        {/* Ambient Warm Lighting behind hero */}
        <div className="absolute top-1/4 left-1/3 w-[550px] h-[350px] bg-red-600/15 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-amber-500/10 blur-[130px] pointer-events-none" />

        {/* Soft Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-900 via-midnight-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight-900 via-midnight-900/80 to-transparent w-full lg:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/80 via-transparent to-transparent h-28" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24 z-10">
        <div className="max-w-2xl space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-800/90 backdrop-blur-md border border-red-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-white">{t.topTrending}</span>
            <span className="text-red-400 font-mono">#{currentIndex + 1} TOP TRENDING</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-2xl">
              {movieTranslator.getTitle(currentMovie.title, currentMovie.originalTitle, language)}
            </h1>
            {movieTranslator.getSubtitle(currentMovie.title, currentMovie.originalTitle, language) && (
              <p className="text-sm sm:text-base text-slate-300 font-medium mt-1">
                {movieTranslator.getSubtitle(currentMovie.title, currentMovie.originalTitle, language)}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-slate-300 font-medium">
            {currentMovie.rating && (
              <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {currentMovie.rating}
              </span>
            )}

            <span className="bg-white/10 px-2 py-0.5 rounded-md text-white border border-white/10">
              {currentMovie.releaseYear}
            </span>

            {currentMovie.quality && (
              <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/30">
                {currentMovie.quality}
              </span>
            )}

            <span className="text-slate-400">{currentMovie.duration}</span>

            <span className="text-slate-300">
              {currentMovie.genres.map(g => movieTranslator.getGenre(g, language)).slice(0, 3).join(' • ')}
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 sm:line-clamp-4 leading-relaxed drop-shadow-md">
            {currentMovie.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate(`/watch/${currentMovie.slug}`)}
              className="px-6 sm:px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-xl shadow-red-600/30 hover:scale-105 transition duration-200 flex items-center gap-2.5"
            >
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
              <span>{t.watchNow}</span>
            </button>

            <button
              onClick={() => navigate(`/movie/${currentMovie.slug}`)}
              className="px-5 sm:px-6 py-3.5 rounded-2xl font-semibold text-sm sm:text-base text-white bg-midnight-800/80 hover:bg-midnight-700/80 border border-white/10 backdrop-blur-md transition flex items-center gap-2"
            >
              <Info className="w-5 h-5 text-slate-300" />
              <span>{t.movieDetails}</span>
            </button>

            <button
              onClick={handleToggleMyList}
              className={`p-3.5 rounded-2xl border backdrop-blur-md transition ${
                inList
                  ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30'
                  : 'bg-midnight-800/80 text-slate-300 hover:text-white border-white/10 hover:border-white/30'
              }`}
              title={inList ? t.removeFromList : t.addToList}
            >
              {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 right-4 sm:right-8 hidden lg:flex items-center gap-3">
          {movies.slice(0, 5).map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                idx === currentIndex
                  ? 'border-red-500 scale-110 shadow-lg shadow-red-500/30'
                  : 'border-white/20 opacity-60 hover:opacity-90'
              }`}
            >
              <img src={m.poster} alt={m.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
