import { useState } from 'react';
import { apiSlice } from '../../store/api/apiSlice';
import { useAppDispatch } from '../../store';

export function AdminProjects() {
  const dispatch = useAppDispatch();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [customDesc, setCustomDesc] = useState('');

  // Fetch all projects (admin view)
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const token = localStorage.getItem('admin_token');

  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    fetch(`${baseUrl}/admin/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setAllProjects(data);
        setLoaded(true);
      });
  }

  const toggleFeature = async (id: number, currentlyFeatured: boolean) => {
    await fetch(`${baseUrl}/admin/projects/${id}/feature`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_featured: !currentlyFeatured }),
    });
    // Refresh
    setLoaded(false);
    dispatch(apiSlice.util.invalidateTags(['Repos']));
  };

  const saveDescription = async (id: number) => {
    await fetch(`${baseUrl}/admin/projects/${id}/feature`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ custom_description: customDesc }),
    });
    setEditingId(null);
    setLoaded(false);
    dispatch(apiSlice.util.invalidateTags(['Repos']));
  };

  if (!loaded) {
    return (
      <div className="text-text-muted text-sm font-mono">Loading projects...</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Projects</h1>
      <p className="text-sm text-text-muted mb-6">
        Feature projects to show them on the public site. Add custom descriptions for private repos.
      </p>

      <div className="space-y-3">
        {allProjects.map((project: any) => (
          <div
            key={project.id}
            className={`glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
              project.is_featured ? 'border-accent/30' : ''
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-semibold text-text-primary truncate">
                  {project.name}
                </span>
                {project.is_private && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-border text-text-muted shrink-0">
                    🔒
                  </span>
                )}
                {project.is_featured && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-accent/20 text-accent shrink-0">
                    ★ featured
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted truncate mt-1">
                {project.custom_description || project.description || 'No description'}
              </p>
              {project.language && (
                <span className="text-xs text-text-muted font-mono">{project.language}</span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {editingId === project.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    className="px-3 py-1.5 rounded bg-surface border border-surface-border text-text-primary text-xs w-48 focus:outline-none focus:border-accent/50"
                    placeholder="Custom description"
                  />
                  <button
                    onClick={() => saveDescription(project.id)}
                    className="px-3 py-1.5 rounded bg-accent text-surface text-xs font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 rounded border border-surface-border text-text-muted text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(project.id);
                      setCustomDesc(project.custom_description || '');
                    }}
                    className="px-3 py-1.5 rounded border border-surface-border text-text-muted text-xs hover:text-accent hover:border-accent/50 transition-colors"
                  >
                    Edit desc
                  </button>
                  <button
                    onClick={() => toggleFeature(project.id, project.is_featured)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      project.is_featured
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                        : 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20'
                    }`}
                  >
                    {project.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
