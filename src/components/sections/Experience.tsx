import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

const experiences = [
  {
    company: 'Freelance / DHR',
    role: 'Software Engineer',
    period: 'May 2023 – Present',
    current: true,
    highlights: [
      'Proposed tailored software solutions for local businesses',
      'Built full-stack apps: tournament mgmt, booking, fleet systems',
      'Orchestrating AI-powered development workflows with AI agents',
    ],
  },
  {
    company: 'Tata Consultancy Services',
    role: 'Senior Software Engineer',
    period: 'Jun 2014 – May 2023',
    current: false,
    highlights: [
      'Designed scalable front-end architectures for enterprise clients',
      'Migrated NoSQL → PostgreSQL, monolith → microservices',
      'Modernized large-scale fleet management web application',
      'Built role-based interactive dashboards',
    ],
  },
  {
    company: 'VanillaSys',
    role: 'Senior Mobile Engineer',
    period: 'Jul 2013 – Jun 2014',
    current: false,
    highlights: [
      'Cross-platform mobile apps: iOS, Android, Windows Phone',
    ],
  },
];

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const line = entry.target.querySelector('.timeline-line');
            if (line) {
              animate(line, {
                scaleY: [0, 1],
                duration: 1200,
                ease: 'inOutExpo',
              });
            }
            animate(entry.target.querySelectorAll('.exp-item'), {
              opacity: [0, 1],
              translateX: [-30, 0],
              duration: 800,
              delay: stagger(200, { start: 300 }),
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
    <section id="experience" ref={sectionRef} className="py-24 lg:py-32">
      <div className="section-container">
        <div className="mb-12">
          <span className="font-mono text-xs text-accent tracking-wider uppercase">03 / Experience</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">Career Timeline</h2>
        </div>

        <div className="relative">
          <div
            className="timeline-line absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/50 to-transparent origin-top"
            style={{ transform: 'scaleY(0)' }}
          />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <div key={i} className="exp-item opacity-0 relative pl-12 md:pl-16">
                <div className="absolute left-2.5 md:left-4 top-2 w-3 h-3 rounded-full border-2 border-accent bg-surface z-10">
                  {exp.current && (
                    <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-30" />
                  )}
                </div>

                <div className="glass-card p-6 hover:border-accent/30 transition-colors duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{exp.company}</h3>
                      <p className="text-sm text-text-secondary">{exp.role}</p>
                    </div>
                    <span className="text-xs font-mono text-text-muted whitespace-nowrap">{exp.period}</span>
                  </div>
                  <ul className="space-y-2">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-accent mt-0.5 shrink-0">▸</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
