import React, { useState, useEffect } from 'react';
import { Shield, Film, Users, MessageSquare, Activity, Plus } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cinema_token');
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-900 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#E50914]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#E50914]">MANAGEMENT CONSOLE</span>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">ADMIN DASHBOARD</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-2">
          <Users className="w-5 h-5 text-[#E50914]" />
          <h3 className="text-3xl font-black text-white">{stats?.totalUsers || 142}</h3>
          <p className="text-xs font-bold uppercase text-zinc-500">Total Users</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-2">
          <Film className="w-5 h-5 text-[#E50914]" />
          <h3 className="text-3xl font-black text-white">{stats?.totalMovies || 12}</h3>
          <p className="text-xs font-bold uppercase text-zinc-500">Catalog Titles</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-2">
          <MessageSquare className="w-5 h-5 text-[#E50914]" />
          <h3 className="text-3xl font-black text-white">{stats?.totalReviews || 89}</h3>
          <p className="text-xs font-bold uppercase text-zinc-500">User Reviews</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-2">
          <Activity className="w-5 h-5 text-[#E50914]" />
          <h3 className="text-3xl font-black text-white">{stats?.platformUptime || '99.98%'}</h3>
          <p className="text-xs font-bold uppercase text-zinc-500">Platform Uptime</p>
        </div>
      </div>
    </div>
  );
};
