import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie';
import { MovieCard } from '../movie/MovieCard';
import { useLanguage } from '../../context/LanguageContext';

interface MovieSectionProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  viewAllLink?: string;
}

export const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  subtitle,
  movies,
  viewAllLink
}) => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="relative py-6 sm:py-8 group">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
              <span>{title}</span>
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {viewAllLink && (
              <Link
                to={viewAllLink}
                className="text-xs sm:text-sm font-semibold text-red-400 hover:text-white flex items-center gap-1 transition mr-2"
              >
                <span>{t.viewAll}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            {/* Scroll Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => handleScroll('left')}
                className="p-1.5 rounded-full bg-midnight-800/80 hover:bg-midnight-700 text-slate-300 hover:text-white border border-white/5 transition"
                aria-label="Cuộn sang trái"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="p-1.5 rounded-full bg-midnight-800/80 hover:bg-midnight-700 text-slate-300 hover:text-white border border-white/5 transition"
                aria-label="Cuộn sang phải"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Movie Row */}
        <div
          ref={scrollContainerRef}
          className="flex items-start gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} className="shrink-0 w-36 sm:w-44 md:w-52 lg:w-56" />
          ))}
        </div>
      </div>
    </section>
  );
};
