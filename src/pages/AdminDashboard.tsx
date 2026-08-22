import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout.js';
import { AdminStatsOverview } from '../components/admin/AdminStatsOverview.js';
import { AdminMoviesList } from '../components/admin/AdminMoviesList.js';
import { AdminMovieForm } from '../components/admin/AdminMovieForm.js';
import { AdminVideoManager } from '../components/admin/AdminVideoManager.js';
import { AdminGenresManager } from '../components/admin/AdminGenresManager.js';
import { AdminUsersManager } from '../components/admin/AdminUsersManager.js';
import { AdminMoviePreviewModal } from '../components/admin/AdminMoviePreviewModal.js';
import { MovieItem } from '../data/mockMovies.js';
import { Settings, Shield, HardDrive, Lock } from 'lucide-react';
import { apiJsonFetch } from '../utils/api.js';

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [previewMovie, setPreviewMovie] = useState<MovieItem | null>(null);

  useEffect(() => {
    apiJsonFetch('/admin/stats')
      .then((res) => {
        if (res?.data) setStats(res.data);
      })
      .catch((e) => console.error('Stats load error', e))
      .finally(() => setLoadingStats(false));
  }, [location.pathname]);

  const path = location.pathname;

  let content = <AdminStatsOverview stats={stats} loading={loadingStats} />;

  if (path === '/admin/movies/new') {
    content = <AdminMovieForm isEdit={false} />;
  } else if (path.includes('/edit')) {
    content = <AdminMovieForm isEdit={true} />;
  } else if (path.includes('/video')) {
    content = <AdminVideoManager />;
  } else if (path.startsWith('/admin/movies')) {
    content = <AdminMoviesList onPreviewMovie={(movie) => setPreviewMovie(movie)} />;
  } else if (path.startsWith('/admin/genres')) {
    content = <AdminGenresManager />;
  } else if (path.startsWith('/admin/users')) {
    content = <AdminUsersManager />;
  } else if (path.startsWith('/admin/settings')) {
    content = (
      <div className="space-y-6 max-w-3xl">
        <div className="border-b border-zinc-900 pb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E50914]">SYSTEM CONFIGURATION</span>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">PLATFORM SETTINGS</h1>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-4 text-xs">
          <h3 className="font-bold text-white uppercase flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#E50914]" />
            <span>Video Storage Provider Configuration</span>
          </h3>
          <p className="text-zinc-400">
            Configure default storage vault credentials for uploading and hosting authorized movie media files.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Active Storage Provider</label>
              <input
                type="text"
                disabled
                value="AWS S3 / Cloud Storage Abstraction (storageService.ts)"
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 p-2.5 rounded-sm"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Media Storage Bucket</label>
              <input
                type="text"
                disabled
                value="cinema-movie-vault"
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 p-2.5 rounded-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-4 text-xs">
          <h3 className="font-bold text-white uppercase flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#E50914]" />
            <span>Security & Authentication</span>
          </h3>
          <p className="text-zinc-400">
            Platform uses JWT authentication tokens, bcrypt password hashing, and role-based permissions middleware.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      {content}
      <AdminMoviePreviewModal movie={previewMovie} onClose={() => setPreviewMovie(null)} />
    </AdminLayout>
  );
};
