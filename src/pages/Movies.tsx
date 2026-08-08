import React, { useState, useEffect } from 'react';
import { Movie } from '../types/index.js';
import { MovieCard } from '../components/common/MovieCard.js';

export const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/movies')
      .then((res) => res.json())
      .then((res) => {
        if (res.data) setMovies(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-900 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#E50914]">CATALOG ARCHIVE</span>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">ALL MOVIES</h1>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-900 animate-pulse rounded-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.externalId} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

