import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types/index.js';
import { MovieCard } from '../components/common/MovieCard.js';
import { apiJsonFetch } from '../utils/api.js';

export const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (category) {
      const endpoint = category.toLowerCase() === 'hollywood' ? '/movies/hollywood' : category.toLowerCase() === 'bollywood' ? '/movies/bollywood' : `/movies`;
      apiJsonFetch(endpoint)
        .then((res) => {
          if (res?.data) setMovies(res.data);
        })
        .catch((e) => console.error('Failed to load category movies', e));
    }
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-900 pb-6">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-[#E50914]">REGIONAL ARCHIVE</span>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">{category} CINEMA</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.externalId} movie={movie} />
        ))}
      </div>
    </div>
  );
};

