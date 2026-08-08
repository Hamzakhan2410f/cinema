import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/index.js';
import { logout } from '../store/slices/authSlice.js';
import { User, Shield, Film, Bookmark, Heart, LogOut } from 'lucide-react';

export const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm flex flex-col md:flex-row items-center gap-8">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
          alt={user?.name}
          className="w-24 h-24 rounded-sm object-cover border-2 border-[#E50914]"
        />
        <div className="space-y-2 text-center md:text-left flex-grow">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">{user?.name}</h1>
            {user?.role === 'admin' && (
              <span className="bg-[#E50914] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest">
                ADMIN
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 font-bold uppercase">{user?.email}</p>
        </div>

        <button
          onClick={() => dispatch(logout())}
          className="bg-zinc-900 border border-zinc-800 hover:border-red-500/50 text-red-500 hover:bg-red-500/10 px-6 py-3 rounded-sm text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-2">
          <Bookmark className="w-6 h-6 text-[#E50914]" />
          <h3 className="text-2xl font-black text-white">4</h3>
          <p className="text-xs font-bold uppercase text-zinc-500">Watchlist Movies</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-2">
          <Heart className="w-6 h-6 text-[#E50914] fill-current" />
          <h3 className="text-2xl font-black text-white">12</h3>
          <p className="text-xs font-bold uppercase text-zinc-500">Favorite Films</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-2">
          <Film className="w-6 h-6 text-[#E50914]" />
          <h3 className="text-2xl font-black text-white">8</h3>
          <p className="text-xs font-bold uppercase text-zinc-500">Reviews Written</p>
        </div>
      </div>
    </div>
  );
};
