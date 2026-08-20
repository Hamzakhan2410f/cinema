import React from 'react';
import { X, Play, Film, Star, Clock, Heart, ShieldCheck } from 'lucide-react';
import { MovieItem } from '../../data/mockMovies.js';

interface PreviewProps {
  movie: MovieItem | null;
  onClose: () => void;
}

export const AdminMoviePreviewModal: React.FC<PreviewProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  const hasVideo = !!(movie as any).videoUrl || ['693134', '872585', '572802', '496243', '372058', '1050035'].includes(movie.externalId);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-sm max-w-3xl w-full overflow-hidden shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-[#E50914] text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Backdrop Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-900">
          <img
            src={movie.backdropPath}
            alt={movie.title}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

          {/* Admin Watermark */}
          <div className="absolute top-4 left-4 bg-[#E50914] text-white px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
            <ShieldCheck className="w-3 h-3" />
            <span>ADMIN PREVIEW MODE</span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-end gap-5">
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="w-24 sm:w-32 h-36 sm:h-48 object-cover rounded-sm border-2 border-zinc-800 shadow-xl shrink-0"
            />
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-white">
                {movie.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300 font-bold">
                <span className="text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {movie.rating?.toFixed(1)}
                </span>
                <span>{movie.releaseDate?.slice(0, 4)}</span>
                <span>{movie.runtime || 120} min</span>
                <span className="text-xs text-[#E50914] bg-[#E50914]/10 border border-[#E50914]/30 px-2 py-0.5 rounded-sm">
                  {movie.genres?.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Action Preview */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#E50914]">SYNOPSIS</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">{movie.overview}</p>
          </div>

          {/* Action buttons as users see them */}
          <div className="pt-2 border-t border-zinc-900 space-y-3">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">User Interface Action Controls</span>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`/watch/${movie.externalId}`}
                target="_blank"
                rel="noreferrer"
                className={`px-5 py-2.5 rounded-sm text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md ${
                  hasVideo
                    ? 'bg-[#E50914] text-white hover:bg-red-700 shadow-[#E50914]/30'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Watch Movie {hasVideo ? '' : '(No Video Assigned)'}</span>
              </a>

              <button className="px-4 py-2.5 bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-sm text-xs font-bold uppercase flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch Trailer</span>
              </button>

              <button className="px-4 py-2.5 bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-sm text-xs font-bold uppercase flex items-center gap-2">
                <Heart className="w-3.5 h-3.5" />
                <span>Watchlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
