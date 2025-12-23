import { GlassCard } from "./ui/glass-card";
import { AnimatedSection } from "./ui/animated-section";

const skills = [
  { name: "React", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Node.js", level: 85 },
  { name: "Tailwind CSS", level: 95 },
  { name: "Next.js", level: 85 },
  { name: "PostgreSQL", level: 80 },
  { name: "GraphQL", level: 75 },
  { name: "Docker", level: 70 },
];

const technologies = [
  "JavaScript",
  "HTML5",
  "CSS3",
  "Git",
  "REST APIs",
  "MongoDB",
  "Redis",
  "AWS",
  "Figma",
  "Framer Motion",
  "Testing Library",
  "CI/CD",
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background/0 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center drop-shadow-md">
              Skills & Expertise
            </h2>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={100}>
            <p className="text-foreground/75 text-center mb-16 max-w-2xl mx-auto drop-shadow-sm">
              Technologies and tools I use to bring ideas to life.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <AnimatedSection animation="fade-right" delay={200}>
              <GlassCard variant="default" className="p-6 h-full">
                <h3 className="text-xl font-semibold text-foreground mb-6 drop-shadow-sm">
                  Core Technologies
                </h3>
                <div className="space-y-5">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-foreground drop-shadow-sm">
                          {skill.name}
                        </span>
                        <span className="text-sm text-foreground/70">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-gradient-to-r from-foreground/[0.06] to-foreground/[0.1] backdrop-blur-sm rounded-full overflow-hidden border border-foreground/[0.1] shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]">
                        <div
                          className="h-full bg-gradient-to-r from-foreground/50 via-foreground/70 to-foreground/60 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection animation="fade-left" delay={300}>
              <GlassCard variant="default" className="p-6 h-full">
                <h3 className="text-xl font-semibold text-foreground mb-6 drop-shadow-sm">
                  Other Technologies
                </h3>
                <div className="flex flex-wrap gap-3">
                  {technologies.map((tech, index) => (
                    <AnimatedSection key={tech} animation="scale" delay={50 * index}>
                      <span
                        className="px-4 py-2 text-sm bg-gradient-to-br from-foreground/[0.1] via-foreground/[0.06] to-transparent backdrop-blur-xl text-foreground/85 rounded-xl border border-foreground/[0.1] shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-foreground/18 hover:from-foreground/[0.14] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                      >
                        {tech}
                      </span>
                    </AnimatedSection>
                  ))}
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
