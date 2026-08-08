import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Github, Twitter, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] border-t border-zinc-900 pt-16 pb-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-[#E50914] flex items-center justify-center text-white">
                <Film className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-[#E50914] uppercase italic">
                CINEMA<span className="text-white">.</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm font-medium">
              A modern cinematic platform to discover blockbuster films, upcoming indie masterworks, regional legends, and global motion pictures.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#E50914] transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#E50914] transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#E50914] transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-4">Discovery</h4>
            <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider">
              <li><Link to="/movies" className="hover:text-white transition-colors">Browse All</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Search Library</Link></li>
              <li><Link to="/category/hollywood" className="hover:text-white transition-colors">Hollywood</Link></li>
              <li><Link to="/category/bollywood" className="hover:text-white transition-colors">Bollywood</Link></li>
              <li><Link to="/category/korean" className="hover:text-white transition-colors">Korean Cinema</Link></li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-4">Top Genres</h4>
            <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider">
              <li><Link to="/genre/Action" className="hover:text-white transition-colors">Action</Link></li>
              <li><Link to="/genre/Sci-Fi" className="hover:text-white transition-colors">Sci-Fi</Link></li>
              <li><Link to="/genre/Drama" className="hover:text-white transition-colors">Drama</Link></li>
              <li><Link to="/genre/Thriller" className="hover:text-white transition-colors">Thriller</Link></li>
              <li><Link to="/genre/Animation" className="hover:text-white transition-colors">Animation</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-4">Account</h4>
            <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider">
              <li><Link to="/watchlist" className="hover:text-white transition-colors">Watchlist</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition-colors">Favorites</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">User Profile</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between text-xs font-semibold text-zinc-500 gap-4">
          <p>© 2026 CINEMA. All rights reserved. Powered by MERN & TMDB Service.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#E50914] fill-current" />
            <span>for film lovers worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
