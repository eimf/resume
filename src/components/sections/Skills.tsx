import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

interface SkillCategory {
  name: string;
  skills: string[];
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'C#', 'Swift'],
    color: '#58A6FF',
  },
  {
    name: 'Frontend',
    skills: ['React', 'Next.js', 'Redux/RTK', 'Tailwind', 'HTML/CSS', 'Anime.js'],
    color: '#79C0FF',
  },
  {
    name: 'Backend',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'SQLite', 'REST APIs', 'Microservices'],
    color: '#3FB950',
  },
  {
    name: 'Cloud & DevOps',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Vercel', 'Railway', 'CI/CD'],
    color: '#D2A8FF',
  },
  {
    name: 'AI & Tooling',
    skills: ['Cursor', 'Kiro', 'Prompt Engineering', 'Context Engineering', 'AI Agents'],
    color: '#FFA657',
  },
  {
    name: 'Mobile',
    skills: ['iOS (Swift)', 'React Native', 'Xcode'],
    color: '#FF7B72',
  },
];

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-24 lg:py-32">
      <div className="section-container">
        <div className="mb-12">
          <span className="font-mono text-xs text-accent tracking-wider uppercase">02 / Skills</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">Technical Arsenal</h2>
          <p className="text-text-secondary mt-3 max-w-xl">
            13 years of accumulated tools, frameworks, and paradigms — now orchestrated through AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((category) => (
            <div
              key={category.name}
              className="skill-card glass-card p-6 opacity-0 hover:border-accent/30 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                <h3 className="text-sm font-mono font-medium text-text-primary">{category.name}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
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
