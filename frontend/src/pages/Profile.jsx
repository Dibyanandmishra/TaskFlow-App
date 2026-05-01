import React, { useState, useContext, useEffect } from 'react';
import { User, Lock, Save, Loader2, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, loading } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (loading || !user) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setMessage({ type: '', text: '' });
    try {
      await api.patch('/auth/profile', { name, email });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMessage({ type: 'error', text: 'New passwords do not match' });
    }
    setIsChangingPassword(true);
    setMessage({ type: '', text: '' });
    try {
      await api.patch('/auth/change-password', { currentPassword, newPassword });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/" className="p-2 hover:bg-[var(--color-card)] rounded-lg transition-colors text-[var(--color-text-secondary)]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">Account Settings</h1>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-1">Manage your profile and security.</p>
          </div>
        </div>

        {message.text && (
          <div className={`mb-8 p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)]'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : null}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Personal Information</h2>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus-ring text-[var(--color-text-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus-ring text-[var(--color-text-primary)]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full flex justify-center items-center py-2.5 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-semibold transition-all-custom shadow-sm disabled:opacity-70"
              >
                {isUpdatingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Profile</>}
              </button>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Lock className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Security</h2>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Current Password</label>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus-ring text-[var(--color-text-primary)] pr-11"
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-[26px] p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">New Password</label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus-ring text-[var(--color-text-primary)] pr-11"
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-[26px] p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Confirm New Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus-ring text-[var(--color-text-primary)] pr-11"
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[26px] p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full flex justify-center items-center py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-all-custom shadow-sm disabled:opacity-70"
              >
                {isChangingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4 mr-2" /> Change Password</>}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
