import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit, Trash2, CheckCircle, Image as ImageIcon } from 'lucide-react';

export const AdminGenresManager: React.FC = () => {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/genres');
      const data = await res.json();
      if (data.data) setGenres(data.data);
    } catch (e) {
      console.error('Failed to load genres', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (genre?: any) => {
    if (genre) {
      setEditingGenre(genre);
      setName(genre.name || '');
      setDescription(genre.description || '');
      setImage(genre.image || '');
    } else {
      setEditingGenre(null);
      setName('');
      setDescription('');
      setImage('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600');
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cinema_token');
      const method = editingGenre ? 'PUT' : 'POST';
      const url = editingGenre ? `/api/genres/${editingGenre._id}` : '/api/genres';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, image }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchGenres();
      } else {
        alert(data.message || 'Error saving genre');
      }
    } catch (e) {
      alert('Failed to save genre');
    }
  };

  const handleDelete = async (genreId: string) => {
    if (!window.confirm('Are you sure you want to delete this genre?')) return;
    try {
      const token = localStorage.getItem('cinema_token');
      await fetch(`/api/genres/${genreId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setGenres((prev) => prev.filter((g) => g._id !== genreId));
    } catch (e) {
      alert('Failed to delete genre');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E50914]">CATEGORY MANAGER</span>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">GENRES CATALOG</h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#E50914] text-white px-4 py-2 rounded-sm text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Genre</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">
          Loading genres...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {genres.map((genre) => (
            <div
              key={genre._id || genre.slug}
              className="bg-zinc-950 border border-zinc-900 rounded-sm overflow-hidden flex flex-col justify-between group hover:border-zinc-800 transition-colors"
            >
              <div className="relative h-28 bg-zinc-900 overflow-hidden">
                {genre.image && (
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-black text-white uppercase italic">{genre.name}</h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">{genre.description || 'Category'}</p>
                </div>
              </div>

              <div className="p-3 bg-zinc-950 flex items-center justify-between border-t border-zinc-900 text-xs">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Slug: {genre.slug}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(genre)}
                    className="p-1.5 bg-zinc-900 text-zinc-300 hover:text-white rounded-sm border border-zinc-800"
                    title="Edit Genre"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(genre._id)}
                    className="p-1.5 bg-red-950/50 text-red-400 hover:bg-red-900 hover:text-white rounded-sm border border-red-900/60"
                    title="Delete Genre"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-zinc-950 border border-zinc-800 p-6 rounded-sm max-w-md w-full space-y-4"
          >
            <h3 className="text-sm font-black uppercase text-white tracking-wider">
              {editingGenre ? 'Edit Genre' : 'Create New Genre'}
            </h3>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Genre Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cyberpunk"
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Cover Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-zinc-900 text-zinc-300 hover:text-white rounded-sm text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#E50914] text-white rounded-sm text-xs font-bold hover:bg-red-700"
              >
                Save Genre
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
