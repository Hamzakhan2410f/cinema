import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice.js';
import { apiJsonFetch, setAuthTokens } from '../utils/api.js';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiJsonFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!data.token || typeof data.token !== 'string') {
        throw new Error('Server did not return a valid JWT token.');
      }

      setAuthTokens(data.token, data.user);
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-8 rounded-sm space-y-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-[#E50914] text-white mx-auto flex items-center justify-center rounded-sm">
            <Film className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">CREATE CINEMA ACCOUNT</h2>
          <p className="text-xs text-zinc-500 font-bold uppercase">Join our community of movie enthusiasts</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-sm flex items-center gap-2 text-red-400 text-xs font-bold uppercase">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">FULL NAME</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivers"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E50914] rounded-sm py-2.5 pl-9 pr-4 text-xs font-bold uppercase tracking-wider text-white focus:outline-none"
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">EMAIL ADDRESS</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E50914] rounded-sm py-2.5 pl-9 pr-4 text-xs font-bold uppercase tracking-wider text-white focus:outline-none"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">PASSWORD</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E50914] rounded-sm py-2.5 pl-9 pr-4 text-xs font-bold uppercase tracking-wider text-white focus:outline-none"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">ACCOUNT TYPE</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E50914] rounded-sm py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white focus:outline-none"
            >
              <option value="user">STANDARD MEMBER</option>
              <option value="admin">PLATFORM ADMIN</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] hover:bg-red-700 text-white font-black py-3 rounded-sm text-xs uppercase tracking-widest transition-colors shadow-lg shadow-[#E50914]/20"
          >
            {loading ? 'CREATING ACCOUNT...' : 'REGISTER NOW'}
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-900 text-center text-xs font-bold text-zinc-500 uppercase">
          Already registered?{' '}
          <Link to="/login" className="text-[#E50914] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
