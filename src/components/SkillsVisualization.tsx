import { useEffect, useRef, useState } from 'react';
import { AnimatedSection } from './ui/animated-section';

interface Skill {
  name: string;
  level: number;
  category: string;
  connections: string[];
}

const skills: Skill[] = [
  { name: 'React', level: 95, category: 'frontend', connections: ['TypeScript', 'Next.js', 'Tailwind CSS'] },
  { name: 'TypeScript', level: 90, category: 'language', connections: ['React', 'Node.js', 'Next.js'] },
  { name: 'Node.js', level: 85, category: 'backend', connections: ['TypeScript', 'PostgreSQL', 'GraphQL'] },
  { name: 'Tailwind CSS', level: 92, category: 'frontend', connections: ['React', 'Next.js'] },
  { name: 'Next.js', level: 88, category: 'frontend', connections: ['React', 'TypeScript', 'Node.js'] },
  { name: 'PostgreSQL', level: 80, category: 'database', connections: ['Node.js', 'GraphQL'] },
  { name: 'GraphQL', level: 75, category: 'api', connections: ['Node.js', 'PostgreSQL', 'React'] },
  { name: 'Docker', level: 70, category: 'devops', connections: ['Node.js', 'PostgreSQL'] },
  { name: 'Python', level: 82, category: 'language', connections: ['Machine Learning'] },
  { name: 'Machine Learning', level: 75, category: 'ai', connections: ['Python'] },
];

interface Node {
  skill: Skill;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function SkillsVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoveredNodeRef = useRef<Node | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Initialize nodes in a circular pattern
      if (nodesRef.current.length === 0) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.35;

        nodesRef.current = skills.map((skill, i) => {
          const angle = (i / skills.length) * Math.PI * 2;
          const jitter = (Math.random() - 0.5) * 50;
          return {
            skill,
            x: centerX + Math.cos(angle) * (radius + jitter),
            y: centerY + Math.sin(angle) * (radius + jitter),
            vx: 0,
            vy: 0,
            radius: 20 + (skill.level / 100) * 25,
          };
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Check for hovered node
      let found = false;
      for (const node of nodesRef.current) {
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < node.radius + 10) {
          hoveredNodeRef.current = node;
          setHoveredSkill(node.skill);
          found = true;
          break;
        }
      }
      if (!found) {
        hoveredNodeRef.current = null;
        setHoveredSkill(null);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains('dark');
      const nodeColor = isDark ? 'rgba(255, 255, 255,' : 'rgba(0, 0, 0,';
      const connectionColor = isDark ? 'rgba(255, 255, 255,' : 'rgba(0, 0, 0,';

      // Physics simulation
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      nodesRef.current.forEach((node, i) => {
        // Center attraction
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        node.vx += dx * 0.0001;
        node.vy += dy * 0.0001;

        // Mouse repulsion
        const mdx = mouseRef.current.x - node.x;
        const mdy = mouseRef.current.y - node.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 150 && mDist > 0) {
          const force = (150 - mDist) / 150;
          node.vx -= (mdx / mDist) * force * 0.5;
          node.vy -= (mdy / mDist) * force * 0.5;
        }

        // Node repulsion
        nodesRef.current.forEach((other, j) => {
          if (i === j) return;
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = node.radius + other.radius + 30;
          if (dist < minDist && dist > 0) {
            const force = (minDist - dist) / minDist;
            node.vx -= (dx / dist) * force * 0.3;
            node.vy -= (dy / dist) * force * 0.3;
          }
        });

        // Apply velocity with damping
        node.vx *= 0.95;
        node.vy *= 0.95;
        node.x += node.vx;
        node.y += node.vy;

        // Boundary constraints
        node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(canvas.height - node.radius, node.y));
      });

      // Draw connections
      nodesRef.current.forEach(node => {
        node.skill.connections.forEach(connName => {
          const connNode = nodesRef.current.find(n => n.skill.name === connName);
          if (connNode) {
            const isHovered = hoveredNodeRef.current?.skill.name === node.skill.name ||
                             hoveredNodeRef.current?.skill.name === connName;
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connNode.x, connNode.y);
            ctx.strokeStyle = `${connectionColor}${isHovered ? '0.3)' : '0.08)'}`;
            ctx.lineWidth = isHovered ? 2 : 1;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodesRef.current.forEach(node => {
        const isHovered = hoveredNodeRef.current === node;
        const isConnected = hoveredNodeRef.current?.skill.connections.includes(node.skill.name);
        
        // Glow
        if (isHovered || isConnected) {
          const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.radius * 2
          );
          gradient.addColorStop(0, `${nodeColor}0.2)`);
          gradient.addColorStop(1, `${nodeColor}0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeColor}${isHovered ? '0.15)' : isConnected ? '0.1)' : '0.05)'}`;
        ctx.fill();
        ctx.strokeStyle = `${nodeColor}${isHovered ? '0.5)' : isConnected ? '0.3)' : '0.15)'}`;
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = `${nodeColor}${isHovered ? '1)' : '0.7)'}`;
        ctx.font = `${isHovered ? '600 ' : ''}${node.radius * 0.4}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.skill.name, node.x, node.y);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background/0 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center drop-shadow-md">
              Skills & Expertise
            </h2>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={100}>
            <p className="text-foreground/75 text-center mb-8 max-w-2xl mx-auto drop-shadow-sm">
              An interactive visualization of my technical skills. Hover to explore connections.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="scale" delay={200}>
            <div 
              ref={containerRef}
              className="relative w-full rounded-3xl overflow-hidden border border-foreground/[0.08] bg-gradient-to-br from-foreground/[0.02] to-transparent"
              style={{ height: '500px' }}
            >
              <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
              
              {/* Skill detail popup */}
              {hoveredSkill && (
                <div className="absolute bottom-4 left-4 p-4 rounded-xl bg-background/80 backdrop-blur-xl border border-foreground/10 shadow-lg">
                  <h4 className="font-semibold text-foreground mb-1">{hoveredSkill.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1.5 flex-1 bg-foreground/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-foreground/60 rounded-full transition-all duration-500"
                        style={{ width: `${hoveredSkill.level}%` }}
                      />
                    </div>
                    <span className="text-xs text-foreground/60">{hoveredSkill.level}%</span>
                  </div>
                  <p className="text-xs text-foreground/50 capitalize">{hoveredSkill.category}</p>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
