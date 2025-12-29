import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Add new point
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
      });

      // Limit points
      if (pointsRef.current.length > 50) {
        pointsRef.current.shift();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Age and remove old points
      pointsRef.current = pointsRef.current
        .map(p => ({ ...p, age: p.age + 1 }))
        .filter(p => p.age < 30);

      if (pointsRef.current.length > 2) {
        ctx.beginPath();
        ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);

        for (let i = 1; i < pointsRef.current.length - 1; i++) {
          const point = pointsRef.current[i];
          const nextPoint = pointsRef.current[i + 1];
          
          const cpX = (point.x + nextPoint.x) / 2;
          const cpY = (point.y + nextPoint.y) / 2;
          
          ctx.quadraticCurveTo(point.x, point.y, cpX, cpY);
        }

        // Create gradient along the trail
        const gradient = ctx.createLinearGradient(
          pointsRef.current[0].x,
          pointsRef.current[0].y,
          pointsRef.current[pointsRef.current.length - 1].x,
          pointsRef.current[pointsRef.current.length - 1].y
        );
        
        // Get computed styles for theming
        const computedStyle = getComputedStyle(document.documentElement);
        const isDark = document.documentElement.classList.contains('dark');
        
        gradient.addColorStop(0, isDark ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.5, isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)');
        gradient.addColorStop(1, isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.15)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Draw glow at cursor position
        const lastPoint = pointsRef.current[pointsRef.current.length - 1];
        if (lastPoint) {
          const glowGradient = ctx.createRadialGradient(
            lastPoint.x, lastPoint.y, 0,
            lastPoint.x, lastPoint.y, 30
          );
          glowGradient.addColorStop(0, isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)');
          glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(lastPoint.x, lastPoint.y, 30, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}
