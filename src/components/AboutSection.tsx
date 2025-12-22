import { Code, Palette, Lightbulb } from "lucide-react";

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
    <section id="about" className="py-24 bg-background/40 backdrop-blur-sm">
      <div className="container mx-auto px-6">
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
            <div className="bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-border/50 shadow-xl shadow-background/10">
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
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/50 hover:border-border hover:bg-card/60 transition-all duration-300 shadow-lg shadow-background/5"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/60 backdrop-blur-sm mb-4">
                  <item.icon className="h-6 w-6 text-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
