"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./Achievements.css";

export default function Achievements() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const sections = containerRef.current.querySelectorAll("section");
      const pinTriggers = [];

      sections.forEach((section, index) => {
        const innerContainer = section.querySelector(".container");
        if (!innerContainer) return;

        gsap.fromTo(
          innerContainer,
          {
            rotation: 30,
            transformOrigin: "bottom left",
          },
          {
            rotation: 0,
            transformOrigin: "bottom left",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 20%",
              scrub: 1.2,
            },
          }
        );

        // Inner Image Parallax (Cards 2, 3, & 4):
        // Scale 1.15 with subtle vertical counter-drift as the card rotates into place
        const img = section.querySelector(".img img");
        if (img) {
          gsap.fromTo(
            img,
            {
              scale: 1.15,
              yPercent: 12,
            },
            {
              scale: 1.15,
              yPercent: -12,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }

        // Deck depth stacking: stays fully bright & normal size until next card is halfway up (top 50%)
        // Then smoothly scales to 0.95 and softly dims to 0.90 as next card finishes covering it
        if (index < sections.length - 1) {
          const nextSection = sections[index + 1];

          gsap.fromTo(
            innerContainer,
            {
              scale: 1,
              filter: "brightness(1)",
              transformOrigin: "center center",
            },
            {
              scale: 0.95,
              filter: "brightness(0.90)",
              transformOrigin: "center center",
              ease: "none",
              scrollTrigger: {
                trigger: nextSection,
                start: "top 50%",
                end: "top top",
                scrub: 1.2,
              },
            }
          );
        }

        if (index === sections.length - 1) return;

        const pin = ScrollTrigger.create({
          trigger: section,
          start: "bottom bottom",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        });

        pinTriggers.push(pin);
      });

      // Recalculate triggers after previous layout sections settle
      ScrollTrigger.refresh();
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => {
        clearTimeout(refreshTimer);
        pinTriggers.forEach((p) => p.kill());
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="hackathons1-section">
      <section className="one">
        <div className="container">
          <div className="col">
            <h1>Entry Point</h1>
          </div>

          <div className="col">
            <p>
              This space introduces an initial idea without defining its outcome.
              Forms exist in a state of balance, shaped by intention rather than
              urgency. Nothing here demands resolution yet, allowing
              interpretation, contrast, and continuity to emerge naturally over
              time.
            </p>
          </div>
        </div>
      </section>

      <section className="two">
        <div className="container">
          <div className="col">
            <div className="img">
              <img src="/assets/hackathons1/img2.jpg" alt="" />
            </div>
          </div>

          <div className="col">
            <h1>Gesture</h1>
            <p>
              Form and expression intersect without explanation. The subject
              exists between motion and stillness, marked by attitude rather than
              intent. What matters here is presence, silhouette, and the subtle
              tension created through contrast and placement.
            </p>
          </div>
        </div>
      </section>

      <section className="three">
        <div className="container">
          <div className="col">
            <h1>Variation</h1>
            <p>
              This section explores difference through placement and proportion.
              Repetition is avoided in favor of subtle change, where form,
              spacing, and color work together to maintain cohesion without
              uniformity.
            </p>
          </div>

          <div className="col">
            <div className="img">
              <img src="/assets/hackathons1/img1.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="four">
        <div className="container">
          <div className="img">
            <img src="/assets/hackathons1/img3.jpg" alt="" />
          </div>

          <h1>The Stance</h1>

          <p>
            A clearer position begins to take shape. Elements feel grounded,
            deliberate, and visually assured. Rather than drifting, the
            composition asserts itself through proportion, contrast, and a
            controlled sense of weight.
          </p>

          <p>
            The layout favors stability over motion, offering a moment of visual
            certainty. Everything appears placed with purpose, allowing the
            section to feel complete without closing off interpretation.
          </p>
        </div>
      </section>

      <section className="five">
        <div className="container">
          <div className="col">
            <h1>Stillness</h1>
          </div>

          <div className="col">
            <p>
              This space holds without interruption. Nothing shifts unnecessarily,
              allowing form and color to remain uninterrupted. The emphasis rests
              on calm presence, where simplicity and restraint shape the
              experience without demanding attention.
            </p>
          </div>
        </div>
      </section>

      <section className="six">
        <div className="container">
          <div className="col">
            <h1>Release</h1>
          </div>

          <div className="col">
            <p>
              The composition loosens its grip and allows space to dominate.
              Elements soften, contrast fades, and structure becomes secondary.
              What remains is a sense of openness, where the experience settles
              without urgency or demand.
            </p>
          </div>
        </div>
      </section>


    </div>
  );
}
