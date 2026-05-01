import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/register', { name, email, password });
      login(response.data.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-md bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">Create Account</h2>
        {error && <div className="mb-4 p-3 bg-[var(--color-error)]/20 text-[var(--color-error)] rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus-ring text-[var(--color-text-primary)] transition-all-custom"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus-ring text-[var(--color-text-primary)] transition-all-custom"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus-ring text-[var(--color-text-primary)] transition-all-custom"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-medium transition-all-custom focus-ring"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          Already have an account? <Link to="/login" className="text-[var(--color-primary)] hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
