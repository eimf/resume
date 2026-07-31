import { useGetExperienceQuery } from '../../store/api/apiSlice';

export function AdminExperience() {
  const { data: experiences, isLoading } = useGetExperienceQuery(undefined);

  if (isLoading) {
    return <div className="text-text-muted text-sm font-mono">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Experience</h1>
      <p className="text-sm text-text-muted mb-6">
        Manage your work experience entries. Edit in the database or via the import script for now.
      </p>

      <div className="space-y-4">
        {experiences?.map((exp: any) => (
          <div key={exp.id} className="glass-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">{exp.company}</h3>
                <p className="text-xs text-text-secondary">{exp.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-text-muted">{exp.period}</span>
                {exp.current && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-green-500/20 text-green-400">
                    current
                  </span>
                )}
              </div>
            </div>
            <ul className="space-y-1">
              {exp.highlights?.map((h: string, i: number) => (
                <li key={i} className="text-xs text-text-secondary flex gap-2">
                  <span className="text-accent shrink-0">▸</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
