import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

export function HeroSection() {
  const scrollToAbout = () => {
    const element = document.querySelector("#about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative"
    >
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Glass pill badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-foreground/5 backdrop-blur-2xl border border-foreground/10 mb-6 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
            <p className="text-sm tracking-wide text-muted-foreground">
              Available for work
            </p>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Creative Developer
            <span className="block text-muted-foreground/80">& Designer</span>
          </h1>
          <p className="text-lg text-muted-foreground/90 max-w-xl mx-auto mb-10 leading-relaxed">
            I craft beautiful digital experiences with clean code and thoughtful
            design. Passionate about building products that make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="relative bg-foreground text-background hover:bg-foreground/90 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => {
                const element = document.querySelector("#projects");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View My Work
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={() => {
                const element = document.querySelector("#contact");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator with glass effect */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 p-3 rounded-full bg-foreground/5 backdrop-blur-xl border border-foreground/10 text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-300 animate-bounce"
        aria-label="Scroll to about section"
      >
        <ArrowDown className="h-5 w-5" />
      </button>
    </section>
  );
}
