import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  ArrowLeft,
  Play,
  Star,
  Clock,
  Film,
  Plus,
  Check,
  VideoOff,
  Sparkles,
} from 'lucide-react';
import { MoviePlayer } from '../components/player/MoviePlayer.js';
import { MovieCard } from '../components/common/MovieCard.js';
import { openTrailer } from '../store/slices/uiSlice.js';
import { apiFetch } from '../utils/api.js';
import {
  useGetMovieDetailsQuery,
  useGetMovieFullVideoQuery,
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useGetHollywoodMoviesQuery,
} from '../store/services/api.js';

export const WatchPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeId = movieId || '';

  // Fetch movie details
  const { data: movieData, isLoading: isMovieLoading } = useGetMovieDetailsQuery(activeId, {
    skip: !activeId,
  });

  // Fetch full video source info
  const { data: videoData, isLoading: isVideoLoading } = useGetMovieFullVideoQuery(activeId, {
    skip: !activeId,
  });

  // Record view & history
  React.useEffect(() => {
    if (activeId) {
      // Record view count increment
      apiFetch(`/movies/${activeId}/view`, { method: 'POST' }).catch(() => {});

      // Record watch history if authenticated
      const token = localStorage.getItem('cinema_token');
      if (token) {
        apiFetch('/history', {
          method: 'POST',
          body: JSON.stringify({
            movieId: activeId,
            progress: 10,
            duration: 120,
            completed: false,
          }),
        }).catch(() => {});
      }
    }
  }, [activeId]);

  // Recommended movies query
  const { data: recommendedData } = useGetHollywoodMoviesQuery();

  // Watchlist query & mutation
  const { data: watchlistData } = useGetWatchlistQuery();
  const [addToWatchlist] = useAddToWatchlistMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

  const movie = movieData?.data;
  const videoInfo = videoData?.data;
  const isInWatchlist = watchlistData?.data?.some((m) => m.externalId === activeId);

  const handleToggleWatchlist = () => {
    if (!activeId) return;
    if (isInWatchlist) {
      removeFromWatchlist(activeId);
    } else {
      addToWatchlist(activeId);
    }
  };

  const handleWatchTrailer = () => {
    if (!movie) return;
    dispatch(
      openTrailer({
        movieId: movie.externalId,
        movieTitle: movie.title,
        trailerUrl: movie.trailerUrl,
        trailerKey: movie.trailerKey,
      })
    );
  };

  if (isMovieLoading || isVideoLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4 pt-16">
        <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
          LOADING MOVIE PLAYER...
        </span>
      </div>
    );
  }

  const releaseYear = movie?.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A';
  const hasPlayableSource = Boolean(videoInfo?.hasVideo && videoInfo?.videoUrl);

  const similarMovies = recommendedData?.data?.filter((m) => m.externalId !== activeId).slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => (movie?.externalId ? navigate(`/movie/${movie.externalId}`) : navigate(-1))}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Details</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
              CINEMA WATCH
            </span>
          </div>
        </div>

        {/* Player Area or Unavailable Notice */}
        {hasPlayableSource ? (
          <div className="space-y-4">
            <MoviePlayer
              movie={movie}
              videoUrl={videoInfo?.videoUrl}
              videoType={videoInfo?.videoType}
              poster={movie?.backdropPath}
              title={movie?.title}
              onBack={() => (movie?.externalId ? navigate(`/movie/${movie.externalId}`) : navigate(-1))}
            />
          </div>
        ) : (
          <div className="w-full aspect-video max-h-[70vh] bg-zinc-900/80 border border-zinc-800/80 rounded-xl flex flex-col items-center justify-center p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
            {/* Background Backdrop Blur */}
            {movie?.backdropPath && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 blur-xl pointer-events-none"
                style={{ backgroundImage: `url(${movie.backdropPath})` }}
              />
            )}

            <div className="p-5 bg-red-950/40 border border-red-800/50 rounded-full text-[#E50914] z-10">
              <VideoOff className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-lg z-10">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                FULL MOVIE NOT AVAILABLE
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                This movie does not currently have a playable source on CINEMA.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 z-10">
              {movie?.externalId && (
                <button
                  onClick={() => navigate(`/movie/${movie.externalId}`)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-sm transition-colors"
                >
                  Back to Movie Details
                </button>
              )}

              <button
                onClick={handleWatchTrailer}
                className="bg-[#E50914] hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-sm transition-all shadow-lg shadow-[#E50914]/20 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" /> Watch Official Trailer
              </button>
            </div>
          </div>
        )}

        {/* Movie Info Section below Player */}
        {movie && (
          <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/80 pb-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
                    {movie.title}
                  </h1>
                  <span className="px-2.5 py-0.5 bg-zinc-800 text-zinc-300 font-mono text-xs font-bold rounded">
                    {releaseYear}
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40 font-mono text-xs font-bold rounded">
                    {movie.industry}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-400">
                  <div className="flex items-center gap-1.5 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="text-white">{movie.rating}</span>
                    <span className="text-zinc-500">({movie.voteCount} votes)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <span>{movie.runtime} min</span>
                  </div>

                  {movie.genres?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-zinc-500" />
                      <span>{movie.genres.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleWatchTrailer}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-sm transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" /> Watch Trailer
                </button>

                <button
                  onClick={handleToggleWatchlist}
                  className={`font-black text-xs uppercase tracking-widest px-5 py-3 rounded-sm transition-colors flex items-center gap-2 border ${
                    isInWatchlist
                      ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                      : 'bg-[#E50914] text-white border-[#E50914] hover:bg-red-700'
                  }`}
                >
                  {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>
              </div>
            </div>

            {/* Overview & Crew */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-xs font-black uppercase text-[#E50914] tracking-widest">
                  SYNOPSIS
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                  {movie.overview}
                </p>
              </div>

              <div className="space-y-4 bg-zinc-950/60 p-5 rounded-lg border border-zinc-800/60">
                {movie.directors?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">
                      DIRECTOR
                    </span>
                    <span className="text-xs font-bold text-white block">
                      {movie.directors.join(', ')}
                    </span>
                  </div>
                )}

                {movie.cast?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">
                      STARRING
                    </span>
                    <span className="text-xs font-bold text-zinc-300 block">
                      {movie.cast.map((c) => c.name).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recommended Movies Section */}
        {similarMovies.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E50914]" />
              <h2 className="text-lg font-black uppercase text-white tracking-wider">
                MORE LIKE THIS
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMovies.map((simMovie) => (
                <MovieCard key={simMovie.externalId} movie={simMovie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
