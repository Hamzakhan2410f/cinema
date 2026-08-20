import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Film, User as UserIcon, LogOut, Shield, Heart, Bookmark, Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/index.js';
import { logout } from '../../store/slices/authSlice.js';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-zinc-900/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-sm bg-[#E50914] flex items-center justify-center text-white shadow-lg shadow-[#E50914]/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 fill-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-[#E50914] uppercase italic">
              CINEMA<span className="text-white">.</span>
            </h1>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link
              to="/"
              className={`hover:text-white transition-colors py-1 border-b-2 ${
                isActive('/') ? 'text-white border-[#E50914]' : 'border-transparent'
              }`}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className={`hover:text-white transition-colors py-1 border-b-2 ${
                isActive('/movies') ? 'text-white border-[#E50914]' : 'border-transparent'
              }`}
            >
              Browse
            </Link>
            <Link
              to="/category/hollywood"
              className={`hover:text-white transition-colors py-1 border-b-2 ${
                isActive('/category/hollywood') ? 'text-white border-[#E50914]' : 'border-transparent'
              }`}
            >
              Hollywood
            </Link>
            <Link
              to="/category/bollywood"
              className={`hover:text-white transition-colors py-1 border-b-2 ${
                isActive('/category/bollywood') ? 'text-white border-[#E50914]' : 'border-transparent'
              }`}
            >
              Bollywood
            </Link>
            <Link
              to="/category/korean"
              className={`hover:text-white transition-colors py-1 border-b-2 ${
                isActive('/category/korean') ? 'text-white border-[#E50914]' : 'border-transparent'
              }`}
            >
              Korean
            </Link>
          </nav>
        </div>

        {/* Search Bar & User Actions */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-48 md:w-64">
            <input
              type="text"
              placeholder="SEARCH MOVIES..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-[#E50914] rounded-sm py-2 pl-9 pr-4 text-xs font-bold uppercase tracking-wider text-white placeholder-zinc-500 focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/watchlist"
                title="Watchlist"
                className="w-10 h-10 rounded-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
              >
                <Bookmark className="w-4 h-4" />
              </Link>
              <Link
                to="/favorites"
                title="Favorites"
                className="w-10 h-10 rounded-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-[#E50914] transition-colors"
              >
                <Heart className="w-4 h-4 fill-current" />
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  title="Admin Dashboard"
                  className="px-3 py-2 rounded-sm bg-[#E50914] text-white flex items-center gap-1.5 text-xs font-black uppercase tracking-wider shadow-md shadow-[#E50914]/30 hover:bg-red-700 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-sm bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={user?.name}
                  className="w-6 h-6 rounded-sm object-cover"
                />
                <span className="text-xs font-black uppercase tracking-wider hidden md:inline truncate max-w-[100px]">
                  {user?.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="w-10 h-10 rounded-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white px-2.5 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-zinc-900 text-zinc-200 border border-zinc-800 px-3 py-2 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-colors hidden sm:inline-block"
              >
                Register
              </Link>
              <Link
                to="/login?admin=true"
                className="bg-[#E50914] text-white px-3.5 py-2 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-md shadow-[#E50914]/30 flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white rounded-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="SEARCH MOVIES..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-sm py-2 pl-9 pr-4 text-xs font-bold uppercase tracking-wider text-white"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
          <div className="flex flex-col gap-3 font-bold text-xs uppercase tracking-widest pt-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E50914] py-1">Home</Link>
            <Link to="/movies" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E50914] py-1">All Movies</Link>
            <Link to="/category/hollywood" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E50914] py-1">Hollywood</Link>
            <Link to="/category/bollywood" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E50914] py-1">Bollywood</Link>
            <Link to="/category/korean" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#E50914] py-1">Korean</Link>
          </div>
        </div>
      )}
    </header>
  );
};
