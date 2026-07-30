import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target.querySelectorAll('.animate-item'), {
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 700,
              delay: stagger(120),
              ease: 'outExpo',
            });
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
    <section id="contact" ref={sectionRef} className="py-24 lg:py-32">
      <div className="section-container text-center">
        <div className="animate-item opacity-0 mb-8">
          <span className="font-mono text-xs text-accent tracking-wider uppercase">05 / Contact</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">Let's Connect</h2>
          <p className="text-text-secondary mt-3 max-w-md mx-auto">
            Open to conversations about systems design, AI-powered development, and interesting projects.
          </p>
        </div>

        <div className="animate-item opacity-0 flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:lzdzel@gmail.com"
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-surface font-medium hover:bg-accent-hover transition-all duration-300 text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14H1.75A1.75 1.75 0 010 12.25v-8.5C0 2.784.784 2 1.75 2zM1.5 3.75v.736l6.5 3.777 6.5-3.777V3.75a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25zm13 2.196l-6.227 3.618a.5.5 0 01-.546 0L1.5 5.946v6.304c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.946z" />
            </svg>
            Email
          </a>
          <a
            href="https://github.com/eimf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-surface-border text-text-secondary hover:text-accent hover:border-accent/50 transition-all duration-300 text-sm font-mono"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ezzykeeel/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-surface-border text-text-secondary hover:text-accent hover:border-accent/50 transition-all duration-300 text-sm font-mono"
          >
            LinkedIn
          </a>
        </div>

        {/* Footer */}
        <div className="animate-item opacity-0 mt-16 pt-8 border-t border-surface-border">
          <p className="text-xs text-text-muted font-mono">
            McAllen, TX · {new Date().getFullYear()} · Built with React, Anime.js & ☕
          </p>
        </div>
      </div>
    </section>
  );
}
