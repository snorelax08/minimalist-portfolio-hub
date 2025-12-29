import { useEffect, useRef, useCallback } from 'react';

interface GravitationalElement {
  element: HTMLElement;
  originalTransform: string;
  strength: number;
  radius: number;
}

export function useGravitationalCursor(containerRef: React.RefObject<HTMLElement>) {
  const elementsRef = useRef<GravitationalElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const updateElements = useCallback(() => {
    elementsRef.current.forEach((item) => {
      const rect = item.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = mouseRef.current.x - centerX;
      const deltaY = mouseRef.current.y - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < item.radius) {
        const force = (1 - distance / item.radius) * item.strength;
        const moveX = deltaX * force * 0.15;
        const moveY = deltaY * force * 0.15;
        
        item.element.style.transform = `${item.originalTransform} translate(${moveX}px, ${moveY}px)`;
      } else {
        item.element.style.transform = item.originalTransform;
      }
    });

    rafRef.current = requestAnimationFrame(updateElements);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Find all gravitational elements
    const gravitationalElements = container.querySelectorAll('[data-gravitational]');
    
    elementsRef.current = Array.from(gravitationalElements).map((el) => {
      const element = el as HTMLElement;
      const strength = parseFloat(element.dataset.gravitationalStrength || '1');
      const radius = parseFloat(element.dataset.gravitationalRadius || '200');
      
      return {
        element,
        originalTransform: element.style.transform || '',
        strength,
        radius,
      };
    });

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(updateElements);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      // Reset transforms
      elementsRef.current.forEach((item) => {
        item.element.style.transform = item.originalTransform;
      });
    };
  }, [containerRef, updateElements]);
}

// Standalone hook for individual elements
export function useGravitationalElement(strength = 1, radius = 200) {
  const elementRef = useRef<HTMLDivElement>(null);
  const currentTransform = useRef({ x: 0, y: 0 });
  const targetTransform = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const animate = () => {
      currentTransform.current.x = lerp(currentTransform.current.x, targetTransform.current.x, 0.1);
      currentTransform.current.y = lerp(currentTransform.current.y, targetTransform.current.y, 0.1);
      
      element.style.transform = `translate(${currentTransform.current.x}px, ${currentTransform.current.y}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < radius) {
        const force = (1 - distance / radius) * strength;
        targetTransform.current = {
          x: deltaX * force * 0.2,
          y: deltaY * force * 0.2,
        };
      } else {
        targetTransform.current = { x: 0, y: 0 };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [strength, radius]);

  function lerp(start: number, end: number, factor: number) {
    return start + (end - start) * factor;
  }

  return elementRef;
}
