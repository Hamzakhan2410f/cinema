import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Video,
  CheckCircle,
  XCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { MovieItem } from '../../data/mockMovies.js';
import { apiJsonFetch } from '../../utils/api.js';

interface AdminMoviesListProps {
  onPreviewMovie?: (movie: MovieItem) => void;
}

export const AdminMoviesList: React.FC<AdminMoviesListProps> = ({ onPreviewMovie }) => {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const data = await apiJsonFetch('/movies');
      if (data?.data) {
        setMovies(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch movies', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (movie: MovieItem) => {
    const updatedStatus = !(movie as any).isPublished;
    try {
      await apiJsonFetch(`/admin/movies/${movie.externalId}`, {
        method: 'PUT',
        body: JSON.stringify({ isPublished: updatedStatus }),
      });
      setMovies((prev) =>
        prev.map((m) => (m.externalId === movie.externalId ? { ...m, isPublished: updatedStatus } : m))
      );
    } catch (e: any) {
      alert(e.message || 'Failed to update publish status');
    }
  };

  const handleDelete = async (movie: MovieItem) => {
    if (!window.confirm(`Are you sure you want to delete "${movie.title}"?`)) return;

    try {
      await apiJsonFetch(`/admin/movies/${movie.externalId}`, {
        method: 'DELETE',
      });
      setMovies((prev) => prev.filter((m) => m.externalId !== movie.externalId));
    } catch (e: any) {
      alert(e.message || 'Failed to delete movie');
    }
  };

  // Filter & Search Logic
  const filteredMovies = movies
    .filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.overview?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre =
        !selectedGenre || m.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());
      const matchesStatus =
        !selectedStatus ||
        (selectedStatus === 'published' && (m as any).isPublished !== false) ||
        (selectedStatus === 'draft' && (m as any).isPublished === false);
      return matchesSearch && matchesGenre && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'views') return ((b as any).views || 0) - ((a as any).views || 0);
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.releaseDate || '').localeCompare(a.releaseDate || '');
    });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E50914]">CATALOG MANAGEMENT</span>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">MOVIES & VIDEO FILES</h1>
        </div>
        <Link
          to="/admin/movies/new"
          className="bg-[#E50914] text-white px-4 py-2 rounded-sm text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-2 shadow-md shadow-[#E50914]/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Movie</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-sm grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search titles, descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-9 pr-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
          />
        </div>

        {/* Genre Filter */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
        >
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Drama">Drama</option>
          <option value="Comedy">Comedy</option>
          <option value="Horror">Horror</option>
          <option value="Thriller">Thriller</option>
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
        >
          <option value="newest">Sort by Newest</option>
          <option value="views">Sort by Most Views</option>
          <option value="rating">Sort by Highest Rating</option>
        </select>
      </div>

      {/* Table Listing */}
      {loading ? (
        <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">
          Loading movie catalog...
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-900 p-12 text-center rounded-sm space-y-3">
          <Film className="w-10 h-10 text-zinc-700 mx-auto" />
          <h3 className="text-sm font-bold uppercase text-white">No Movies Found</h3>
          <p className="text-xs text-zinc-500">Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-900 rounded-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <th className="p-3">Poster</th>
                <th className="p-3">Title & Genres</th>
                <th className="p-3">Year / Rating</th>
                <th className="p-3">Video Status</th>
                <th className="p-3">Publish Status</th>
                <th className="p-3">Views</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-xs">
              {filteredMovies.map((movie) => {
                const isPublished = (movie as any).isPublished !== false;
                const hasVideo = !!(movie as any).videoUrl || ['693134', '872585', '572802', '496243', '372058', '1050035'].includes(movie.externalId);

                return (
                  <tr key={movie.externalId} className="hover:bg-zinc-900/40 transition-colors">
                    {/* Poster */}
                    <td className="p-3">
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded-sm border border-zinc-800"
                        loading="lazy"
                      />
                    </td>

                    {/* Title */}
                    <td className="p-3 max-w-xs">
                      <div className="font-bold text-white text-sm truncate">{movie.title}</div>
                      <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                        {movie.genres?.join(', ')}
                      </div>
                    </td>

                    {/* Year & Rating */}
                    <td className="p-3">
                      <div className="text-zinc-300 font-semibold">{movie.releaseDate?.slice(0, 4)}</div>
                      <div className="text-[10px] text-amber-400 font-bold">★ {movie.rating?.toFixed(1)}</div>
                    </td>

                    {/* Video Status */}
                    <td className="p-3">
                      {hasVideo ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-sm">
                          <Video className="w-3 h-3" /> Playable Source
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-sm">
                          No Video Added
                        </span>
                      )}
                    </td>

                    {/* Publish Status */}
                    <td className="p-3">
                      <button
                        onClick={() => handleTogglePublish(movie)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm border transition-colors ${
                          isPublished
                            ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400 hover:bg-emerald-900'
                            : 'bg-amber-950/80 border-amber-800 text-amber-400 hover:bg-amber-900'
                        }`}
                      >
                        {isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Views */}
                    <td className="p-3 text-zinc-400 font-semibold">
                      {(movie as any).views || 120}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview */}
                        <button
                          onClick={() => onPreviewMovie && onPreviewMovie(movie)}
                          title="Preview Movie"
                          className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-sm border border-zinc-800"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Manage Video */}
                        <Link
                          to={`/admin/movies/${movie.externalId}/video`}
                          title="Manage Full Video File"
                          className="p-1.5 bg-zinc-900 hover:bg-[#E50914] text-zinc-300 hover:text-white rounded-sm border border-zinc-800 transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </Link>

                        {/* Edit */}
                        <Link
                          to={`/admin/movies/${movie.externalId}/edit`}
                          title="Edit Details"
                          className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-sm border border-zinc-800"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(movie)}
                          title="Delete Movie"
                          className="p-1.5 bg-red-950/50 hover:bg-red-900 text-red-400 hover:text-white rounded-sm border border-red-900/60 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
