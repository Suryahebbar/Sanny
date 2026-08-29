"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./Skills.css";

export default function Skills() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const cardContainer = containerRef.current.querySelector(".card-container");
      const stickyHeader = containerRef.current.querySelector(".sticky-header h1");
      let isGapAnimationCompleted = false;
      let isFlipAnimationCompleted = false;

      function initAnimations() {
        ScrollTrigger.getAll().forEach((trigger) => {
          // kill only triggers related to skills
          if (trigger.vars.trigger === ".sticky" || trigger.vars.trigger === containerRef.current.querySelector(".sticky")) {
            trigger.kill();
          }
        });

        const mm = gsap.matchMedia();

        mm.add("(max-width: 999px)", () => {
          if (cardContainer && stickyHeader) {
            const cards = containerRef.current.querySelectorAll(".card");
            cards.forEach((el) => (el.style = ""));
            cardContainer.style = "";
            stickyHeader.style = "";
          }
          return {};
        });

        mm.add("(min-width: 1000px)", () => {
          ScrollTrigger.create({
            trigger: containerRef.current.querySelector(".sticky"),
            start: "top top",
            end: `+=${window.innerHeight * 4}px`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
              const progress = self.progress;

              if (progress >= 0.1 && progress <= 0.25) {
                const headerProgress = gsap.utils.mapRange(0.1, 0.25, 0, 1, progress);
                const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
                const opacityValue = gsap.utils.mapRange(0, 1, 0, 1, headerProgress);

                gsap.set(stickyHeader, {
                  y: yValue,
                  opacity: opacityValue,
                });
              } else if (progress < 0.1) {
                gsap.set(stickyHeader, {
                  y: 40,
                  opacity: 0,
                });
              } else if (progress > 0.25) {
                gsap.set(stickyHeader, {
                  y: 0,
                  opacity: 1,
                });
              }

              if (progress <= 0.25) {
                const widthPercentage = gsap.utils.mapRange(0, 0.25, 75, 60, progress);
                gsap.set(cardContainer, { width: `${widthPercentage}%` });
              } else {
                gsap.set(cardContainer, { width: "60%" });
              }

              if (progress >= 0.35 && !isGapAnimationCompleted) {
                gsap.to(cardContainer, {
                  gap: "20px",
                  duration: 0.5,
                  ease: "power3.out",
                });

                gsap.to(containerRef.current.querySelectorAll(".card"), {
                  borderRadius: "20px",
                  duration: 0.5,
                  ease: "power3.out",
                });

                isGapAnimationCompleted = true;
              } else if (progress < 0.35 && isGapAnimationCompleted) {
                gsap.to(cardContainer, {
                  gap: "0px",
                  duration: 0.5,
                  ease: "power3.out",
                });

                gsap.to(containerRef.current.querySelector("#card-1"), {
                  borderRadius: "20px 0 0 20px",
                  duration: 0.5,
                  ease: "power3.out",
                });

                gsap.to(containerRef.current.querySelector("#card-2"), {
                  borderRadius: "0px",
                  duration: 0.5,
                  ease: "power3.out",
                });

                gsap.to(containerRef.current.querySelector("#card-3"), {
                  borderRadius: "0 20px 20px 0",
                  duration: 0.5,
                  ease: "power3.out",
                });

                isGapAnimationCompleted = false;
              }

              if (progress >= 0.7 && !isFlipAnimationCompleted) {
                gsap.to(containerRef.current.querySelectorAll(".card"), {
                  rotationY: 180,
                  duration: 0.75,
                  ease: "power3.inOut",
                  stagger: 0.1,
                });

                gsap.to(
                  [
                    containerRef.current.querySelector("#card-1"),
                    containerRef.current.querySelector("#card-3"),
                  ],
                  {
                    y: 30,
                    rotationZ: (i) => [-15, 15][i],
                    duration: 0.75,
                    ease: "power3.inOut",
                  }
                );

                isFlipAnimationCompleted = true;
              } else if (progress < 0.7 && isFlipAnimationCompleted) {
                gsap.to(containerRef.current.querySelectorAll(".card"), {
                  rotationY: 0,
                  duration: 0.75,
                  ease: "power3.inOut",
                  stagger: -0.1,
                });

                gsap.to(
                  [
                    containerRef.current.querySelector("#card-1"),
                    containerRef.current.querySelector("#card-3"),
                  ],
                  {
                    y: 0,
                    rotationZ: 0,
                    duration: 0.75,
                    ease: "power3.inOut",
                  }
                );

                isFlipAnimationCompleted = false;
              }
            },
          });
          return () => {};
        });
      }

      initAnimations();

      let resizeTimer;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          initAnimations();
        }, 250);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="skills-section">
      <section className="intro">
        <h1>Every idea begins as a single image</h1>
      </section>

      <section className="sticky">
        <div className="sticky-header">
          <h1>Three pillars with one purpose</h1>
        </div>

        <div className="card-container">
          <div className="card" id="card-1">
            <div className="card-front">
              <img src="/assets/skills/card_cover_1.jpg" alt="" />
            </div>
            <div className="card-back">
              <span>( 01 )</span>
              <p>Interactive Web Experiences</p>
            </div>
          </div>

          <div className="card" id="card-2">
            <div className="card-front">
              <img src="/assets/skills/card_cover_2.jpg" alt="" />
            </div>
            <div className="card-back">
              <span>( 02 )</span>
              <p>Thoughtful Design Language</p>
            </div>
          </div>

          <div className="card" id="card-3">
            <div className="card-front">
              <img src="/assets/skills/card_cover_3.jpg" alt="" />
            </div>
            <div className="card-back">
              <span>( 03 )</span>
              <p>Visual Design Systems</p>
            </div>
          </div>
        </div>
      </section>

      <section className="outro">
        <h1>Every transition leaves a trace</h1>
      </section>
    </div>
  );
}
