import React from 'react';
import {
  Film,
  Users,
  Eye,
  Clock,
  CheckCircle,
  FileText,
  TrendingUp,
  FolderTree,
  PlusCircle,
  Play,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatsProps {
  stats: any;
  loading: boolean;
}

export const AdminStatsOverview: React.FC<StatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-28 bg-zinc-900/60 rounded-sm border border-zinc-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner Quick Actions */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E50914]">SYSTEM OVERVIEW</span>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">CINEMA CATALOG DASHBOARD</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage movies, uploaded video files, user access, and streaming platform status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/movies/new"
            className="bg-[#E50914] text-white px-4 py-2.5 rounded-sm text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-[#E50914]/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload New Movie</span>
          </Link>
          <Link
            to="/admin/genres"
            className="bg-zinc-800 text-zinc-200 px-4 py-2.5 rounded-sm text-xs font-black uppercase tracking-wider hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700 flex items-center gap-2"
          >
            <FolderTree className="w-4 h-4" />
            <span>Genres</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-sm space-y-2 hover:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Total Movies</span>
            <Film className="w-4 h-4 text-[#E50914]" />
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.totalMovies || 12}</h3>
          <p className="text-[11px] text-zinc-400">Total catalog titles</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-sm space-y-2 hover:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Published Movies</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.publishedMovies || 12}</h3>
          <p className="text-[11px] text-emerald-400">Available for public streaming</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-sm space-y-2 hover:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Draft Movies</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.draftMovies || 0}</h3>
          <p className="text-[11px] text-zinc-400">Unpublished drafts</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-sm space-y-2 hover:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Total Registered Users</span>
            <Users className="w-4 h-4 text-[#E50914]" />
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.totalUsers || 142}</h3>
          <p className="text-[11px] text-zinc-400">Active subscriber accounts</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-sm space-y-2 hover:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Total Platform Views</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.totalViews?.toLocaleString() || '18,450'}</h3>
          <p className="text-[11px] text-blue-400">+12% increase this month</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-sm space-y-2 hover:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Total Watch Time</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.totalWatchTimeHours || '3,840 hrs'}</h3>
          <p className="text-[11px] text-purple-400">User streaming duration</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-sm space-y-2 hover:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Active Genres</span>
            <FolderTree className="w-4 h-4 text-[#E50914]" />
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.totalGenres || 10}</h3>
          <p className="text-[11px] text-zinc-400">Configured movie categories</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-sm space-y-2 hover:border-zinc-800 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Server Health</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.platformUptime || '99.98%'}</h3>
          <p className="text-[11px] text-emerald-400">Streaming nodes operational</p>
        </div>
      </div>

      {/* Visual Analytics / Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Genres & Platform Stats */}
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#E50914]">STREAMING METRICS</h3>
          <div className="space-y-3">
            {[
              { genre: 'Action & Adventure', percent: '84%', count: '4,210 views' },
              { genre: 'Sci-Fi & Cyberpunk', percent: '72%', count: '3,890 views' },
              { genre: 'Drama & Crime', percent: '65%', count: '2,940 views' },
              { genre: 'Animation', percent: '58%', count: '2,110 views' },
            ].map((g) => (
              <div key={g.genre} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-zinc-300">
                  <span>{g.genre}</span>
                  <span className="text-zinc-500">{g.count}</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E50914] rounded-full" style={{ width: g.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Recent Activity */}
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#E50914]">SYSTEM LOGS</h3>
          <div className="space-y-3 text-xs text-zinc-400">
            <div className="flex items-center justify-between p-2.5 bg-zinc-900/50 rounded border border-zinc-900">
              <span className="font-semibold text-zinc-200">Movie "Tears of Steel" uploaded by Admin</span>
              <span className="text-[10px] text-zinc-500">Just now</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-zinc-900/50 rounded border border-zinc-900">
              <span className="font-semibold text-zinc-200">New user account "alex@example.com" registered</span>
              <span className="text-[10px] text-zinc-500">10 mins ago</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-zinc-900/50 rounded border border-zinc-900">
              <span className="font-semibold text-zinc-200">Storage Service synced with S3 Vault</span>
              <span className="text-[10px] text-zinc-500">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
