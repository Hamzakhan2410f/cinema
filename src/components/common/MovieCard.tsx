import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Star, Bookmark, Info } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openTrailer } from '../../store/slices/uiSlice.js';
import { useAddToWatchlistMutation } from '../../store/services/api.js';
import { Movie } from '../../types/index.js';

interface MovieCardProps {
  movie: Movie;
  showActions?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, showActions = true }) => {
  const dispatch = useDispatch();
  const [addToWatchlist, { isLoading: isAdding }] = useAddToWatchlistMutation();

  const handlePlayTrailer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(openTrailer(movie.trailerUrl || 'https://www.youtube.com/watch?v=Way9Dexny3w'));
  };

  const handleAddWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWatchlist(movie.externalId);
  };

  return (
    <div className="group relative flex flex-col w-full">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] bg-zinc-900 rounded-sm overflow-hidden border border-zinc-800 transition-all duration-300 group-hover:scale-105 group-hover:border-[#E50914] group-hover:shadow-xl group-hover:shadow-[#E50914]/20">
        <img
          src={movie.posterPath}
          alt={movie.title}
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-300"
          loading="lazy"
        />

        {/* Rating Badge (Always visible or on poster) */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-sm text-[10px] font-black text-amber-400 flex items-center gap-1 z-10">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{movie.rating}</span>
        </div>

        {/* Dark Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20 space-y-3">
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayTrailer}
              className="flex-1 bg-[#E50914] text-white py-2 px-3 rounded-sm text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-red-700 transition-colors shadow-md shadow-[#E50914]/30"
              title="Play Trailer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Play</span>
            </button>

            <button
              onClick={handleAddWatchlist}
              disabled={isAdding}
              className="w-8 h-8 rounded-sm bg-white/10 hover:bg-[#E50914] border border-white/20 text-white flex items-center justify-center transition-colors"
              title="Add to Watchlist"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-white" />
            </button>
          </div>

          <Link
            to={`/movie/${movie.externalId}`}
            className="w-full bg-zinc-900/90 hover:bg-white hover:text-black text-white border border-zinc-700 text-center py-1.5 rounded-sm text-[10px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
          >
            <Info className="w-3 h-3" />
            <span>Details</span>
          </Link>
        </div>
      </div>

      {/* Metadata Below Card */}
      <Link to={`/movie/${movie.externalId}`} className="mt-3 space-y-0.5">
        <h4 className="text-xs font-black uppercase tracking-widest text-white truncate group-hover:text-[#E50914] transition-colors">
          {movie.title}
        </h4>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
          <span>{movie.releaseDate ? movie.releaseDate.split('-')[0] : '2024'}</span>
          <span>&bull;</span>
          <span className="text-zinc-400">{movie.genres?.[0] || 'Drama'}</span>
        </p>
      </Link>
    </div>
  );
};
