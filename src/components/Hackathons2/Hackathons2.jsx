"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./Hackathons2.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hackathons2() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      // 5. Scroll-Triggered Masked Line Reveal
      const lineMasks = containerRef.current.querySelectorAll(".line-mask");
      const lines = containerRef.current.querySelectorAll(".line");

      gsap.fromTo(
        lines,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current.querySelector(".spotlight"),
            start: "top 75%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              gsap.set(lineMasks, { overflow: "hidden" });
            },
            onLeaveBack: () => {
              gsap.set(lineMasks, { overflow: "hidden" });
            },
          },
          onComplete: () => {
            gsap.set(lineMasks, { overflow: "visible" });
            gsap.set(lines, { clearProps: "yPercent,opacity" });
          },
          onReverseComplete: () => {
            gsap.set(lineMasks, { overflow: "hidden" });
          },
        }
      );

      const DESKTOP_MIN = 640;
      const TILT_MAX = 20;
      const DRIFT_MAX = 25;
      const SMOOTHING = 0.075;

      const CARD_OPEN = { width: "18rem", height: "13.5rem", borderRadius: "0.4rem" };
      const CARD_DOT = { width: "0.38em", height: "0.38em", borderRadius: "0.04em" };

      const CARD_CENTERED = {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        xPercent: -50,
        yPercent: -50,
      };

      const isDesktop = () => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(hover: hover)").matches || window.innerWidth >= DESKTOP_MIN;
      };

      const spots = containerRef.current.querySelectorAll(".spot");

      spots.forEach((spot, index) => {
        const card = spot.querySelector(".spot-card");
        const image = spot.querySelector("img");
        const glare = spot.querySelector(".spot-glare");

        const live = { x: 0, y: 0, tiltX: 0, tiltY: 0 };
        const aim = { x: 0, y: 0, tiltX: 0, tiltY: 0 };

        let isHovering = false;
        let frame = null;

        // Ambient idle breathing pulse for interactive portal cue
        const pulseTween = gsap.to(spot, {
          scale: 1.15,
          duration: 1.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.35, // staggered rhythm between dots
        });

        const startTracking = () => {
          stopTracking();
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

            gsap.set(image, { x: -live.x, y: -live.y, scale: 1.5 });

            if (glare) {
              const glareX = 50 + (live.tiltY / TILT_MAX) * 42;
              const glareY = 50 - (live.tiltX / TILT_MAX) * 42;
              glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0.12) 35%, rgba(255, 255, 255, 0) 70%)`;
            }
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

          // Instantly lock ambient breathing pulse to 1.0 on hover
          pulseTween.pause();
          gsap.to(spot, { scale: 1, duration: 0.15, overwrite: "auto" });

          Object.assign(live, { x: 0, y: 0, tiltX: 0, tiltY: 0 });
          Object.assign(aim, { x: 0, y: 0, tiltX: 0, tiltY: 0 });

          gsap.set(card, CARD_CENTERED);
          gsap.set(image, { x: 0, y: 0, scale: 1.5 });

          startTracking();

          gsap.to(card, {
            ...CARD_OPEN,
            duration: 0.75,
            ease: "back.out(1.4)",
            overwrite: "auto",
          });

          gsap.to(image, {
            opacity: 1,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          });

          if (glare) {
            gsap.to(glare, {
              opacity: 1,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
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
            duration: 0.45,
            ease: "power3.inOut",
            overwrite: "auto",
            onComplete: () => {
              if (isHovering) return;

              gsap.set(card, {
                clearProps: "width,height,borderRadius",
                ...CARD_CENTERED,
              });

              gsap.set(image, { x: 0, y: 0, scale: 1.5 });

              // Resume ambient breathing pulse on idle
              pulseTween.restart();
            },
          });

          gsap.to(image, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            overwrite: "auto",
          });

          if (glare) {
            gsap.to(glare, {
              opacity: 0,
              duration: 0.25,
              ease: "power2.in",
              overwrite: "auto",
            });
          }
        };

        spot.addEventListener("mouseenter", expandCard);
        spot.addEventListener("mousemove", aimAtCursor);
        spot.addEventListener("mouseleave", shrinkCard);

        // cleanup listener mappings
        spot._cleanup = () => {
          pulseTween.kill();
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
          <span className="line-mask">
            <span className="line">WE FRAME THE</span>
          </span>

          <span className="line-mask">
            <span className="line">
              <span className="word">WORLDS</span>
              <span className="spot">
                <span className="spot-card">
                  <img src="/assets/hackathons2/img1.jpg" alt="Hackathon 1" />
                  <span className="spot-glare" />
                  <span className="spot-meta">
                    <span className="spot-meta-tag">[ 01 ]</span>
                    <span className="spot-meta-title">Smart India Hackathon</span>
                  </span>
                </span>
              </span>
              <span className="word">REALITY</span>
            </span>
          </span>

          <span className="line-mask">
            <span className="line">WAS TOO</span>
          </span>

          <span className="line-mask">
            <span className="line">
              <span className="word">SMALL</span>
              <span className="spot">
                <span className="spot-card">
                  <img src="/assets/hackathons2/img2.jpg" alt="Hackathon 2" />
                  <span className="spot-glare" />
                  <span className="spot-meta">
                    <span className="spot-meta-tag">[ 02 ]</span>
                    <span className="spot-meta-title">National Winner</span>
                  </span>
                </span>
              </span>
              <span className="word">TO</span>
            </span>
          </span>

          <span className="line-mask">
            <span className="line">EVER HOLD</span>
          </span>

          <span className="line-mask">
            <span className="line">
              <span className="word">ON</span>
              <span className="spot">
                <span className="spot-card">
                  <img src="/assets/hackathons2/img3.jpg" alt="Hackathon 3" />
                  <span className="spot-glare" />
                  <span className="spot-meta">
                    <span className="spot-meta-tag">[ 03 ]</span>
                    <span className="spot-meta-title">AI Innovation</span>
                  </span>
                </span>
              </span>
              <span className="word">TO</span>
            </span>
          </span>
        </h2>
      </section>
    </div>
  );
}
