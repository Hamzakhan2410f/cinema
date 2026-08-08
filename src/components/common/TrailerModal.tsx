import React from 'react';
import { X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/index.js';
import { closeTrailer } from '../../store/slices/uiSlice.js';

export const TrailerModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isTrailerOpen, activeTrailerUrl } = useSelector((state: RootState) => state.ui);

  if (!isTrailerOpen || !activeTrailerUrl) return null;

  // Convert youtube watch URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <span className="text-xs font-black uppercase tracking-widest text-[#E50914]">Official Trailer</span>
          <button
            onClick={() => dispatch(closeTrailer())}
            className="w-8 h-8 rounded-sm bg-zinc-800 hover:bg-[#E50914] text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={getEmbedUrl(activeTrailerUrl)}
            title="Movie Trailer"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
