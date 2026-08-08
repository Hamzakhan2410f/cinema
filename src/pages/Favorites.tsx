import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Favorites: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-900 pb-6">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-[#E50914]">CURATED COLLECTION</span>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">FAVORITE FILMS</h1>
      </div>

      <div className="py-20 text-center space-y-4 bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
        <Heart className="w-12 h-12 text-[#E50914] mx-auto fill-current" />
        <h3 className="text-xl font-black uppercase text-white">Your Favorites Archive</h3>
        <p className="text-xs text-zinc-500 font-bold uppercase max-w-sm mx-auto">
          Save your all-time favorite motion pictures here for instant rewatching.
        </p>
        <Link to="/movies" className="inline-block bg-[#E50914] text-white px-6 py-3 rounded-sm font-black text-xs uppercase tracking-widest">
          Explore Catalog
        </Link>
      </div>
    </div>
  );
};
