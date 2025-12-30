import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { AnimatedSection } from "./ui/animated-section";
import { MagneticText } from "@/hooks/use-magnetic-text";
import { TimeGreeting } from "./TimeGreeting";
import { Hero3DScene } from "./Hero3DScene";

export function HeroSection() {
  const scrollToAbout = () => {
    const element = document.querySelector("#about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* 3D Particle Universe Background */}
      <Hero3DScene />
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection animation="fade-up" delay={0}>
            <TimeGreeting className="mb-4 text-white/80" />
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={100}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                <MagneticText>Atharwa Vatsyayan</MagneticText>
              </span>
            </h1>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={200}>
            <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-12 leading-relaxed">
              I craft beautiful digital experiences with clean code and thoughtful
              design. Passionate about building products that make a difference.
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => {
                  const element = document.querySelector("#projects");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }} 
                className="text-lg bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 border-0 shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all duration-300"
              >
                View My Work
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => {
                  const element = document.querySelector("#contact");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-lg border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
              >
                Get In Touch
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <button 
        onClick={scrollToAbout} 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors animate-bounce z-10" 
        aria-label="Scroll to about section"
      >
        <ArrowDown className="h-6 w-6" />
      </button>
      
      {/* Subtle scan line effect */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
    </section>
  );
}
