import { useState, useEffect, useCallback } from 'react';
import { apiSlice } from '../../store/api/apiSlice';
import { useAppDispatch } from '../../store';

type EditMode = 'desc' | 'deploy' | null;

export function AdminProjects() {
  const dispatch = useAppDispatch();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const token = localStorage.getItem('admin_token');

  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [customDesc, setCustomDesc] = useState('');
  const [deployUrl, setDeployUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProjects = useCallback(() => {
    setLoaded(false);
    fetch(`${baseUrl}/admin/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setAllProjects(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => {
        setAllProjects([]);
        setLoaded(true);
      });
  }, [baseUrl, token]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const patchProject = async (id: number, body: Record<string, unknown>) => {
    setSaving(true);
    try {
      await fetch(`${baseUrl}/admin/projects/${id}/feature`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      setEditingId(null);
      setEditMode(null);
      dispatch(apiSlice.util.invalidateTags(['Repos']));
      loadProjects();
    } finally {
      setSaving(false);
    }
  };

  const toggleFeature = (id: number, currentlyFeatured: boolean) => {
    patchProject(id, { is_featured: !currentlyFeatured });
  };

  const toggleLive = (project: any) => {
    if (project.is_deployed) {
      patchProject(project.id, { is_deployed: false });
      return;
    }
    if (project.deploy_url) {
      patchProject(project.id, { is_deployed: true });
      return;
    }
    // No URL yet — open deploy editor
    setEditingId(project.id);
    setEditMode('deploy');
    setDeployUrl('');
  };

  const saveDescription = (id: number) => {
    patchProject(id, { custom_description: customDesc });
  };

  const saveDeploy = (id: number) => {
    const url = deployUrl.trim();
    patchProject(id, {
      deploy_url: url,
      is_deployed: !!url,
    });
  };

  const clearDeploy = (id: number) => {
    patchProject(id, { deploy_url: '', is_deployed: false });
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
        Feature projects for the public grid. Mark deployed apps live with a URL to show the badge and link to the app.
      </p>

      <div className="space-y-3">
        {allProjects.map((project: any) => {
          const isEditing = editingId === project.id;

          return (
            <div
              key={project.id}
              className={`glass-card p-4 flex flex-col gap-3 ${
                project.is_deployed
                  ? 'border-green-500/30'
                  : project.is_featured
                    ? 'border-accent/30'
                    : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-mono font-semibold text-text-primary truncate">
                      {project.name}
                    </span>
                    {project.is_private && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-border text-text-muted shrink-0">
                        private
                      </span>
                    )}
                    {project.is_featured && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-accent/20 text-accent shrink-0">
                        ★ featured
                      </span>
                    )}
                    {project.is_deployed && project.deploy_url && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-green-500/20 text-green-400 shrink-0">
                        live
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted truncate mt-1">
                    {project.custom_description || project.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {project.language && (
                      <span className="text-xs text-text-muted font-mono">{project.language}</span>
                    )}
                    {project.deploy_url && (
                      <a
                        href={project.deploy_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-green-400/80 hover:text-green-400 truncate max-w-[240px]"
                      >
                        {project.deploy_url.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={() => {
                        setEditingId(project.id);
                        setEditMode('desc');
                        setCustomDesc(project.custom_description || '');
                      }}
                      className="px-3 py-1.5 rounded border border-surface-border text-text-muted text-xs hover:text-accent hover:border-accent/50 transition-colors"
                    >
                      Edit desc
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(project.id);
                        setEditMode('deploy');
                        setDeployUrl(project.deploy_url || '');
                      }}
                      className="px-3 py-1.5 rounded border border-surface-border text-text-muted text-xs hover:text-green-400 hover:border-green-500/40 transition-colors"
                    >
                      {project.deploy_url ? 'Edit URL' : 'Set live'}
                    </button>
                    {project.is_deployed ? (
                      <button
                        onClick={() => toggleLive(project)}
                        disabled={saving}
                        className="px-3 py-1.5 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                      >
                        Unlive
                      </button>
                    ) : project.deploy_url ? (
                      <button
                        onClick={() => toggleLive(project)}
                        disabled={saving}
                        className="px-3 py-1.5 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                      >
                        Mark live
                      </button>
                    ) : null}
                    <button
                      onClick={() => toggleFeature(project.id, project.is_featured)}
                      disabled={saving}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                        project.is_featured
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                          : 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20'
                      }`}
                    >
                      {project.is_featured ? 'Unfeature' : 'Feature'}
                    </button>
                  </div>
                )}
              </div>

              {isEditing && editMode === 'desc' && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded bg-surface border border-surface-border text-text-primary text-xs focus:outline-none focus:border-accent/50"
                    placeholder="Custom description"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveDescription(project.id)}
                      disabled={saving}
                      className="px-3 py-1.5 rounded bg-accent text-surface text-xs font-medium disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditMode(null);
                      }}
                      className="px-3 py-1.5 rounded border border-surface-border text-text-muted text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {isEditing && editMode === 'deploy' && (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={deployUrl}
                      onChange={(e) => setDeployUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded bg-surface border border-surface-border text-text-primary text-xs focus:outline-none focus:border-green-500/50 font-mono"
                      placeholder="https://your-app.vercel.app"
                      autoFocus
                    />
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => saveDeploy(project.id)}
                        disabled={saving || !deployUrl.trim()}
                        className="px-3 py-1.5 rounded bg-green-500 text-surface text-xs font-medium disabled:opacity-50"
                      >
                        Save & mark live
                      </button>
                      {project.deploy_url && (
                        <button
                          onClick={() => clearDeploy(project.id)}
                          disabled={saving}
                          className="px-3 py-1.5 rounded border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 disabled:opacity-50"
                        >
                          Clear URL
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditMode(null);
                        }}
                        className="px-3 py-1.5 rounded border border-surface-border text-text-muted text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-muted font-mono">
                    Live projects sort first and link to the app instead of GitHub.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
