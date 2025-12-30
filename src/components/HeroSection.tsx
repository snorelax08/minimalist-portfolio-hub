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
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#030014' }}>
      {/* 3D Warp Speed Universe - Canvas Layer */}
      <Hero3DScene />
      
      {/* Content Layer - Above 3D Canvas */}
      <div className="container mx-auto px-6 py-20 relative" style={{ zIndex: 10 }}>
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection animation="fade-up" delay={800}>
            <TimeGreeting className="mb-4 text-white/60 text-sm tracking-widest uppercase" />
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={1000}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span 
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #c084fc 0%, #818cf8 25%, #60a5fa 50%, #22d3ee 75%, #c084fc 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'gradient-shift 8s ease infinite',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 40px rgba(139, 92, 246, 0.5))',
                }}
              >
                <MagneticText>Atharwa Vatsyayan</MagneticText>
              </span>
            </h1>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={1200}>
            <p className="text-lg md:text-xl text-white/50 max-w-xl mx-auto mb-12 leading-relaxed">
              I craft beautiful digital experiences with clean code and thoughtful
              design. Passionate about building products that make a difference.
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="fade-up" delay={1400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => {
                  const element = document.querySelector("#projects");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }} 
                className="text-lg text-white border-0 transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8))',
                  boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
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
                className="text-lg text-white/80 hover:text-white transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Get In Touch
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <button 
        onClick={scrollToAbout} 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 hover:text-white/70 transition-colors animate-bounce" 
        style={{ zIndex: 10 }}
        aria-label="Scroll to about section"
      >
        <ArrowDown className="h-6 w-6" />
      </button>
      
      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
