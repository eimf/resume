import { useGetReposQuery, useGetExperienceQuery, useGetSkillsQuery, useSyncGitHubMutation } from '../../store/api/apiSlice';

export function AdminDashboard() {
  const { data: repos } = useGetReposQuery(undefined);
  const { data: experience } = useGetExperienceQuery(undefined);
  const { data: skills } = useGetSkillsQuery(undefined);
  const [syncGitHub, { isLoading: isSyncing }] = useSyncGitHubMutation();

  const handleSync = async () => {
    try {
      const result = await syncGitHub(undefined).unwrap();
      alert(`Synced ${result.synced} repos from GitHub`);
    } catch (err: any) {
      alert(`Sync failed: ${err?.data?.error || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5">
          <div className="text-2xl font-bold text-accent">{repos?.length || 0}</div>
          <div className="text-xs text-text-muted font-mono mt-1">Projects Shown</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-2xl font-bold text-accent">{experience?.length || 0}</div>
          <div className="text-xs text-text-muted font-mono mt-1">Experience Entries</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-2xl font-bold text-accent">
            {skills?.reduce((sum: number, cat: any) => sum + cat.skills.length, 0) || 0}
          </div>
          <div className="text-xs text-text-muted font-mono mt-1">Skills</div>
        </div>
      </div>

      {/* Actions */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-4 py-2 rounded-lg bg-accent text-surface text-sm font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSyncing ? '⟳ Syncing...' : '⟳ Sync GitHub'}
          </button>
          <a
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-lg border border-surface-border text-text-secondary text-sm hover:text-accent hover:border-accent/50 transition-colors"
          >
            ↗ View Site
          </a>
        </div>
      </div>
    </div>
  );
}
