import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useGetReposQuery } from '../../store/api/apiSlice';

const langColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  SCSS: '#c6538c',
  CSS: '#563d7c',
  Swift: '#F05138',
  Go: '#00ADD8',
  Java: '#b07219',
};

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: projects, isLoading } = useGetReposQuery(undefined);

  useEffect(() => {
    if (isLoading || !projects?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target.querySelectorAll('.project-card'), {
              opacity: [0, 1],
              translateY: [30, 0],
              scale: [0.96, 1],
              duration: 600,
              delay: stagger(80),
              ease: 'outExpo',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isLoading, projects]);

  const handleCardHover = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-24 lg:py-32">
        <div className="section-container">
          <div className="mb-12">
            <span className="font-mono text-xs text-accent tracking-wider uppercase">04 / Projects</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">Recent Work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-surface-border rounded w-2/3 mb-3" />
                <div className="h-3 bg-surface-border rounded w-full mb-2" />
                <div className="h-3 bg-surface-border rounded w-4/5 mb-4" />
                <div className="h-3 bg-surface-border rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={sectionRef} className="py-24 lg:py-32">
      <div className="section-container">
        <div className="mb-12">
          <span className="font-mono text-xs text-accent tracking-wider uppercase">04 / Projects</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">Recent Work</h2>
          <p className="text-text-secondary mt-3 max-w-xl">
            Live from GitHub — synced automatically from public and private repositories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects?.map((project: any) => {
            const isPrivate = project.is_private;
            const isDeployed = project.is_deployed && project.deploy_url;
            const description = project.custom_description || project.description;
            // If deployed, link to the live app. If public, link to GitHub. If private, no link.
            const linkUrl = isDeployed ? project.deploy_url : (!isPrivate ? project.url : null);
            const CardTag = linkUrl ? 'a' : 'div';
            const cardProps = linkUrl
              ? { href: linkUrl, target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <CardTag
                key={project.id}
                {...(cardProps as any)}
                onMouseMove={handleCardHover}
                className="project-card relative glass-card p-6 opacity-0 transition-all duration-300 group overflow-hidden cursor-pointer"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(88,166,255,0.06), transparent 60%)',
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-mono font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {project.name}
                      </h3>
                      {isDeployed && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-green-500/20 text-green-400">
                          live
                        </span>
                      )}
                      {isPrivate && !isDeployed && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-border text-text-muted">
                          🔒
                        </span>
                      )}
                      {project.is_featured && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-accent/20 text-accent">
                          ★
                        </span>
                      )}
                    </div>
                    {linkUrl && (
                      <svg width="14" height="14" viewBox="0 0 16 16" className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5">
                        <path d="M3.75 2h3.5a.75.75 0 010 1.5H4.56l7.72 7.72a.75.75 0 11-1.06 1.06L3.5 4.56v2.69a.75.75 0 01-1.5 0v-3.5A1.75 1.75 0 013.75 2z" fill="currentColor" />
                      </svg>
                    )}
                  </div>

                  <p className="text-xs text-text-secondary mb-4 line-clamp-2">
                    {description || 'No description'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    {project.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: langColors[project.language] || '#8B949E' }}
                        />
                        {project.language}
                      </span>
                    )}
                    {project.stars > 0 && (
                      <span className="flex items-center gap-1">★ {project.stars}</span>
                    )}
                  </div>
                </div>
              </CardTag>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://github.com/eimf?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors font-mono"
          >
            View all repos →
          </a>
        </div>
      </div>
    </section>
  );
}
