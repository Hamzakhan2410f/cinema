import React from 'react';
import { Play, Star, TrendingUp, ArrowRight, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetTrendingMoviesQuery, useGetPopularMoviesQuery, useGetTopRatedMoviesQuery } from '../store/services/api.js';
import { useDispatch } from 'react-redux';
import { openTrailer } from '../store/slices/uiSlice.js';
import { MovieCard } from '../components/common/MovieCard.js';
import { CLIENT_FALLBACK_MOVIES } from '../data/mockMovies.js';

export const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { data: trendingData } = useGetTrendingMoviesQuery();
  const { data: popularData } = useGetPopularMoviesQuery();
  const [historyMovies, setHistoryMovies] = React.useState<any[]>([]);

  React.useEffect(() => {
    const token = localStorage.getItem('cinema_token');
    if (token) {
      fetch('/api/history', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data) setHistoryMovies(data.data.slice(0, 6));
        })
        .catch(() => {});
    }
  }, []);

  const trendingList = (trendingData?.data && trendingData.data.length > 0) ? trendingData.data : CLIENT_FALLBACK_MOVIES;
  const popularList = (popularData?.data && popularData.data.length > 0) ? popularData.data : CLIENT_FALLBACK_MOVIES;

  const heroMovie = trendingList[0];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner with Bold Typography */}
      <section className="relative min-h-[85vh] flex items-center px-4 sm:px-8 lg:px-12 overflow-hidden">
        {/* Background Backdrop */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-3xl pt-12 space-y-6">
          <div className="flex items-center gap-3">
            <span className="bg-[#E50914] text-white text-[10px] font-black px-2.5 py-1 rounded-sm tracking-widest uppercase shadow-md shadow-[#E50914]/30">
              #1 TRENDING TODAY
            </span>
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {heroMovie?.rating || '8.5'} &bull; {heroMovie?.releaseDate?.split('-')[0] || '2024'} &bull; {heroMovie?.industry || 'Hollywood'}
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic text-white drop-shadow-2xl">
            {heroMovie?.title || 'DUNE: PART TWO'}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-medium max-w-2xl line-clamp-3">
            {heroMovie?.overview ||
              'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {heroMovie && (
              <Link
                to={`/watch/${heroMovie.externalId}`}
                className="bg-[#E50914] text-white px-8 py-4 rounded-sm font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-red-700 transition-all shadow-xl shadow-[#E50914]/25 hover:scale-105 active:scale-95"
              >
                <Film className="w-4 h-4 fill-current" /> Watch Movie
              </Link>
            )}

            <button
              onClick={() =>
                dispatch(
                  openTrailer({
                    movieId: heroMovie?.externalId,
                    movieTitle: heroMovie?.title,
                    trailerUrl: heroMovie?.trailerUrl,
                    trailerKey: heroMovie?.trailerKey,
                  })
                )
              }
              className="bg-zinc-900/90 border border-zinc-700/80 text-white px-7 py-4 rounded-sm font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" /> Watch Trailer
            </button>

            {heroMovie && (
              <Link
                to={`/movie/${heroMovie.externalId}`}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all hover:scale-105"
              >
                Details
              </Link>
            )}
          </div>
        </div>

        {/* Side Decorative Banner */}
        <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-center gap-8 z-20">
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#E50914] to-transparent" />
          <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-black tracking-[0.4em] uppercase text-[#E50914]">
            BLOCKBUSTER SEASON 2026
          </span>
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#E50914] to-transparent" />
        </div>
      </section>

      {/* Continue Watching Section */}
      {historyMovies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-[#E50914]" />
              <h2 className="text-xl font-black uppercase tracking-wider text-white">Continue Watching</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {historyMovies.map((item) => {
              const m = item.movieDetails || item.movie;
              if (!m) return null;
              return (
                <div key={item._id || m.externalId} className="relative group/history">
                  <MovieCard movie={m} />
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 z-30 overflow-hidden rounded-b-sm">
                    <div
                      className="h-full bg-[#E50914]"
                      style={{ width: `${Math.min(100, (item.progress / (item.duration || 120)) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#E50914]" />
            <h2 className="text-xl font-black uppercase tracking-wider text-white">Trending Movies</h2>
          </div>
          <Link to="/movies" className="text-xs font-black uppercase tracking-widest text-[#E50914] hover:text-red-400 flex items-center gap-1 transition-colors">
            Explore All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {trendingList.slice(0, 6).map((movie) => (
            <MovieCard key={movie.externalId} movie={movie} />
          ))}
        </div>
      </section>

      {/* Popular Movies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-[#E50914]" />
            <h2 className="text-xl font-black uppercase tracking-wider text-white">Top Popular Releases</h2>
          </div>
          <Link to="/movies" className="text-xs font-black uppercase tracking-widest text-[#E50914] hover:text-red-400 flex items-center gap-1 transition-colors">
            Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {popularList.slice(0, 6).map((movie) => (
            <MovieCard key={movie.externalId} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

