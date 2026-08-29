"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import "./Testimonials.css";

export default function Testimonials() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger, SplitText);

      let targetVelocity = 0;

      // Handle custom scroll velocity from parent scroll (e.g. lenis scroll)
      // Since Lenis is running globally on Root, we can hook into window's scroll
      // or simply calculate from scroll trigger's velocity.
      ScrollTrigger.addEventListener("scrollStart", () => { });

      const textBlocks = gsap.utils.toArray(containerRef.current.querySelectorAll(".copy-block p"));
      const splitInstances = textBlocks.map((block) =>
        SplitText.create(block, { type: "words", mask: "words" })
      );

      gsap.set(splitInstances[1].words, { yPercent: 100 });
      gsap.set(splitInstances[2].words, { yPercent: 100 });

      const overlapCount = 3;

      const getWordProgress = (phaseProgress, wordIndex, totalWords) => {
        const totalLength = 1 + overlapCount / totalWords;
        const scale =
          1 /
          Math.min(
            totalLength,
            1 + (totalWords - 1) / totalWords + overlapCount / totalWords
          );

        const startTime = (wordIndex / totalWords) * scale;
        const endTime = startTime + (overlapCount / totalWords) * scale;
        const duration = endTime - startTime;

        if (phaseProgress <= startTime) return 0;
        if (phaseProgress >= endTime) return 1;
        return (phaseProgress - startTime) / duration;
      };

      const animateBlock = (outBlock, inBlock, phaseProgress) => {
        outBlock.words.forEach((word, i) => {
          const progress = getWordProgress(phaseProgress, i, outBlock.words.length);
          gsap.set(word, { yPercent: progress * 100 });
        });

        inBlock.words.forEach((word, i) => {
          const progress = getWordProgress(phaseProgress, i, inBlock.words.length);
          gsap.set(word, { yPercent: 100 - progress * 100 });
        });
      };

      const indicator = containerRef.current.querySelector(".scroll-indicator");

      const marqueeTrack = containerRef.current.querySelector(".marquee-track");
      const items = gsap.utils.toArray(containerRef.current.querySelectorAll(".marquee-item"));
      items.forEach((item) => marqueeTrack.appendChild(item.cloneNode(true)));

      let marqueePosition = 0;
      let smoothVelocity = 0;

      const tickerFunction = () => {
        smoothVelocity += (targetVelocity - smoothVelocity) * 0.5;

        const baseSpeed = 0.45;
        const speed = baseSpeed + smoothVelocity * 9;

        marqueePosition -= speed;

        const trackWidth = marqueeTrack.scrollWidth / 2;
        if (marqueePosition <= -trackWidth) {
          marqueePosition = 0;
        }

        gsap.set(marqueeTrack, { x: marqueePosition });

        targetVelocity *= 0.9;
      };

      gsap.ticker.add(tickerFunction);

      ScrollTrigger.create({
        trigger: containerRef.current.querySelector(".container"),
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const scrollProgress = self.progress;
          targetVelocity = Math.abs(self.getVelocity() * 0.0002); // calculate velocity from ScrollTrigger

          gsap.set(indicator, { "--progress": scrollProgress });

          if (scrollProgress <= 0.5) {
            const phase1 = scrollProgress / 0.5;
            animateBlock(splitInstances[0], splitInstances[1], phase1);
          } else {
            const phase2 = (scrollProgress - 0.5) / 0.5;
            gsap.set(splitInstances[0].words, { yPercent: 100 });
            animateBlock(splitInstances[1], splitInstances[2], phase2);
          }
        },
      });

      return () => {
        gsap.ticker.remove(tickerFunction);
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="testimonials-section">
      <div className="container">
        <section className="hero">
          <nav>
            <p>/ CG191125</p>
            <p>Experiment_507</p>
          </nav>

          <div className="about-copy">
            <div className="copy-block">
              <p>
                I work in portrait photography with a focus on light, tone, and
                quiet expression. My approach is patient and intentional.
              </p>
            </div>
            <div className="copy-block">
              <p>
                I try to build images that feel honest, with enough breathing room
                for personality to settle into the frame.
              </p>
            </div>
            <div className="copy-block">
              <p>
                The final images aim to capture the shift between who they are and
                become the moment the shutter falls still.
              </p>
            </div>
          </div>

          <div className="marquee">
            <div className="marquee-track">
              <div className="marquee-item"><img src="/assets/testimonials/img_1.jpg" alt="" /></div>
              <div className="marquee-item"><img src="/assets/testimonials/img_2.jpg" alt="" /></div>
              <div className="marquee-item"><img src="/assets/testimonials/img_3.jpg" alt="" /></div>
              <div className="marquee-item"><img src="/assets/testimonials/img_4.jpg" alt="" /></div>
              <div className="marquee-item"><img src="/assets/testimonials/img_5.jpg" alt="" /></div>
              <div className="marquee-item"><img src="/assets/testimonials/img_6.jpg" alt="" /></div>
              <div className="marquee-item"><img src="/assets/testimonials/img_7.jpg" alt="" /></div>
              <div className="marquee-item"><img src="/assets/testimonials/img_8.jpg" alt="" /></div>
              <div className="marquee-item"><img src="/assets/testimonials/img_9.jpg" alt="" /></div>
              <div className="marquee-item"><img src="/assets/testimonials/img_10.jpg" alt="" /></div>
            </div>
          </div>

          <div className="scroll-indicator"></div>
        </section>
      </div>
    </div>
  );
}
