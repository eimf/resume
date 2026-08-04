import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useGetEducationQuery, useGetCertificationsQuery, useGetProfileQuery } from '../../store/api/apiSlice';

export function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: education, isLoading: eduLoading } = useGetEducationQuery(undefined);
  const { data: certifications, isLoading: certLoading } = useGetCertificationsQuery(undefined);
  const { data: profile } = useGetProfileQuery(undefined);

  const isLoading = eduLoading || certLoading;
  const spoken = profile?.spoken_languages?.length
    ? profile.spoken_languages.join(' · ')
    : 'Spanish · English';

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target.querySelectorAll('.animate-item'), {
              opacity: [0, 1],
              translateY: [24, 0],
              duration: 700,
              delay: stagger(100),
              ease: 'outExpo',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isLoading, education, certifications]);

  if (isLoading) {
    return (
      <section id="education" className="py-24 lg:py-32">
        <div className="section-container">
          <div className="mb-12">
            <span className="font-mono text-xs text-accent tracking-wider uppercase">04 / Education</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">Background</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse space-y-3">
                <div className="h-4 bg-surface-border rounded w-2/3" />
                <div className="h-3 bg-surface-border rounded w-1/2" />
                <div className="h-3 bg-surface-border rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" ref={sectionRef} className="py-24 lg:py-32">
      <div className="section-container">
        <div className="animate-item opacity-0 mb-12">
          <span className="font-mono text-xs text-accent tracking-wider uppercase">04 / Education</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">Background</h2>
          <p className="text-text-secondary mt-3 max-w-xl">
            Formal education and recent credentials — biomedical roots, computer science depth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Degrees */}
          <div className="space-y-4">
            <h3 className="animate-item opacity-0 text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
              Degrees
            </h3>
            {education?.map((edu: any) => (
              <div
                key={edu.id}
                className="animate-item opacity-0 glass-card p-5 hover:border-accent/30 transition-colors duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                  <h4 className="text-sm font-semibold text-text-primary">{edu.institution}</h4>
                  <span className="text-xs font-mono text-text-muted whitespace-nowrap">
                    {edu.start_year}
                    {edu.end_year ? ` – ${edu.end_year}` : ''}
                  </span>
                </div>
                <p className="text-sm text-accent font-mono">
                  {edu.degree}
                  {edu.field ? ` · ${edu.field}` : ''}
                </p>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div>
            <h3 className="animate-item opacity-0 text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
              Certifications
            </h3>
            <div className="animate-item opacity-0 glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-text-primary">Boot.dev</span>
                <span className="text-xs font-mono text-text-muted">
                  {certifications?.length || 0} courses
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {certifications?.map((cert: any) => (
                  <a
                    key={cert.id}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-md text-xs font-mono border border-surface-border text-text-secondary hover:text-accent hover:border-accent/40 transition-colors"
                    title={`${cert.name} · ${cert.date}`}
                  >
                    {cert.name}
                  </a>
                ))}
              </div>
            </div>

            <p className="animate-item opacity-0 mt-4 text-xs text-text-muted font-mono">
              Spoken: {spoken}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
