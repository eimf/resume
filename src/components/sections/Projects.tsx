import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

// Static fallback projects (will be replaced by API data in Phase 3)
const projects = [
  { name: 'pickle-app', description: 'Tournament management platform', language: 'TypeScript', stars: 0, url: 'https://github.com/eimf/pickle-app' },
  { name: 'sheets', description: 'Service logging application', language: 'TypeScript', stars: 2, url: 'https://github.com/eimf/sheets' },
  { name: 'tableau', description: 'Booking system web app', language: 'TypeScript', stars: 2, url: 'https://github.com/eimf/tableau' },
  { name: 'betania', description: 'Church community app', language: 'TypeScript', stars: 0, url: 'https://github.com/eimf/betania' },
  { name: 'ai_responder', description: 'Desktop AI overlay for Teams & Outlook', language: 'Python', stars: 0, url: 'https://github.com/eimf/ai_responder' },
  { name: 'overlay-bolt', description: 'iPad overlay native app', language: 'TypeScript', stars: 0, url: 'https://github.com/eimf/overlay-bolt' },
];

const langColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  SCSS: '#c6538c',
  CSS: '#563d7c',
  Swift: '#F05138',
};

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-24 lg:py-32">
      <div className="section-container">
        <div className="mb-12">
          <span className="font-mono text-xs text-accent tracking-wider uppercase">04 / Projects</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">Recent Work</h2>
          <p className="text-text-secondary mt-3 max-w-xl">
            Live from GitHub — showcasing active and recent projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card glass-card p-6 opacity-0 hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-mono font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {project.name}
                </h3>
                <svg width="14" height="14" viewBox="0 0 16 16" className="text-text-muted group-hover:text-accent transition-colors shrink-0 mt-0.5">
                  <path d="M3.75 2h3.5a.75.75 0 010 1.5H4.56l7.72 7.72a.75.75 0 11-1.06 1.06L3.5 4.56v2.69a.75.75 0 01-1.5 0v-3.5A1.75 1.75 0 013.75 2z" fill="currentColor" />
                </svg>
              </div>

              <p className="text-xs text-text-secondary mb-4 line-clamp-2">{project.description}</p>

              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColors[project.language] || '#8B949E' }} />
                  {project.language}
                </span>
                {project.stars > 0 && (
                  <span className="flex items-center gap-1">
                    ★ {project.stars}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
