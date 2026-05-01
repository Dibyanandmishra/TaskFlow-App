import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, CheckSquare, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-6 py-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-all-custom focus-ring rounded-md">
          <CheckSquare className="w-6 h-6 text-[var(--color-primary)]" />
          <span className="font-bold text-xl tracking-tight">TaskFlow</span>
        </Link>
        <div className="flex items-center space-x-6">
          {user.role === 'admin' && (
            <Link 
              to="/admin" 
              className="flex items-center space-x-2 px-3 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-all-custom focus-ring"
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Admin</span>
            </Link>
          )}
          <Link to="/profile" className="hidden md:flex flex-col items-end hover:opacity-80 transition-opacity px-2 py-1 rounded-lg hover:bg-[var(--color-card)] group">
            <span className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
              {user.name}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {user.role === 'admin' ? 'Administrator' : 'User'}
            </span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-all-custom focus-ring"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
