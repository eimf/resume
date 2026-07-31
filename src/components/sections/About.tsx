import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useGetProfileQuery, useGetReposQuery, useGetSkillsQuery } from '../../store/api/apiSlice';

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { data: profile } = useGetProfileQuery(undefined);
  const { data: repos } = useGetReposQuery(undefined);
  const { data: skills } = useGetSkillsQuery(undefined);

  const totalRepos = repos?.length || 0;
  const totalLanguages = skills?.find((s: any) => s.name === 'Languages')?.skills?.length || 7;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target.querySelectorAll('.animate-item'), {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              delay: stagger(150),
              ease: 'outExpo',
            });

            // Animate stats counters
            if (statsRef.current) {
              const counters = statsRef.current.querySelectorAll('.stat-number');
              counters.forEach((counter) => {
                const target = parseInt(counter.getAttribute('data-target') || '0');
                const obj = { value: 0 };
                animate(obj, {
                  value: target,
                  duration: 1500,
                  ease: 'outExpo',
                  onUpdate: () => {
                    counter.textContent = Math.round(obj.value).toString() + (counter.getAttribute('data-suffix') || '');
                  },
                });
              });
            }

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 lg:py-32">
      <div className="section-container">
        <div className="animate-item opacity-0 mb-12">
          <span className="font-mono text-xs text-accent tracking-wider uppercase">01 / About</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">
            From Developer to Systems Designer
          </h2>
        </div>

        {/* Stats bar */}
        <div ref={statsRef} className="animate-item opacity-0 grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass-card p-4 text-center">
            <div className="stat-number text-2xl font-bold text-accent" data-target="15" data-suffix="+">0</div>
            <div className="text-xs text-text-muted font-mono mt-1">Years Shipping</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="stat-number text-2xl font-bold text-accent" data-target={String(totalRepos || 44)} data-suffix="">0</div>
            <div className="text-xs text-text-muted font-mono mt-1">GitHub Repos</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="stat-number text-2xl font-bold text-accent" data-target={String(totalLanguages)} data-suffix="">0</div>
            <div className="text-xs text-text-muted font-mono mt-1">Languages</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="stat-number text-2xl font-bold text-accent" data-target="5" data-suffix="">0</div>
            <div className="text-xs text-text-muted font-mono mt-1">Cloud Platforms</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-item opacity-0 space-y-6">
            <p className="text-text-secondary leading-relaxed">
              {profile?.summary || 'For 13+ years I shipped software. Fast. Across industries, across stacks, across clouds. I wrote the code, reviewed the code, deployed the code, debugged the code at 2 AM.'}
            </p>
            <p className="text-text-secondary leading-relaxed">
              Now I design systems that build things. I decide what gets built, how it composes,
              and where the humans still matter. The code still ships — it just ships at the speed
              of decision-making now.
            </p>
            <p className="text-text-muted text-sm font-mono italic">
              "Coffee powers the ideas. AI ships the code." ☕🧠🤖
            </p>
          </div>

          <div className="animate-item opacity-0 grid grid-cols-2 gap-4">
            <div className="glass-card p-5 space-y-3 group hover:border-text-muted/30 transition-colors">
              <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                Then
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-text-muted mt-0.5 shrink-0">▸</span>
                  TypeScript, JS, Python, Java, Go
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-text-muted mt-0.5 shrink-0">▸</span>
                  AWS, GCP, Docker, K8s
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-text-muted mt-0.5 shrink-0">▸</span>
                  VS Code + 47 SO tabs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-text-muted mt-0.5 shrink-0">▸</span>
                  CI/CD pipelines
                </li>
              </ul>
            </div>

            <div className="glass-card p-5 space-y-3 border-accent/20 group hover:border-accent/40 transition-colors">
              <h3 className="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Now
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 shrink-0">▸</span>
                  AI IDEs + Agents
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 shrink-0">▸</span>
                  Prompt engineering
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 shrink-0">▸</span>
                  Orchestration layers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 shrink-0">▸</span>
                  Context engineering
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
