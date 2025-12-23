import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { FloatingGeometry } from "./FloatingGeometry";
export function HeroSection() {
  const scrollToAbout = () => {
    const element = document.querySelector("#about");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <section id="home" className="min-h-screen flex items-center justify-center relative">
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4 animate-fade-in">
              Welcome to my portfolio
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Atharwa Vatsyayan
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10">
              I craft beautiful digital experiences with clean code and thoughtful
              design. Passionate about building products that make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={() => {
                const element = document.querySelector("#projects");
                if (element) element.scrollIntoView({
                  behavior: "smooth"
                });
              }} className="text-lg text-center">View My Work</Button>
              <Button variant="outline" size="lg" onClick={() => {
                const element = document.querySelector("#contact");
                if (element) element.scrollIntoView({
                  behavior: "smooth"
                });
              }}>
                Get In Touch
              </Button>
            </div>
          </div>
          
          {/* 3D Element */}
          <div className="flex-1 w-full h-[300px] md:h-[400px] lg:h-[500px] relative">
            <FloatingGeometry />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button onClick={scrollToAbout} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-bounce" aria-label="Scroll to about section">
        <ArrowDown className="h-6 w-6" />
      </button>
    </section>;
}
