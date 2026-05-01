import React, { useState, useEffect, useContext } from 'react';
import { Users, Shield, ShieldAlert, UserCheck, UserMinus, Loader2, ArrowLeft } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data.data.users || []);
    } catch (err) {
      setError('Failed to load users. Only admins can access this page.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      await api.patch(`/users/${userId}/status`, { isActive: !isActive });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 hover:bg-[var(--color-card)] rounded-lg transition-colors text-[var(--color-text-secondary)]">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">User Management</h1>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-1">Manage permissions and account status.</p>
            </div>
          </div>
          <div className="bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-500">Admin Mode</span>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Loading user directory...</p>
          </div>
        ) : (
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                    <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-text-primary)]">{u.name}</p>
                            <p className="text-xs text-[var(--color-text-secondary)]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-500/10 text-slate-500'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          u.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleUpdateRole(u._id, u.role === 'admin' ? 'user' : 'admin')}
                            className="p-2 hover:bg-indigo-500/10 text-indigo-500 rounded-lg transition-colors group relative"
                            title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                          >
                            {u.role === 'admin' ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u._id, u.isActive)}
                            className={`p-2 rounded-lg transition-colors ${
                              u.isActive ? 'hover:bg-red-500/10 text-red-500' : 'hover:bg-emerald-500/10 text-emerald-500'
                            }`}
                            title={u.isActive ? 'Deactivate User' : 'Activate User'}
                          >
                            {u.isActive ? <UserMinus className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="py-12 text-center text-[var(--color-text-secondary)]">
                No users found.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
