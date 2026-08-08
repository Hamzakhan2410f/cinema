import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Bookmark, Star, Calendar, Clock, Globe, User } from 'lucide-react';
import { useGetMovieDetailsQuery, useAddToWatchlistMutation } from '../store/services/api.js';
import { useDispatch } from 'react-redux';
import { openTrailer } from '../store/slices/uiSlice.js';

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { data, isLoading } = useGetMovieDetailsQuery(id || '');
  const [addToWatchlist] = useAddToWatchlistMutation();

  const movie = data?.data;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-3xl font-black uppercase text-[#E50914]">Movie Not Found</h2>
        <Link to="/movies" className="inline-block bg-zinc-800 px-6 py-2 rounded-sm text-xs font-black uppercase">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16 space-y-12">
      {/* Backdrop Section */}
      <div className="relative min-h-[60vh] flex items-end px-4 sm:px-8 lg:px-12 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10" />
          <img src={movie.backdropPath} alt={movie.title} className="w-full h-full object-cover opacity-40" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 items-end">
          <div className="w-48 sm:w-64 aspect-[2/3] bg-zinc-900 border-2 border-zinc-800 rounded-sm overflow-hidden shrink-0 shadow-2xl">
            <img src={movie.posterPath} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-4 flex-grow">
            <div className="flex items-center gap-2">
              <span className="bg-[#E50914] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest">
                {movie.industry}
              </span>
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {movie.rating} / 10 ({movie.voteCount} votes)
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-white">
              {movie.title}
            </h1>

            <div className="flex flex-wrap gap-2 pt-1">
              {movie.genres.map((g) => (
                <span key={g} className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-sm">
                  {g}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => dispatch(openTrailer(movie.trailerUrl || 'https://www.youtube.com/watch?v=Way9Dexny3w'))}
                className="bg-[#E50914] text-white px-8 py-3.5 rounded-sm font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-[#E50914]/20"
              >
                <Play className="w-4 h-4 fill-white" /> Watch Trailer
              </button>

              <button
                onClick={() => addToWatchlist(movie.externalId)}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-6 py-3.5 rounded-sm font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors"
              >
                <Bookmark className="w-4 h-4" /> Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview & Metadata */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#E50914]">SYNOPSIS</h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-medium">{movie.overview}</p>
          </div>

          {/* Cast */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#E50914]">TOP CAST</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {movie.cast.map((c) => (
                <div key={c.id} className="bg-zinc-950 border border-zinc-900 p-3 rounded-sm flex items-center gap-3">
                  <img
                    src={c.profilePath || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={c.name}
                    className="w-10 h-10 rounded-sm object-cover"
                  />
                  <div className="truncate">
                    <p className="text-xs font-black uppercase text-white truncate">{c.name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold truncate">{c.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-6 self-start">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#E50914]">MOVIE INFO</h3>

          <div className="space-y-4 text-xs font-bold uppercase tracking-wider">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Release Date</span>
              <span className="text-white">{movie.releaseDate}</span>
            </div>

            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Runtime</span>
              <span className="text-white">{movie.runtime} Minutes</span>
            </div>

            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Country</span>
              <span className="text-white">{movie.countries.join(', ')}</span>
            </div>

            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">Directors</span>
              <span className="text-white">{movie.directors.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
