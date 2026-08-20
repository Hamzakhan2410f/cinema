import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Film,
  Upload,
  ArrowLeft,
  CheckCircle,
  Video,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface AdminMovieFormProps {
  isEdit?: boolean;
}

export const AdminMovieForm: React.FC<AdminMovieFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    overview: '',
    releaseDate: new Date().toISOString().slice(0, 10),
    language: 'English',
    country: 'United States',
    runtime: 120,
    genres: ['Action', 'Sci-Fi'],
    rating: 8.0,
    castInput: 'Robert Downey Jr. (Tony Stark), Chris Evans (Steve Rogers)',
    directorsInput: 'Anthony Russo, Joe Russo',
    posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
    backdropPath: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1600',
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    videoUrl: '',
    videoType: 'mp4' as 'mp4' | 'hls' | 'external',
    videoStorageProvider: 's3',
    featured: false,
    isPublished: true,
    isComingSoon: false,
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchMovieData(id);
    }
  }, [isEdit, id]);

  const fetchMovieData = async (movieId: string) => {
    try {
      const res = await fetch(`/api/movies/${movieId}`);
      const data = await res.json();
      if (data.data) {
        const m = data.data;
        setFormData({
          title: m.title || '',
          shortDescription: m.shortDescription || m.overview?.slice(0, 100) || '',
          overview: m.overview || '',
          releaseDate: m.releaseDate || new Date().toISOString().slice(0, 10),
          language: m.languages?.[0] || 'English',
          country: m.countries?.[0] || 'United States',
          runtime: m.runtime || 120,
          genres: m.genres || ['Action'],
          rating: m.rating || 8.0,
          castInput: m.cast?.map((c: any) => `${c.name} (${c.character})`).join(', ') || '',
          directorsInput: m.directors?.join(', ') || '',
          posterPath: m.posterPath || '',
          backdropPath: m.backdropPath || '',
          trailerUrl: m.trailerUrl || '',
          videoUrl: m.videoUrl || '',
          videoType: m.videoType || 'mp4',
          videoStorageProvider: m.videoStorageProvider || 's3',
          featured: !!m.featured,
          isPublished: m.isPublished !== false,
          isComingSoon: !!m.isComingSoon,
        });
      }
    } catch (e) {
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/') && !file.name.endsWith('.m3u8')) {
      alert('Please select a valid MP4, WebM or HLS video file.');
      return;
    }

    setIsUploadingVideo(true);
    setUploadProgress(10);

    let progress = 10;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploadingVideo(false);
        // Set sample authorized media URL or uploaded reference URL
        setFormData((prev) => ({
          ...prev,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          videoType: file.name.endsWith('.m3u8') ? 'hls' : 'mp4',
        }));
      }
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const cast = formData.castInput.split(',').map((item, idx) => {
      const parts = item.split('(');
      const name = parts[0]?.trim() || item.trim();
      const character = parts[1]?.replace(')', '').trim() || 'Cast Member';
      return { id: idx + 1, name, character };
    });

    const directors = formData.directorsInput.split(',').map((d) => d.trim()).filter(Boolean);

    const payload = {
      ...formData,
      cast,
      directors,
      languages: [formData.language],
      countries: [formData.country],
      externalId: isEdit && id ? id : 'custom_' + Date.now(),
    };

    try {
      const token = localStorage.getItem('cinema_token');
      const url = isEdit && id ? `/api/admin/movies/${id}` : '/api/admin/movies';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        navigate('/admin/movies');
      } else {
        setError(data.message || 'Error saving movie');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit movie data');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading form...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/movies')}
            className="p-2 bg-zinc-900 text-zinc-400 hover:text-white rounded-sm border border-zinc-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E50914]">MOVIE MANAGER</span>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              {isEdit ? 'EDIT MOVIE ENTRY' : 'ADD NEW MOVIE'}
            </h1>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/80 border border-red-800 text-red-200 p-3 rounded-sm text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#E50914]">1. GENERAL INFORMATION</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Movie Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Inception"
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Release Date *</label>
              <input
                type="date"
                required
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Runtime (Minutes) *</label>
              <input
                type="number"
                required
                value={formData.runtime}
                onChange={(e) => setFormData({ ...formData, runtime: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Rating (1.0 - 10.0) *</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                required
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Primary Language</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief 1-sentence tagline"
              className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Full Overview / Synopsis *</label>
            <textarea
              rows={4}
              required
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              placeholder="Detailed plot overview..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Cast Members (Comma separated)</label>
              <input
                type="text"
                value={formData.castInput}
                onChange={(e) => setFormData({ ...formData, castInput: e.target.value })}
                placeholder="Actor (Role), Actor 2 (Role 2)"
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Directors (Comma separated)</label>
              <input
                type="text"
                value={formData.directorsInput}
                onChange={(e) => setFormData({ ...formData, directorsInput: e.target.value })}
                placeholder="Director 1, Director 2"
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>
        </div>

        {/* Media Assets (Posters & Trailer) */}
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#E50914]">2. MEDIA ASSETS & TRAILER</h3>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Poster Image URL *</label>
            <input
              type="text"
              required
              value={formData.posterPath}
              onChange={(e) => setFormData({ ...formData, posterPath: e.target.value })}
              placeholder="https://..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Backdrop Image URL *</label>
            <input
              type="text"
              required
              value={formData.backdropPath}
              onChange={(e) => setFormData({ ...formData, backdropPath: e.target.value })}
              placeholder="https://..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Official YouTube Trailer URL or Key</label>
            <input
              type="text"
              value={formData.trailerUrl}
              onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
            />
          </div>
        </div>

        {/* Full Movie Stream Storage */}
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#E50914]">3. AUTHORIZED FULL MOVIE VIDEO FILE</h3>
          <p className="text-xs text-zinc-400">
            Select or upload authorized MP4 / HLS movie source. Note: Video file reference is stored safely in database.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Video Stream Type</label>
              <select
                value={formData.videoType}
                onChange={(e) => setFormData({ ...formData, videoType: e.target.value as any })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              >
                <option value="mp4">MP4 Video File</option>
                <option value="hls">Adaptive HLS (.m3u8)</option>
                <option value="external">External Authorized Stream</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Storage Provider</label>
              <select
                value={formData.videoStorageProvider}
                onChange={(e) => setFormData({ ...formData, videoStorageProvider: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              >
                <option value="s3">AWS S3 Vault</option>
                <option value="cloudinary">Cloudinary Media</option>
                <option value="cloudflare">Cloudflare R2</option>
                <option value="supabase">Supabase Storage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Full Movie Direct Stream URL</label>
            <input
              type="text"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="e.g. https://storage.googleapis.com/.../movie.mp4"
              className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* File Upload Box */}
          <div className="border-2 border-dashed border-zinc-800 hover:border-[#E50914] p-6 rounded-sm text-center transition-colors">
            <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
            <span className="text-xs font-bold text-white block">Upload Movie File to Storage</span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">Supports MP4, WebM, HLS (.m3u8)</span>
            <input
              type="file"
              accept="video/mp4,video/webm,.m3u8"
              onChange={handleVideoUploadSimulate}
              className="mt-3 block mx-auto text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-[#E50914] file:text-white hover:file:bg-red-700 cursor-pointer"
            />

            {isUploadingVideo && (
              <div className="mt-4 max-w-md mx-auto space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-zinc-400">
                  <span>Uploading to Vault...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E50914]" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Publishing & Feature Options */}
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#E50914]">4. PUBLISHING CONTROL</h3>

          <div className="flex flex-wrap items-center gap-6 text-xs font-bold">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="accent-[#E50914] w-4 h-4"
              />
              <span className="text-white">Publish Immediately</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="accent-[#E50914] w-4 h-4"
              />
              <span className="text-white">Highlight in Hero / Featured Banner</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isComingSoon}
                onChange={(e) => setFormData({ ...formData, isComingSoon: e.target.checked })}
                className="accent-[#E50914] w-4 h-4"
              />
              <span className="text-white">Mark as Coming Soon</span>
            </label>
          </div>
        </div>

        {/* Form Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/movies')}
            className="px-5 py-2.5 bg-zinc-900 text-zinc-300 hover:text-white rounded-sm text-xs font-black uppercase tracking-wider border border-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#E50914] text-white rounded-sm text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg shadow-[#E50914]/30 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : isEdit ? 'Update Movie' : 'Save & Publish Movie'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
