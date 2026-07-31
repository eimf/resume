import { useRef, useEffect } from 'react';

interface Dot {
  x: number;
  y: number;
  baseAlpha: number;
  currentAlpha: number;
  currentSize: number;
  targetAlpha: number;
  targetSize: number;
}

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dotsRef = useRef<Dot[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spacing = 28;
    const interactionRadius = 180;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      dotsRef.current = [];
      for (let x = spacing; x < window.innerWidth; x += spacing) {
        for (let y = spacing; y < window.innerHeight; y += spacing) {
          dotsRef.current.push({
            x,
            y,
            baseAlpha: 0.06 + Math.random() * 0.03,
            currentAlpha: 0,
            currentSize: 1,
            targetAlpha: 0,
            targetSize: 1,
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const { x: mx, y: my } = mouseRef.current;

      for (const dot of dotsRef.current) {
        const dist = Math.sqrt((dot.x - mx) ** 2 + (dot.y - my) ** 2);
        const influence = Math.max(0, 1 - dist / interactionRadius);

        // Smooth targeting
        dot.targetAlpha = dot.baseAlpha + influence * 0.6;
        dot.targetSize = 1 + influence * 2;

        // Lerp for smooth animation
        dot.currentAlpha = lerp(dot.currentAlpha, dot.targetAlpha, 0.08);
        dot.currentSize = lerp(dot.currentSize, dot.targetSize, 0.1);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.currentSize, 0, Math.PI * 2);

        // Color shifts based on proximity — blue to purple gradient
        const hue = 210 + influence * 40;
        ctx.fillStyle = `hsla(${hue}, 80%, 65%, ${dot.currentAlpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(render);
    };

    resize();
    render();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
