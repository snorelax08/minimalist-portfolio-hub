import { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, Instagram, ArrowUp, Sparkles } from 'lucide-react';

const socialLinks = [
  { icon: Github, href: "https://github.com/snorelax08", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/atharwa-vatsyayan-78a83a260/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/", label: "Instagram" },
];

export function EscapeVelocityFooter() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            setScrollProgress(ratio);
          }
        });
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) }
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  const scale = 0.8 + scrollProgress * 0.2;
  const opacity = scrollProgress;
  const blur = (1 - scrollProgress) * 10;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-foreground/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: isVisible ? 0.5 : 0,
              transition: 'opacity 1s ease-out',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className="relative z-10 text-center px-6 transition-all duration-700"
        style={{
          transform: `scale(${scale}) translateZ(${scrollProgress * 50}px)`,
          opacity,
          filter: `blur(${blur}px)`,
        }}
      >
        {/* Decorative element */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-foreground/60 animate-pulse" />
            <div className="absolute inset-0 blur-lg bg-foreground/20 animate-pulse" />
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Let's Create Something Amazing
        </h3>
        
        <p className="text-foreground/60 max-w-md mx-auto mb-8">
          Ready to bring your vision to life? I'm always excited to collaborate on innovative projects.
        </p>

        {/* Social links with stagger animation */}
        <div className="flex justify-center gap-4 mb-12">
          {socialLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/70 hover:bg-foreground/10 hover:text-foreground hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease-out ${i * 0.1}s`,
              }}
              aria-label={link.label}
            >
              <link.icon className="w-5 h-5" />
              
              {/* Hover ring effect */}
              <div className="absolute inset-0 rounded-full border border-foreground/0 group-hover:border-foreground/20 group-hover:scale-150 transition-all duration-500 opacity-0 group-hover:opacity-100" />
            </a>
          ))}
        </div>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s ease-out 0.3s',
          }}
        >
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
          <span className="text-sm font-medium">Back to Top</span>
        </button>

        {/* Copyright */}
        <p 
          className="mt-12 text-xs text-foreground/40"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.8s ease-out 0.5s',
          }}
        >
          © {new Date().getFullYear()} Atharwa Vatsyayan. Crafted with passion.
        </p>
      </div>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </footer>
  );
}
