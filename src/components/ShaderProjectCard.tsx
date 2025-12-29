import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from './ui/button';

interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;
}

interface ShaderProjectCardProps {
  project: Project;
  index: number;
}

export function ShaderProjectCard({ project, index }: ShaderProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  // Different shader effects based on index
  const getShaderStyle = () => {
    const rotateX = (mousePos.y - 0.5) * 10;
    const rotateY = (mousePos.x - 0.5) * -10;
    const glareX = mousePos.x * 100;
    const glareY = mousePos.y * 100;

    const effects = [
      // Liquid distortion effect
      {
        background: isHovered 
          ? `radial-gradient(circle at ${glareX}% ${glareY}%, hsl(var(--foreground) / 0.1) 0%, transparent 50%)`
          : 'transparent',
        boxShadow: isHovered 
          ? `0 20px 40px -20px hsl(var(--foreground) / 0.3), inset 0 0 60px hsl(var(--foreground) / 0.05)`
          : '0 4px 20px -10px hsl(var(--foreground) / 0.1)',
      },
      // Chromatic aberration hint
      {
        background: isHovered 
          ? `linear-gradient(${135 + (mousePos.x - 0.5) * 30}deg, hsl(var(--foreground) / 0.05), transparent 60%)`
          : 'transparent',
        boxShadow: isHovered 
          ? `0 25px 50px -20px hsl(var(--foreground) / 0.25), -2px 0 20px -10px rgba(255,0,0,0.1), 2px 0 20px -10px rgba(0,0,255,0.1)`
          : '0 4px 20px -10px hsl(var(--foreground) / 0.1)',
      },
      // Aurora effect
      {
        background: isHovered 
          ? `conic-gradient(from ${mousePos.x * 360}deg at ${glareX}% ${glareY}%, hsl(var(--foreground) / 0.08), transparent 30%, hsl(var(--foreground) / 0.05), transparent 60%)`
          : 'transparent',
        boxShadow: isHovered 
          ? `0 20px 60px -20px hsl(var(--foreground) / 0.3)`
          : '0 4px 20px -10px hsl(var(--foreground) / 0.1)',
      },
      // Ripple effect
      {
        background: isHovered 
          ? `radial-gradient(circle at ${glareX}% ${glareY}%, transparent 0%, hsl(var(--foreground) / 0.03) 20%, transparent 40%, hsl(var(--foreground) / 0.02) 60%, transparent 80%)`
          : 'transparent',
        boxShadow: isHovered 
          ? `0 30px 60px -20px hsl(var(--foreground) / 0.2)`
          : '0 4px 20px -10px hsl(var(--foreground) / 0.1)',
      },
    ];

    return effects[index % effects.length];
  };

  const shaderStyle = getShaderStyle();
  const rotateX = isHovered ? (mousePos.y - 0.5) * 8 : 0;
  const rotateY = isHovered ? (mousePos.x - 0.5) * -8 : 0;

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-gradient-to-br from-foreground/[0.03] to-transparent backdrop-blur-md transition-all duration-500"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        transformStyle: 'preserve-3d',
        ...shaderStyle,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glare overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
        }}
      />

      {/* Image */}
      <div className="aspect-video overflow-hidden relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{
            transform: isHovered 
              ? `scale(1.1) translate(${(mousePos.x - 0.5) * -10}px, ${(mousePos.y - 0.5) * -10}px)` 
              : 'scale(1)',
          }}
        />
        
        {/* Image overlay gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"
        />
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        <h3 
          className="text-xl font-semibold text-foreground mb-2 transition-transform duration-300"
          style={{
            transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
          }}
        >
          {project.title}
        </h3>
        
        <p 
          className="text-foreground/70 text-sm mb-4 leading-relaxed transition-all duration-300"
          style={{
            transform: isHovered ? 'translateZ(15px)' : 'translateZ(0)',
            opacity: isHovered ? 1 : 0.8,
          }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div 
          className="flex flex-wrap gap-2 mb-6 transition-transform duration-300"
          style={{ transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)' }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-xs bg-foreground/[0.08] backdrop-blur-sm text-foreground/80 rounded-lg border border-foreground/[0.1] transition-all duration-300 group-hover:bg-foreground/[0.12]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div 
          className="flex gap-3 transition-transform duration-300"
          style={{ transform: isHovered ? 'translateZ(25px)' : 'translateZ(0)' }}
        >
          <Button variant="glass" size="sm" asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Live Demo
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-foreground/8" asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              Code
            </a>
          </Button>
        </div>
      </div>

      {/* Edge glow */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: 'inset 0 0 40px hsl(var(--foreground) / 0.05)',
        }}
      />
    </div>
  );
}
