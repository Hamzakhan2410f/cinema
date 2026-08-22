import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Movie } from '../types/index.js';
import { MovieCard } from '../components/common/MovieCard.js';
import { apiJsonFetch } from '../utils/api.js';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      apiJsonFetch(`/movies/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          if (res?.data) setMovies(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-900 pb-6">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-[#E50914]">SEARCH RESULTS</span>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
          "{query}"
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-900 animate-pulse rounded-sm" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <SearchIcon className="w-12 h-12 text-zinc-700 mx-auto" />
          <p className="text-sm font-bold uppercase text-zinc-500">No movies found matching your search term.</p>
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

