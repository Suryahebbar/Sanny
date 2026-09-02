"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./Experience.css";

export default function Experience() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const horizontalScroll = containerRef.current.querySelector(
        ".horizontal-scroll"
      );
      const wrapper = containerRef.current.querySelector(
        ".horizontal-scroll-wrapper"
      );

      gsap.to(wrapper, {
        xPercent: -66.666,
        ease: "none",
        scrollTrigger: {
          trigger: horizontalScroll,
          start: "top top",
          end: () => `+=${window.innerHeight * 3}`,
          pin: true,
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="experience-section">
      <div className="container">
        <section className="horizontal-scroll">
          <div className="horizontal-scroll-wrapper">
            <div className="horizontal-slide">
              <div className="col img-col">
                <img
                  src="/assets/experience/img-7.jpg"
                  alt="Experience visual"
                />
              </div>
              <div className="col text-col">
                <h3>
                  A landscape in constant transition, where every shape, sound,
                  and shadow refuses to stay still. What seems stable begins to
                  dissolve, and what fades returns again in a new form.
                </h3>
              </div>
            </div>

            <div className="horizontal-slide">
              <div className="col img-col">
                <img
                  src="/assets/experience/slide-1.jpg"
                  alt="Experience visual"
                />
              </div>
              <div className="col text-col">
                <h3>
                  The rhythm of motion carries us forward into spaces that feel
                  familiar yet remain undefined. Each shift is subtle, yet
                  together they remind us that nothing we see is ever permanent.
                </h3>
              </div>
            </div>

            <div className="horizontal-slide">
              <div className="col img-col">
                <img
                  src="/assets/experience/slide-2.jpg"
                  alt="Experience visual"
                />
              </div>
              <div className="col text-col">
                <h3>
                  Shadows fold into light. Shapes shift across the frame,
                  reminding us that stillness is only temporary.
                </h3>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
