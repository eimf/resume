import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useGetSkillsQuery } from '../../store/api/apiSlice';

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: skillCategories, isLoading } = useGetSkillsQuery(undefined);

  useEffect(() => {
    if (isLoading || !skillCategories?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target.querySelectorAll('.skill-card'), {
              opacity: [0, 1],
              translateY: [40, 0],
              scale: [0.95, 1],
              duration: 600,
              delay: stagger(100),
              ease: 'outExpo',
            });
            animate(entry.target.querySelectorAll('.skill-tag'), {
              opacity: [0, 1],
              scale: [0.8, 1],
              duration: 400,
              delay: stagger(30, { start: 400 }),
              ease: 'outBack',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isLoading, skillCategories]);

  if (isLoading) {
    return (
      <section id="skills" className="py-24 lg:py-32">
        <div className="section-container">
          <div className="mb-12">
            <span className="font-mono text-xs text-accent tracking-wider uppercase">02 / Skills</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">Technical Arsenal</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-surface-border rounded w-1/3 mb-4" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-6 bg-surface-border rounded w-16" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" ref={sectionRef} className="py-24 lg:py-32">
      <div className="section-container">
        <div className="mb-12">
          <span className="font-mono text-xs text-accent tracking-wider uppercase">02 / Skills</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">Technical Arsenal</h2>
          <p className="text-text-secondary mt-3 max-w-xl">
            15 years of accumulated tools, frameworks, and paradigms — now orchestrated through AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories?.map((category: any) => (
            <div
              key={category.name}
              className="skill-card glass-card p-6 opacity-0 hover:border-accent/30 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                <h3 className="text-sm font-mono font-medium text-text-primary">{category.name}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="skill-tag px-2.5 py-1 rounded-md text-xs font-mono opacity-0"
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
    </section>
  );
}
