import { useEffect, useRef, useCallback } from 'react';

interface MagneticConfig {
  strength?: number;
  radius?: number;
  damping?: number;
}

export function useMagneticText(config: MagneticConfig = {}) {
  const { strength = 0.3, radius = 150, damping = 0.15 } = config;
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentPositions = useRef<{ x: number; y: number }[]>([]);
  const rafRef = useRef<number>();

  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

  const animate = useCallback(() => {
    charsRef.current.forEach((char, i) => {
      if (!char || !currentPositions.current[i]) return;

      const rect = char.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = mouseRef.current.x - centerX;
      const deltaY = mouseRef.current.y - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      let targetX = 0;
      let targetY = 0;

      if (distance < radius) {
        const force = (1 - distance / radius) * strength;
        targetX = deltaX * force;
        targetY = deltaY * force;
      }

      currentPositions.current[i].x = lerp(currentPositions.current[i].x, targetX, damping);
      currentPositions.current[i].y = lerp(currentPositions.current[i].y, targetY, damping);

      char.style.transform = `translate(${currentPositions.current[i].x}px, ${currentPositions.current[i].y}px)`;
    });

    rafRef.current = requestAnimationFrame(animate);
  }, [radius, strength, damping]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Initialize positions
    charsRef.current = Array.from(container.querySelectorAll('.magnetic-char')) as HTMLSpanElement[];
    currentPositions.current = charsRef.current.map(() => ({ x: 0, y: 0 }));

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return containerRef;
}

// Utility to split text into magnetic characters
export function MagneticText({ 
  children, 
  className = '',
  charClassName = ''
}: { 
  children: string; 
  className?: string;
  charClassName?: string;
}) {
  const containerRef = useMagneticText({ strength: 0.4, radius: 120 });

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {children.split('').map((char, i) => (
        <span
          key={i}
          className={`magnetic-char inline-block transition-colors duration-200 ${charClassName}`}
          style={{ 
            willChange: 'transform',
            display: char === ' ' ? 'inline' : 'inline-block',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
