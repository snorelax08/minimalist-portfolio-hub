import { useEffect, useRef, useState } from 'react';

interface Section {
  id: string;
  element: HTMLElement;
  progress: number;
}

export function useCinematicScroll() {
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'projects', 'contact'];
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      // Overall progress
      const progress = scrollY / (docHeight - windowHeight);
      setScrollProgress(progress);

      // Find current section
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            if (currentSection !== id) {
              setIsTransitioning(true);
              setCurrentSection(id);
              setTimeout(() => setIsTransitioning(false), 500);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  return { currentSection, scrollProgress, isTransitioning };
}

export function ScrollProgressIndicator() {
  const { scrollProgress, currentSection } = useCinematicScroll();
  const sections = ['home', 'about', 'skills', 'projects', 'contact'];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
      {sections.map((section, i) => (
        <button
          key={section}
          onClick={() => {
            document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`group relative flex items-center justify-end gap-3 transition-all duration-300`}
        >
          <span 
            className={`text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-foreground/70 ${
              currentSection === section ? 'opacity-100' : ''
            }`}
          >
            {section}
          </span>
          <div 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSection === section 
                ? 'bg-foreground scale-150' 
                : 'bg-foreground/30 hover:bg-foreground/50'
            }`}
          />
        </button>
      ))}
      
      {/* Progress line */}
      <div className="absolute right-[3px] top-0 bottom-0 w-px bg-foreground/10">
        <div 
          className="absolute top-0 w-full bg-foreground/50 transition-all duration-150"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>
    </div>
  );
}

// Depth-based section wrapper
export function DepthSection({ 
  children, 
  id, 
  depth = 0 
}: { 
  children: React.ReactNode; 
  id: string; 
  depth?: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [viewProgress, setViewProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setInView(entry.isIntersecting);
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    observer.observe(section);

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionMiddle = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(windowHeight / 2 - sectionMiddle);
      const maxDistance = windowHeight / 2 + rect.height / 2;
      const progress = 1 - Math.min(distanceFromCenter / maxDistance, 1);
      setViewProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scale = 0.95 + viewProgress * 0.05;
  const opacity = 0.3 + viewProgress * 0.7;
  const translateZ = depth * (1 - viewProgress) * 50;

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative transition-all duration-300"
      style={{
        transform: `scale(${scale}) translateZ(${translateZ}px)`,
        opacity,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </section>
  );
}
