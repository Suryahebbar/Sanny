"use client";

import { ReactLenis } from "lenis/react";
import LandingPage from "@/components/LandingPage/LandingPage";
import Intro from "@/components/Intro/Intro";
import Education from "@/components/Education/Education";
import Projects_new from "@/components/Projects_new/Projects_new";
import ExperienceTunnel from "@/components/ExperienceTunnel/ExperienceTunnel";
import Experience from "@/components/Experience/Experience";
import Achievements from "@/components/Achievements/Achievements";
import Hackathons2 from "@/components/Hackathons2/Hackathons2";
import Skills from "@/components/Skills/Skills";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <ReactLenis root>
        <main style={{ overflowX: "hidden" }}>
          <LandingPage />
          <Intro />
          <Education />
          <Projects_new />
          <ExperienceTunnel />
          <Experience />
          <Achievements />
          <Hackathons2 />
          <Skills />
          <Footer />
        </main>
      </ReactLenis>
    </>
  );
}
