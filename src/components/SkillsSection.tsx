import { GlassCard } from "./ui/glass-card";

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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            Skills & Expertise
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <GlassCard variant="default" className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Core Technologies
              </h3>
              <div className="space-y-5">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {skill.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 bg-foreground/5 backdrop-blur-sm rounded-full overflow-hidden border border-foreground/5">
                      <div
                        className="h-full bg-gradient-to-r from-foreground/60 to-foreground/80 rounded-full transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard variant="default" className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Other Technologies
              </h3>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 text-sm bg-foreground/5 backdrop-blur-xl text-foreground/80 rounded-xl border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/10 transition-all duration-300 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
