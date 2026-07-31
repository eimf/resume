import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../store/api/apiSlice';
import { useAppDispatch } from '../../store';
import { setAdmin } from '../../store/slices/profileSlice';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login({ password }).unwrap();
      localStorage.setItem('admin_token', result.token);
      dispatch(setAdmin(true));
      navigate('/admin');
    } catch {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-text-primary">Admin Portal</h1>
            <p className="text-sm text-text-muted mt-1 font-mono">ez.dev</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs font-mono text-text-muted mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-surface-border text-text-primary text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-2.5 rounded-lg bg-accent text-surface font-medium text-sm hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-text-muted hover:text-accent transition-colors font-mono">
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
