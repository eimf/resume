import { useGetSkillsQuery } from '../../store/api/apiSlice';

export function AdminSkills() {
  const { data: skillCategories, isLoading } = useGetSkillsQuery(undefined);

  if (isLoading) {
    return <div className="text-text-muted text-sm font-mono">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Skills</h1>
      <p className="text-sm text-text-muted mb-6">
        Manage skill categories and individual skills.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillCategories?.map((category: any) => (
          <div key={category.name} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: category.color }} />
              <h3 className="text-sm font-mono font-semibold text-text-primary">{category.name}</h3>
              <span className="text-xs text-text-muted ml-auto">{category.skills.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {category.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded text-xs font-mono"
                  style={{
                    backgroundColor: `${category.color}15`,
                    color: category.color,
                    border: `1px solid ${category.color}30`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
