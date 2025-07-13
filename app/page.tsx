"use client"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import ProjectsSection from "@/components/projects-section"
import TechStackSection from "@/components/tech-stack-section"
import BuildLogsSection from "@/components/build-logs-section"
import CTASection from "@/components/cta-section"
import Particles from "@/components/Particles-BG"

export default function Home() {
  return (
    <>
      {/* <div className="fixed inset-0 -z-10 bg-black">
      
          <Particles
            particleColors={['#ffffff', '#ffffff']}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div> */}
     
      <HeroSection />
      <AboutSection />
      <TechStackSection />
      <ProjectsSection />
      {/* <BuildLogsSection /> */}
      <CTASection />
    </>
  );
}