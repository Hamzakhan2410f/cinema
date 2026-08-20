import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Star, Bookmark, Info, Film } from 'lucide-react';
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
    dispatch(
      openTrailer({
        movieId: movie.externalId,
        movieTitle: movie.title,
        trailerUrl: movie.trailerUrl,
        trailerKey: movie.trailerKey,
      })
    );
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-20 space-y-2">
          {/* Watch Movie Link */}
          <Link
            to={`/watch/${movie.externalId}`}
            className="w-full bg-[#E50914] text-white py-2 px-3 rounded-sm text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-red-700 transition-colors shadow-md shadow-[#E50914]/30"
          >
            <Film className="w-3 h-3 fill-current" />
            <span>Watch Movie</span>
          </Link>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlayTrailer}
              className="flex-1 bg-zinc-800 text-zinc-200 py-1.5 px-2 rounded-sm text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700"
              title="Watch Trailer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Trailer</span>
            </button>

            <button
              onClick={handleAddWatchlist}
              disabled={isAdding}
              className="w-7 h-7 rounded-sm bg-zinc-800/80 hover:bg-[#E50914] border border-zinc-700 text-white flex items-center justify-center transition-colors shrink-0"
              title="Add to Watchlist"
            >
              <Heart className="w-3 h-3 fill-current text-white" />
            </button>

            <Link
              to={`/movie/${movie.externalId}`}
              className="w-7 h-7 rounded-sm bg-zinc-800/80 hover:bg-white hover:text-black border border-zinc-700 text-white flex items-center justify-center transition-colors shrink-0"
              title="Movie Details"
            >
              <Info className="w-3 h-3" />
            </Link>
          </div>
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
