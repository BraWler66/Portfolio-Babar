"use client";

import dynamic from "next/dynamic";

const AboutSection      = dynamic(() => import("@/components/about-section"),       { ssr: false });
const WhatIDo           = dynamic(() => import("@/components/WhatIDo"),             { ssr: false });
const ExperienceSection = dynamic(() => import("@/components/ExperienceSection"),   { ssr: false });
const SkillsMarquee     = dynamic(() => import("@/components/SkillsMarquee"),       { ssr: false });
const TechGlobeSection  = dynamic(() => import("@/components/TechGlobeSection"),    { ssr: false });
const ProjectsSection   = dynamic(() => import("@/components/projects-section"),    { ssr: false });
const CTASection        = dynamic(() => import("@/components/cta-section"),         { ssr: false });
const NeuralBackground  = dynamic(() => import("@/components/NeuralBackground"),    { ssr: false });

export default function PageSections() {
  return (
    <>
      <NeuralBackground />
      <AboutSection />
      <WhatIDo />
      <ExperienceSection />
      <TechGlobeSection />
      <SkillsMarquee />
      <ProjectsSection />
      <CTASection />
    </>
  );
}
