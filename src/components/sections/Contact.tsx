import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { useSendContactMutation } from '../../store/api/apiSlice';

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sendContact, { isLoading }] = useSendContactMutation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    animate(e.currentTarget, {
      scale: [1, 1.05],
      duration: 300,
      ease: 'outBack',
    });
  };

  const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    animate(e.currentTarget, {
      scale: [1.05, 1],
      duration: 400,
      ease: 'outElastic(1, .6)',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setErrorMessage('');

    try {
      await sendContact(formData).unwrap();
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      setStatus('error');
      const error = err as { data?: { error?: string } };
      setErrorMessage(error?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 lg:py-32">
      <div className="section-container">
        <div className="animate-item opacity-0 text-center mb-12">
          <span className="font-mono text-xs text-accent tracking-wider uppercase">06 / Contact</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">Let's Connect</h2>
          <p className="text-text-secondary mt-3 max-w-md mx-auto">
            Open to conversations about systems design, AI-powered development, and interesting projects.
          </p>
        </div>

        <div className="animate-item opacity-0 max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-mono text-text-muted mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg bg-surface border border-surface-border text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-mono text-text-muted mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg bg-surface border border-surface-border text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs font-mono text-text-muted mb-1.5">
                Subject
              </label>
              <input
                type="text"
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg bg-surface border border-surface-border text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-mono text-text-muted mb-1.5">
                Message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                maxLength={5000}
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg bg-surface border border-surface-border text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors resize-y min-h-[120px]"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-accent text-surface font-medium text-sm hover:bg-accent-hover hover:shadow-[0_0_25px_rgba(88,166,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <p className="text-sm text-green-400 font-mono mt-2">
                ✓ Message sent! I'll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-400 font-mono mt-2">
                ✗ {errorMessage}
              </p>
            )}
          </form>
        </div>

        {/* Links */}
        <div className="animate-item opacity-0 flex flex-wrap items-center justify-center gap-4 mt-12">
          <a
            href="mailto:io@ezeke.dev"
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-surface-border text-text-secondary hover:text-accent hover:border-accent/50 hover:shadow-[0_0_15px_rgba(88,166,255,0.15)] transition-all duration-300 text-sm font-mono"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14H1.75A1.75 1.75 0 010 12.25v-8.5C0 2.784.784 2 1.75 2zM1.5 3.75v.736l6.5 3.777 6.5-3.777V3.75a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25zm13 2.196l-6.227 3.618a.5.5 0 01-.546 0L1.5 5.946v6.304c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.946z" />
            </svg>
            io@ezeke.dev
          </a>
          <a
            href="https://github.com/eimf"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-surface-border text-text-secondary hover:text-accent hover:border-accent/50 hover:shadow-[0_0_15px_rgba(88,166,255,0.15)] transition-all duration-300 text-sm font-mono"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ezzykeeel/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-surface-border text-text-secondary hover:text-accent hover:border-accent/50 hover:shadow-[0_0_15px_rgba(88,166,255,0.15)] transition-all duration-300 text-sm font-mono"
          >
            LinkedIn
          </a>
        </div>

        {/* Location & footer */}
        <div className="animate-item opacity-0 mt-16 pt-8 border-t border-surface-border">
          <div className="flex items-center justify-center gap-2 text-xs text-text-muted font-mono">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-text-muted">
              <path d="M8 0a5.53 5.53 0 00-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 11-.708-.708l3-3a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0z" />
            </svg>
            McAllen, TX · {new Date().getFullYear()} · Built with React, Anime.js & <a href="/admin/login" className="text-surface-border hover:text-accent/30 transition-colors cursor-default">☕</a>
          </div>
        </div>
      </div>
    </section>
  );
}
