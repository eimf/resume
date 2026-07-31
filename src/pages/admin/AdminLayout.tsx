import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { setAdmin } from '../../store/slices/profileSlice';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: '◈' },
  { label: 'Projects', path: '/admin/projects', icon: '◆' },
  { label: 'Experience', path: '/admin/experience', icon: '◇' },
  { label: 'Skills', path: '/admin/skills', icon: '◊' },
  { label: 'Profile', path: '/admin/profile', icon: '○' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    dispatch(setAdmin(false));
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-surface-border bg-surface-raised flex flex-col">
        <div className="p-4 border-b border-surface-border">
          <a href="/" className="font-mono text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
            ez<span className="text-text-muted">.</span>dev
          </a>
          <p className="text-xs text-text-muted mt-1">Admin Portal</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'
                }`
              }
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-surface-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-muted hover:text-red-400 hover:bg-surface-overlay transition-colors"
          >
            <span className="text-xs">⏻</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
