"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./Education.css";

export default function Education() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const stickySection = containerRef.current.querySelector(".sticky");
      const stickyHeader = containerRef.current.querySelector(".sticky-header");
      const cards = containerRef.current.querySelectorAll(".card");
      const stickyHeight = window.innerHeight * 5;

      const transforms = [
        [
          [10, 50, -10, 10],
          [20, -10, -45, 20],
        ],
        [
          [0, 47.5, -10, 15],
          [-25, 15, -45, 30],
        ],
        [
          [0, 52.5, -10, 5],
          [15, -5, -40, 60],
        ],
        [
          [0, 50, 30, -80],
          [20, -10, 60, 5],
        ],
        [
          [0, 55, -15, 30],
          [25, -15, 60, 95],
        ],
      ];

      ScrollTrigger.create({
        trigger: stickySection,
        start: "top top",
        end: `+=${stickyHeight}px`,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;

          if (stickyHeader) {
            const maxTranslate = stickyHeader.offsetWidth - window.innerWidth;
            const translateX = -progress * maxTranslate;
            gsap.set(stickyHeader, { x: translateX });
          }

          cards.forEach((card, index) => {
            const delay = index * 0.1125;
            const cardProgress = Math.max(0, Math.min((progress - delay) * 2, 1));

            if (cardProgress > 0) {
              const cardStartX = 25;
              const cardEndX = -650;
              const yPos = transforms[index][0];
              const rotations = transforms[index][1];

              const cardX = gsap.utils.interpolate(
                cardStartX,
                cardEndX,
                cardProgress
              );

              const yProgress = cardProgress * 3;
              const yIndex = Math.min(Math.floor(yProgress), yPos.length - 2);
              const yInterpolation = yProgress - yIndex;
              const cardY = gsap.utils.interpolate(
                yPos[yIndex],
                yPos[yIndex + 1],
                yInterpolation
              );

              const cardRotation = gsap.utils.interpolate(
                rotations[yIndex],
                rotations[yIndex + 1],
                yInterpolation
              );

              gsap.set(card, {
                xPercent: cardX,
                yPercent: cardY,
                rotation: cardRotation,
                opacity: 1,
              });
            } else {
              gsap.set(card, { opacity: 0 });
            }
          });
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="education-section">
      <nav>
        <div className="logo">
          <a href="#">Nebulon</a>
        </div>
        <div className="nav-items">
          <a href="#">Catalog</a>
          <a href="#">Cart</a>
        </div>
      </nav>

      <section className="hero"></section>

      <section className="sticky">
        <div className="sticky-header">
          <h1>Nebulon Does it again.</h1>
        </div>

        <div className="card">
          <div className="card-img"><img src="/assets/education/img1.jpg" alt="" /></div>
          <div className="card-content">
            <div className="card-title"><h2>Immersive Training Simulations</h2></div>
            <div className="card-description">
              <p>
                Revolutionize hands-on learning with lifelike training
                environments, enhancing skill development and retention.
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-img"><img src="/assets/education/img2.jpg" alt="" /></div>
          <div className="card-content">
            <div className="card-title"><h2>Virtual Design Collaboration</h2></div>
            <div className="card-description">
              <p>
                Enable remote teams to co-create in 3D spaces, speeding up design
                iterations and boosting innovation.
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-img"><img src="/assets/education/img3.jpg" alt="" /></div>
          <div className="card-content">
            <div className="card-title"><h2>Immersive Product Demos</h2></div>
            <div className="card-description">
              <p>
                Showcase products in a fully interactive, 360-degree experience,
                making presentations more engaging and memorable.
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-img"><img src="/assets/education/img4.jpg" alt="" /></div>
          <div className="card-content">
            <div className="card-title"><h2>Remote Healthcare Solutions</h2></div>
            <div className="card-description">
              <p>
                Empower healthcare professionals with virtual consultations and
                remote diagnostics in immersive 3D environments.
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-img"><img src="/assets/education/img5.jpg" alt="" /></div>
          <div className="card-content">
            <div className="card-title"><h2>Interactive Entertainment</h2></div>
            <div className="card-description">
              <p>
                Deliver a new dimension of gaming and entertainment with fully
                immersive and interactive virtual experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="outro"><p>(Your next section goes here)</p></section>
    </div>
  );
}
