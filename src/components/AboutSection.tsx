import { Code, Palette, Lightbulb } from "lucide-react";
import { GlassCard } from "./ui/glass-card";

const highlights = [
  {
    icon: Code,
    title: "Clean Code",
    description: "Writing maintainable, scalable, and efficient code is my priority.",
  },
  {
    icon: Palette,
    title: "Design Focused",
    description: "Creating visually appealing interfaces that users love to interact with.",
  },
  {
    icon: Lightbulb,
    title: "Problem Solver",
    description: "Finding creative solutions to complex technical challenges.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 relative">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background/0 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            About Me
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            A passionate developer with a keen eye for design and a love for
            creating seamless user experiences.
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Hello, I'm Alex
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                With over 5 years of experience in web development, I specialize
                in building modern, responsive applications using cutting-edge
                technologies. My journey started with a curiosity about how
                things work on the web, and it has evolved into a passion for
                creating impactful digital solutions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When I'm not coding, you can find me exploring new technologies,
                contributing to open-source projects, or enjoying a good cup of
                coffee while sketching new design ideas.
              </p>
            </div>
            <GlassCard variant="strong" className="p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">5+</p>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">50+</p>
                  <p className="text-sm text-muted-foreground">Projects Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">30+</p>
                  <p className="text-sm text-muted-foreground">Happy Clients</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">10+</p>
                  <p className="text-sm text-muted-foreground">Technologies</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item) => (
              <GlassCard key={item.title} className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 mb-4">
                  <item.icon className="h-6 w-6 text-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
