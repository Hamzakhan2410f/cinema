import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 text-center space-y-6">
      <div className="space-y-4 max-w-md">
        <h1 className="text-8xl font-black text-[#E50914] italic tracking-tighter">404</h1>
        <h2 className="text-2xl font-black uppercase tracking-tight text-white">REEL NOT FOUND</h2>
        <p className="text-xs text-zinc-500 font-bold uppercase leading-relaxed">
          The frame or page you are looking for has been cut from the final edit or moved to another reel.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#E50914] text-white px-8 py-3.5 rounded-sm font-black text-xs uppercase tracking-widest shadow-lg shadow-[#E50914]/20"
        >
          Return to Premieres
        </Link>
      </div>
    </div>
  );
};
