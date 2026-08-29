"use client";

import { ReactLenis } from "lenis/react";
import LandingPage from "@/components/LandingPage/LandingPage";
import Intro from "@/components/Intro/Intro";
import Education from "@/components/Education/Education";
import ProjectTextReveal from "@/components/ProjectTextReveal/ProjectTextReveal";
import Experience from "@/components/Experience/Experience";
import Hackathons1 from "@/components/Hackathons1/Hackathons1";
import Hackathons2 from "@/components/Hackathons2/Hackathons2";
import Skills from "@/components/Skills/Skills";
import Testimonials from "@/components/Testimonials/Testimonials";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <ReactLenis root>
        <main style={{ overflowX: "hidden" }}>
          <LandingPage />
          <Intro />
          <Education />
          <ProjectTextReveal />
          <Experience />
          <Hackathons1 />
          <Hackathons2 />
          <Skills />
          <Testimonials />
          <Footer />
        </main>
      </ReactLenis>
    </>
  );
}
