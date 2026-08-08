import React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetWatchlistQuery, useRemoveFromWatchlistMutation } from '../store/services/api.js';
import { MovieCard } from '../components/common/MovieCard.js';

export const Watchlist: React.FC = () => {
  const { data, isLoading } = useGetWatchlistQuery();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

  const movies = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-900 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#E50914]">PERSONAL LIBRARY</span>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">YOUR WATCHLIST</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-900 animate-pulse rounded-sm" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
          <Bookmark className="w-12 h-12 text-zinc-700 mx-auto" />
          <h3 className="text-xl font-black uppercase text-white">Your Watchlist is Empty</h3>
          <p className="text-xs text-zinc-500 font-bold uppercase max-w-sm mx-auto">
            Bookmark films while exploring the library to queue them here for your next cinematic session.
          </p>
          <Link to="/movies" className="inline-block bg-[#E50914] text-white px-6 py-3 rounded-sm font-black text-xs uppercase tracking-widest">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div key={movie.externalId} className="relative group/watchlist">
              <MovieCard movie={movie} />
              <button
                onClick={() => removeFromWatchlist(movie.externalId)}
                className="absolute top-2 left-2 z-30 bg-black/80 hover:bg-red-600 border border-white/20 p-1.5 rounded-sm text-white transition-colors"
                title="Remove from Watchlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

