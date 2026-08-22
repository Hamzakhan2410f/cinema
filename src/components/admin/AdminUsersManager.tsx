import React, { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, UserX, Trash2, Search, CheckCircle } from 'lucide-react';
import { apiJsonFetch } from '../../utils/api.js';

export const AdminUsersManager: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiJsonFetch('/admin/users');
      if (data?.data) setUsers(data.data);
    } catch (e) {
      console.error('Failed to load users', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (user: any, newRole?: string, newActive?: boolean) => {
    const updatedRole = newRole !== undefined ? newRole : user.role;
    const updatedActive = newActive !== undefined ? newActive : user.isActive !== false;

    try {
      await apiJsonFetch(`/admin/users/${user._id}`, {
        method: 'PUT',
        body: JSON.stringify({ role: updatedRole, isActive: updatedActive }),
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: updatedRole, isActive: updatedActive } : u))
      );
    } catch (e: any) {
      alert(e.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiJsonFetch(`/admin/users/${userId}`, {
        method: 'DELETE',
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (e: any) {
      alert(e.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E50914]">USER ACCESS MANAGEMENT</span>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">SUBSCRIBERS & ADMINS</h1>
        </div>
      </div>

      {/* Search */}
      <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-9 pr-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#E50914]"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">
          Loading user accounts...
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-900 rounded-sm overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Registered</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredUsers.map((user) => {
                const isActive = user.isActive !== false;
                const isAdmin = user.role === 'admin';

                return (
                  <tr key={user._id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-zinc-800"
                        />
                        <div>
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="text-[10px] text-zinc-500">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleUpdateUser(user, isAdmin ? 'user' : 'admin')}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                          isAdmin
                            ? 'bg-[#E50914]/20 border-[#E50914]/40 text-[#E50914]'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {user.role}
                      </button>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleUpdateUser(user, undefined, !isActive)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                          isActive
                            ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    <td className="p-3 text-zinc-500 text-[11px]">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-1.5 bg-red-950/50 text-red-400 hover:bg-red-900 hover:text-white rounded-sm border border-red-900/60"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
