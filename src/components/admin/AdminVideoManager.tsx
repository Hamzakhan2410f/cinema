import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Video,
  Upload,
  Trash2,
  Play,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  HardDrive,
  Clock,
  FileCheck,
} from 'lucide-react';
import { apiJsonFetch } from '../../utils/api.js';

export const AdminVideoManager: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<any>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoType, setNewVideoType] = useState<'mp4' | 'hls' | 'external'>('mp4');
  const [storageProvider, setStorageProvider] = useState('s3');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (id) {
      loadVideoInfo(id);
    }
  }, [id]);

  const loadVideoInfo = async (movieId: string) => {
    setLoading(true);
    try {
      const [movieJson, videoJson] = await Promise.all([
        apiJsonFetch(`/movies/${movieId}`),
        apiJsonFetch(`/movies/${movieId}/video`),
      ]);

      if (movieJson?.data) setMovie(movieJson.data);
      if (videoJson?.data) {
        setVideoData(videoJson.data);
        if (videoJson.data.videoUrl) setNewVideoUrl(videoJson.data.videoUrl);
      }
    } catch (e) {
      console.error('Error loading video details', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(15);

    let progress = 15;
    const interval = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        const sampleUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
        setNewVideoUrl(sampleUrl);
      }
    }, 400);
  };

  const handleSaveVideo = async () => {
    if (!id) return;
    try {
      await apiJsonFetch(`/admin/movies/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          videoUrl: newVideoUrl,
          videoType: newVideoType,
          videoStorageProvider: storageProvider,
        }),
      });
      alert('Movie video updated successfully!');
      loadVideoInfo(id);
    } catch (e: any) {
      alert(e.message || 'Failed to update video source');
    }
  };

  const handleDeleteVideo = async () => {
    if (!id) return;
    try {
      await apiJsonFetch(`/admin/movies/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          videoUrl: null,
          videoType: null,
        }),
      });
      setNewVideoUrl('');
      setShowDeleteConfirm(false);
      loadVideoInfo(id);
    } catch (e: any) {
      alert(e.message || 'Failed to remove video source');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">
        Loading video management...
      </div>
    );
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
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E50914]">VIDEO STORAGE MANAGEMENT</span>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              {movie?.title || 'Movie'} — Stream Vault
            </h1>
          </div>
        </div>
      </div>

      {/* Movie Banner Card */}
      <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-sm flex items-center gap-4">
        <img
          src={movie?.posterPath}
          alt={movie?.title}
          className="w-16 h-24 object-cover rounded-sm border border-zinc-800 shrink-0"
        />
        <div>
          <h2 className="text-lg font-black text-white uppercase italic">{movie?.title}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">{movie?.genres?.join(', ')} • {movie?.releaseDate?.slice(0, 4)}</p>
          <div className="mt-2 flex items-center gap-2">
            {videoData?.hasVideo ? (
              <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
                <FileCheck className="w-3 h-3" /> Playable Source Attached
              </span>
            ) : (
              <span className="bg-amber-950 border border-amber-800 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> No Video Attached
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Video Details & Storage Control */}
      <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#E50914]">ATTACHED MOVIE FILE STATUS</h3>

        {videoData?.hasVideo ? (
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px] font-bold uppercase">Source Format</span>
                <span className="text-white font-bold uppercase">{videoData?.videoType || 'MP4'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] font-bold uppercase">Quality Standard</span>
                <span className="text-white font-bold">{videoData?.quality || '1080p Master HD'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] font-bold uppercase">Storage Vault</span>
                <span className="text-white font-bold uppercase">{movie?.videoStorageProvider || 'S3 Cloud'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <a
                href={videoData.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#E50914] hover:underline truncate max-w-lg"
              >
                {videoData.videoUrl}
              </a>
              <button
                onClick={() => navigate(`/watch/${id}`)}
                className="bg-[#E50914] text-white px-3 py-1.5 rounded-sm text-xs font-bold uppercase flex items-center gap-1 hover:bg-red-700"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Player</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-zinc-800 rounded-sm text-zinc-500 text-xs">
            No video stream file is currently attached to this title. Upload or configure a stream URL below.
          </div>
        )}

        {/* Upload / Edit Section */}
        <div className="space-y-4 pt-4 border-t border-zinc-900">
          <h4 className="text-xs font-bold uppercase text-white">Upload New Movie File or Update Stream URL</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Video Stream Type</label>
              <select
                value={newVideoType}
                onChange={(e) => setNewVideoType(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              >
                <option value="mp4">MP4 Video File</option>
                <option value="hls">Adaptive HLS Stream (.m3u8)</option>
                <option value="external">External Stream URL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Vault Provider</label>
              <select
                value={storageProvider}
                onChange={(e) => setStorageProvider(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              >
                <option value="s3">AWS S3 Storage</option>
                <option value="cloudinary">Cloudinary Video CDN</option>
                <option value="cloudflare">Cloudflare R2</option>
                <option value="supabase">Supabase Vault</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">Authorized Video URL</label>
            <input
              type="text"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              placeholder="e.g. https://storage.googleapis.com/.../movie.mp4"
              className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Upload Button Box */}
          <div className="border border-dashed border-zinc-800 p-4 rounded-sm text-center">
            <Upload className="w-6 h-6 text-zinc-500 mx-auto mb-1" />
            <span className="text-xs text-zinc-300 block font-bold">Select File From Computer</span>
            <input
              type="file"
              accept="video/mp4,video/webm,.m3u8"
              onChange={handleUploadSimulate}
              className="mt-2 block mx-auto text-xs text-zinc-400 file:py-1 file:px-3 file:bg-[#E50914] file:text-white file:border-0 file:rounded-sm cursor-pointer"
            />
            {isUploading && (
              <div className="mt-3 text-xs text-zinc-400 font-bold">Uploading... {uploadProgress}%</div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {videoData?.hasVideo ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-950/60 text-red-400 hover:bg-red-900 hover:text-white text-xs font-bold uppercase rounded-sm border border-red-900 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Video Source</span>
              </button>
            ) : <div />}

            <button
              onClick={handleSaveVideo}
              className="px-6 py-2 bg-[#E50914] text-white rounded-sm text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-colors shadow-md shadow-[#E50914]/30"
            >
              Save Video Source
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-sm max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-black uppercase text-white">Confirm Removal</h3>
            </div>
            <p className="text-xs text-zinc-300">
              Are you sure you want to remove the video file reference for <strong className="text-white">"{movie?.title}"</strong>?
              Users will see "FULL MOVIE NOT AVAILABLE" until a new video is attached.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-zinc-900 text-zinc-300 hover:text-white rounded-sm text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVideo}
                className="px-4 py-2 bg-red-600 text-white rounded-sm text-xs font-bold hover:bg-red-700"
              >
                Delete Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
