import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Star } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { storage } from '../../lib/storage';
import { useLanguage } from '../../context/LanguageContext';
import { movieTranslator } from '../../utils/movieTranslator';

interface MovieCardProps {
  movie: Movie;
  showProgress?: boolean;
  progressPercent?: number;
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  showProgress = false, 
  progressPercent = 0,
  className = ''
}) => {
  const { language } = useLanguage();
  const [inList, setInList] = useState(() => storage.isInMyList(movie.id));
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const handleToggleMyList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = storage.toggleMyList(movie);
    setInList(added);
  };

  const fallbackPoster = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop';
  const displayTitle = movieTranslator.getTitle(movie.title, movie.originalTitle, language);
  const displaySubtitle = movieTranslator.getSubtitle(movie.title, movie.originalTitle, language);
  const displayStatus = movieTranslator.getStatus(movie.status, language);
  const displayCountry = movieTranslator.getCountry(movie.country, language);

  return (
    <div className={`group relative w-full cursor-pointer select-none ${className}`}>
      <Link to={`/movie/${movie.slug}`} className="block">
        <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-midnight-800 border border-white/5 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-black/80 group-hover:border-red-500/40">
          <img
            src={imgError ? fallbackPoster : (movie.poster || fallbackPoster)}
            alt={displayTitle}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
            {displayStatus && (
              <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-amber-300 border border-amber-300/20">
                {displayStatus}
              </span>
            )}
          </div>

          {movie.rating && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-amber-400 border border-white/10 text-[11px] font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{movie.rating}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 z-20">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/watch/${movie.slug}`);
                }}
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 hover:scale-110 transition"
                title={language === 'en' ? 'Watch now' : 'Xem ngay'}
              >
                <Play className="w-4 h-4 fill-white translate-x-0.5" />
              </button>

              <button
                onClick={handleToggleMyList}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${
                  inList
                    ? 'bg-amber-400 text-midnight-950 border-amber-400 shadow-md'
                    : 'bg-midnight-900/80 text-white border-white/20 hover:border-white hover:bg-white/10'
                }`}
                title={inList ? (language === 'en' ? 'In My List' : 'Đã lưu vào danh sách') : (language === 'en' ? 'Add to List' : 'Lưu vào danh sách')}
              >
                {inList ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <span>{movie.releaseYear}</span>
                <span>•</span>
                <span className="truncate max-w-[100px]">{displayCountry}</span>
              </div>
              <div className="text-[11px] text-red-300 truncate font-medium">
                {movie.genres.map(g => movieTranslator.getGenre(g, language)).slice(0, 2).join(', ')}
              </div>
            </div>
          </div>

          {showProgress && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800 z-30">
              <div 
                className="h-full bg-red-600"
                style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
              />
            </div>
          )}
        </div>

        <div className="mt-2.5 space-y-0.5 px-0.5">
          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-red-400 transition-colors truncate" title={displayTitle}>
            {displayTitle}
          </h3>
          <p className="text-xs text-slate-400 truncate">
            {displaySubtitle}
          </p>
        </div>
      </Link>
    </div>
  );
};
