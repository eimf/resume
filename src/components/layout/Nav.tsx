import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { animate } from 'animejs';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // Keyboard shortcut: Ctrl+Shift+A
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        navigate('/admin/login');
      }
    };
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [navigate]);

  // 5-click logo easter egg
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clickCountRef.current += 1;

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      navigate('/admin/login');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!indicatorRef.current) return;
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const navRect = target.parentElement?.parentElement?.getBoundingClientRect();
    if (!navRect) return;

    animate(indicatorRef.current, {
      left: rect.left - navRect.left - 8,
      width: rect.width + 16,
      opacity: [0.5, 1],
      duration: 300,
      ease: 'outExpo',
    });
  };

  const handleLeave = () => {
    if (!indicatorRef.current) return;
    animate(indicatorRef.current, {
      opacity: 0,
      duration: 200,
      ease: 'outExpo',
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/90 backdrop-blur-md border-b border-surface-border shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#"
          onClick={handleLogoClick}
          className="font-mono text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          ez<span className="text-text-muted">.</span>dev
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:block relative">
          {/* Hover indicator pill */}
          <span
            ref={indicatorRef}
            className="absolute -top-1 h-8 rounded-md bg-accent/10 border border-accent/20 opacity-0 pointer-events-none transition-none"
            style={{ left: 0, width: 0 }}
          />
          <ul className="flex items-center gap-8 relative">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onMouseEnter={handleHover}
                  onMouseLeave={handleLeave}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors py-1"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Status + mobile toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="hidden sm:inline">available</span>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-px bg-text-secondary transition-transform duration-200 ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`w-5 h-px bg-text-secondary transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-px bg-text-secondary transition-transform duration-200 ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-raised/95 backdrop-blur-md border-b border-surface-border">
          <ul className="section-container py-4 space-y-3">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-text-secondary hover:text-accent transition-colors py-2"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
