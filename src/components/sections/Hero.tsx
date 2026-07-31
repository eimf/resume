import { useEffect, useRef, useState } from 'react';
import { animate, stagger, createTimeline } from 'animejs';

const bootLines = [
  '> initializing system...',
  '> loading 13 years of experience...',
  '> compiling skills.ts...',
  '> connecting to github://eimf...',
  '> ready.',
];

export function Hero() {
  const [bootComplete, setBootComplete] = useState(false);
  const bootRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Phase 1: Boot sequence
    if (bootRef.current) {
      const lines = bootRef.current.querySelectorAll('.boot-line');
      animate(lines, {
        opacity: [0, 1],
        translateX: [-10, 0],
        duration: 400,
        delay: stagger(300),
        ease: 'outExpo',
      });

      // After boot, fade out and reveal main content
      setTimeout(() => {
        if (bootRef.current) {
          animate(bootRef.current, {
            opacity: [1, 0],
            scale: [1, 0.98],
            duration: 500,
            ease: 'inExpo',
          });
        }
        setTimeout(() => setBootComplete(true), 500);
      }, bootLines.length * 300 + 600);
    }
  }, []);

  useEffect(() => {
    if (!bootComplete) return;

    const tl = createTimeline({ defaults: { ease: 'outExpo' } });

    // Animate SVG circuit lines
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll('path');
      paths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      });

      animate(paths, {
        strokeDashoffset: 0,
        duration: 1500,
        delay: stagger(200),
        ease: 'inOutQuad',
      });
    }

    // Animate name letter by letter
    if (nameRef.current) {
      const text = nameRef.current.textContent || '';
      nameRef.current.innerHTML = text
        .split('')
        .map((c) =>
          c === ' '
            ? '<span class="inline-block">&nbsp;</span>'
            : `<span class="inline-block opacity-0">${c}</span>`
        )
        .join('');

      tl.add(nameRef.current.querySelectorAll('span'), {
        opacity: [0, 1],
        translateY: [40, 0],
        rotateX: [90, 0],
        duration: 600,
        delay: stagger(40),
      }, 200);
    }

    // Subtitle
    if (subtitleRef.current) {
      tl.add(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
      }, '-=400');
    }

    // Content blocks
    if (contentRef.current) {
      tl.add(contentRef.current.children, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: stagger(120),
      }, '-=400');
    }

    // Scroll indicator
    if (scrollRef.current) {
      animate(scrollRef.current, {
        translateY: [0, 8, 0],
        opacity: [0, 1, 0.6],
        duration: 2000,
        delay: 2000,
        loop: true,
        ease: 'inOutSine',
      });
    }
  }, [bootComplete]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* SVG circuit decoration */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M0 400 Q 200 350 400 400 T 800 380 T 1200 400"
          stroke="#58A6FF"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M0 450 Q 300 500 600 450 T 1200 470"
          stroke="#58A6FF"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M100 0 L 100 200 Q 100 250 150 250 L 400 250"
          stroke="#3FB950"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M1100 0 L 1100 150 Q 1100 200 1050 200 L 800 200"
          stroke="#D2A8FF"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M600 800 L 600 600 Q 600 550 650 550 L 900 550"
          stroke="#58A6FF"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>

      {/* Boot sequence overlay */}
      {!bootComplete && (
        <div
          ref={bootRef}
          className="absolute inset-0 z-20 flex items-center justify-center bg-surface"
        >
          <div className="font-mono text-sm space-y-2 max-w-md">
            {bootLines.map((line, i) => (
              <div
                key={i}
                className={`boot-line opacity-0 ${
                  i === bootLines.length - 1 ? 'text-accent' : 'text-text-muted'
                }`}
              >
                {line}
                {i === bootLines.length - 1 && (
                  <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main hero content */}
      <div
        className={`section-container w-full text-center transition-opacity duration-500 ${
          bootComplete ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="mb-8">
          <span className="inline-block font-mono text-xs text-text-muted tracking-wider uppercase">
            <span className="text-accent">~/</span> ezequiel.dev
          </span>
        </div>

        <h1
          ref={nameRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-text-primary mb-4"
          style={{ perspective: '800px' }}
        >
          Ezequiel Lopez
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl text-text-secondary font-light opacity-0 mb-12"
        >
          Software Engineer → <span className="text-accent">Systems Thinker</span>
        </p>

        <div ref={contentRef} className="space-y-6">
          <p className="text-text-muted max-w-2xl mx-auto text-sm sm:text-base leading-relaxed opacity-0">
            13+ years shipping software. Now designing systems that build it.
          </p>

          <div className="flex items-center justify-center gap-4 opacity-0 flex-wrap">
            <a
              href="https://github.com/eimf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-border text-text-secondary hover:text-accent hover:border-accent/50 hover:shadow-[0_0_15px_rgba(88,166,255,0.15)] transition-all duration-300 text-sm font-mono"
            >
              <GitHubIcon />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ezzykeeel/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-border text-text-secondary hover:text-accent hover:border-accent/50 hover:shadow-[0_0_15px_rgba(88,166,255,0.15)] transition-all duration-300 text-sm font-mono"
            >
              <LinkedInIcon />
              LinkedIn
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-surface font-medium hover:bg-accent-hover hover:shadow-[0_0_20px_rgba(88,166,255,0.3)] transition-all duration-300 text-sm"
            >
              Let's Connect
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-text-muted font-mono">scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-accent">
            <path
              d="M8 1v12M3 9l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
    </svg>
  );
}
