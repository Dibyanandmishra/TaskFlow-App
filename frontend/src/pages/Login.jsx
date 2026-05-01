import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Loader2, CheckSquare, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      const { tokens } = response.data.data;
      login(tokens);
      navigate('/');
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        setError(responseData.errors.map(e => e.message).join('. '));
      } else {
        setError(responseData?.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <div className="mb-8 flex items-center space-x-2 text-[var(--color-text-primary)]">
        <CheckSquare className="w-8 h-8 text-[var(--color-primary)]" />
        <span className="font-bold text-3xl tracking-tight">TaskFlow</span>
      </div>

      <div className="w-full max-w-md bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-8 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2 text-center tracking-tight">Welcome back</h2>
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">Sign in to your account to continue</p>
        
        {error && (
          <div className="mb-6 p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] rounded-lg text-sm font-medium text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus-ring text-[var(--color-text-primary)] transition-all-custom placeholder:text-gray-500"
              required
              placeholder="name@example.com"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5" htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus-ring text-[var(--color-text-primary)] transition-all-custom placeholder:text-gray-500 pr-11"
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2.5 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-medium transition-all-custom focus-ring shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors focus-ring rounded px-1">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
