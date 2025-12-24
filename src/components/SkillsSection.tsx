import { AnimatedSection } from "./ui/animated-section";
import InfiniteMenu from "./ui/infinite-menu";

const skillItems = [
  {
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    link: "https://react.dev/",
    title: "React",
    description: "Building modern UIs"
  },
  {
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    link: "https://www.typescriptlang.org/",
    title: "TypeScript",
    description: "Type-safe development"
  },
  {
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    link: "https://nodejs.org/",
    title: "Node.js",
    description: "Server-side JavaScript"
  },
  {
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    link: "https://tailwindcss.com/",
    title: "Tailwind CSS",
    description: "Utility-first styling"
  },
  {
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    link: "https://nextjs.org/",
    title: "Next.js",
    description: "React framework"
  },
  {
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    link: "https://www.postgresql.org/",
    title: "PostgreSQL",
    description: "Relational databases"
  },
  {
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
    link: "https://graphql.org/",
    title: "GraphQL",
    description: "Query language for APIs"
  },
  {
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    link: "https://www.docker.com/",
    title: "Docker",
    description: "Containerization"
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 relative">
      {/* Gradient overlay */}
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
              Technologies and tools I use to bring ideas to life. Drag to explore.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="scale" delay={200}>
            <div 
              className="relative w-full rounded-3xl overflow-hidden"
              style={{ height: "500px" }}
            >
              {/* Glass background for the menu */}
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] via-foreground/[0.01] to-transparent backdrop-blur-sm rounded-3xl border border-foreground/[0.08]" />
              
              {/* Infinite menu */}
              <InfiniteMenu items={skillItems} scale={1.0} />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
