"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./Hackathons2.css";

export default function Hackathons2() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const DESKTOP_MIN = 1000;
      const TILT_MAX = 20;
      const DRIFT_MAX = 25;
      const SMOOTHING = 0.075;

      const CARD_OPEN = { width: "18rem", height: "14rem", borderRadius: "0.4rem" };
      const CARD_DOT = { width: "0.4em", height: "0.4em", borderRadius: "0.04em" };

      const CARD_CENTERED = {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        xPercent: -50,
        yPercent: -50,
      };

      const isDesktop = () => window.innerWidth >= DESKTOP_MIN;

      const spots = containerRef.current.querySelectorAll(".spot");

      spots.forEach((spot) => {
        const card = spot.querySelector(".spot-card");
        const image = spot.querySelector("img");

        const live = { x: 0, y: 0, tiltX: 0, tiltY: 0 };
        const aim = { x: 0, y: 0, tiltX: 0, tiltY: 0 };

        let isHovering = false;
        let frame = null;

        const startTracking = () => {
          frame = () => {
            live.x += (aim.x - live.x) * SMOOTHING;
            live.y += (aim.y - live.y) * SMOOTHING;

            live.tiltX += (aim.tiltX - live.tiltX) * SMOOTHING;
            live.tiltY += (aim.tiltY - live.tiltY) * SMOOTHING;

            gsap.set(card, {
              x: live.x,
              y: live.y,
              rotateX: live.tiltX,
              rotateY: live.tiltY,
            });

            gsap.set(image, { x: -live.x, y: -live.y });
          };

          gsap.ticker.add(frame);
        };

        const stopTracking = () => {
          if (frame) {
            gsap.ticker.remove(frame);
            frame = null;
          }
        };

        const expandCard = () => {
          if (!isDesktop()) return;

          isHovering = true;

          Object.assign(live, { x: 0, y: 0, tiltX: 0, tiltY: 0 });
          Object.assign(aim, { x: 0, y: 0, tiltX: 0, tiltY: 0 });

          gsap.set(card, CARD_CENTERED);
          gsap.set(image, { x: 0, y: 0 });

          startTracking();

          gsap.to(card, {
            ...CARD_OPEN,
            duration: 0.75,
            ease: "power3.out",
            overwrite: "auto",
          });

          gsap.to(image, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const aimAtCursor = (event) => {
          if (!isHovering || !isDesktop()) return;

          const bounds = spot.getBoundingClientRect();
          const centerX = bounds.left + bounds.width / 2;
          const centerY = bounds.top + bounds.height / 2;

          let offsetX = event.clientX - centerX;
          let offsetY = event.clientY - centerY;

          const distance = Math.hypot(offsetX, offsetY);

          if (distance > DRIFT_MAX) {
            const scale = DRIFT_MAX / distance;
            offsetX *= scale;
            offsetY *= scale;
          }

          aim.x = offsetX;
          aim.y = offsetY;

          const cardBounds = card.getBoundingClientRect();
          const ratioX = (event.clientX - centerX) / (cardBounds.width / 2);
          const ratioY = (event.clientY - centerY) / (cardBounds.height / 2);

          const clamp = (value) => Math.max(-1, Math.min(1, value));

          aim.tiltY = clamp(ratioX) * -TILT_MAX;
          aim.tiltX = clamp(ratioY) * TILT_MAX;
        };

        const shrinkCard = () => {
          if (!isDesktop()) return;

          isHovering = false;
          aim.tiltX = aim.tiltY = 0;

          stopTracking();

          gsap.to(card, {
            ...CARD_DOT,
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
            onComplete: () => {
              if (isHovering) return;

              gsap.set(card, {
                clearProps: "width,height,borderRadius",
                ...CARD_CENTERED,
              });

              gsap.set(image, { x: 0, y: 0 });
            },
          });

          gsap.to(image, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            overwrite: "auto",
          });
        };

        spot.addEventListener("mouseenter", expandCard);
        spot.addEventListener("mousemove", aimAtCursor);
        spot.addEventListener("mouseleave", shrinkCard);

        // cleanup listener mappings
        spot._cleanup = () => {
          spot.removeEventListener("mouseenter", expandCard);
          spot.removeEventListener("mousemove", aimAtCursor);
          spot.removeEventListener("mouseleave", shrinkCard);
          stopTracking();
        };
      });

      return () => {
        spots.forEach((spot) => {
          if (spot._cleanup) {
            spot._cleanup();
          }
        });
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="hackathons2-section">
      <section className="spotlight">
        <h2 className="headline">
          <span className="line">We frame the</span>

          <span className="line">
            <span className="word">Worlds</span>
            <span className="spot">
              <span className="spot-card">
                <img src="/assets/hackathons2/img1.jpg" alt="" />
              </span>
            </span>
            <span className="word">reality</span>
          </span>

          <span className="line">Was too</span>

          <span className="line">
            <span className="word">Small</span>
            <span className="spot">
              <span className="spot-card">
                <img src="/assets/hackathons2/img2.jpg" alt="" />
              </span>
            </span>
            <span className="word">to</span>
          </span>

          <span className="line">Ever hold</span>

          <span className="line">
            <span className="word">On</span>
            <span className="spot">
              <span className="spot-card">
                <img src="/assets/hackathons2/img3.jpg" alt="" />
              </span>
            </span>
            <span className="word">to</span>
          </span>
        </h2>
      </section>
    </div>
  );
}
