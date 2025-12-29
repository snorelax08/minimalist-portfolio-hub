import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsVisualization } from "@/components/SkillsVisualization";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";
import { EscapeVelocityFooter } from "@/components/EscapeVelocityFooter";
import { CursorTrail } from "@/components/CursorTrail";
import { ScrollProgressIndicator } from "@/components/CinematicTransitions";
import FloatingLines from "@/components/FloatingLines";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Cursor Trail Effect */}
      <CursorTrail />
      
      {/* Scroll Progress Indicator */}
      <ScrollProgressIndicator />
      
      {/* 3D Interactive Background */}
      <div className="fixed inset-0 z-0">
        <FloatingLines 
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[10, 15, 20]}
          lineDistance={[8, 6, 4]}
          bendRadius={2.0}
          bendStrength={-1.5}
          mouseDamping={0.1}
          interactive={true}
          parallax={true}
        />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsVisualization />
          <ProjectsSection />
          <ContactSection />
          <EscapeVelocityFooter />
        </main>
      </div>
    </div>
  );
};

export default Index;
