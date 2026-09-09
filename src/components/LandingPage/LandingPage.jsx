"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/all";
import { useGSAP } from "@gsap/react";
import "./LandingPage.css";

export default function LandingPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (typeof window !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  // Feature 5: Interactive Multiplane Mouse Parallax Depth
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;

    const hero = heroRef.current;
    if (!hero) return;

    let isIntroDone = false;
    const introTimer = setTimeout(() => {
      isIntroDone = true;
    }, 7500);

    const onMouseMove = (e) => {
      if (!isIntroDone) return;

      const rect = hero.getBoundingClientRect();
      const xNorm = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to +1
      const yNorm = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to +1

      // 1. Background image moves subtly in opposite direction (deepest layer)
      gsap.to(".hero-bg img", {
        x: -xNorm * 18,
        y: -yNorm * 14,
        duration: 0.9,
        ease: "power2.out",
        overwrite: "auto",
      });

      // 2. Ambient Ember Backlight floats in mid-depth layer
      gsap.to(".hero-ember-glow", {
        x: xNorm * 26,
        y: yNorm * 18,
        duration: 1.1,
        ease: "power2.out",
        overwrite: "auto",
      });

      // 3. Giant "SURYA" Headline floats in foreground layer
      gsap.to(".header h1", {
        x: xNorm * 32,
        y: yNorm * 22,
        duration: 0.7,
        ease: "power2.out",
        overwrite: "auto",
      });

      // 4. Footer tags float with subtle parallax
      gsap.to(".hero-footer", {
        x: xNorm * 14,
        y: yNorm * 8,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onMouseLeave = () => {
      if (!isIntroDone) return;

      gsap.to([".hero-bg img", ".hero-ember-glow", ".header h1", ".hero-footer"], {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1.1, 0.4)",
        overwrite: "auto",
      });
    };

    hero.addEventListener("mousemove", onMouseMove);
    hero.addEventListener("mouseleave", onMouseLeave);

    return () => {
      clearTimeout(introTimer);
      hero.removeEventListener("mousemove", onMouseMove);
      hero.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  useGSAP(
    () => {
      gsap.registerPlugin(CustomEase, SplitText);
      CustomEase.create("hop", "0.9, 0, 0.1, 1");

      const splitText = (selector, type, className) => {
        return SplitText.create(selector, {
          type: type,
          [`${type}Class`]: className,
          mask: type,
        });
      };

      const headerSplit = splitText(".header-title", "chars", "char");
      const footerSplit = splitText(".hero-footer p", "words", "word");

      // Prevent FOUC: Ensure chars/words are positioned off-screen before showing container
      gsap.set(headerSplit.chars, { x: "105%" });
      gsap.set(footerSplit.words, { y: "105%" });
      gsap.set([".header-title", ".hero-footer p"], { visibility: "visible" });

      const counterProgress = document.querySelector(".preloader-counter h1");
      const counterContainer = document.querySelector(".preloader-counter");
      const counter = { value: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
        },
      });

      // Original Timeline Pacing
      tl.to(counter, {
        value: 100,
        duration: 3,
        ease: "power3.out",

        onUpdate: () => {
          if (counterProgress) {
            counterProgress.textContent = Math.floor(counter.value);
          }
        },

        onComplete: () => {
          if (counterProgress) {
            const counterSplit = splitText(counterProgress, "chars", "digit");
            gsap.to(counterSplit.chars, {
              x: "-100%",
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.1,
              delay: 1,
              onComplete: () => {
                if (counterContainer) {
                  counterContainer.remove();
                }
              },
            });
          }
        },
      });

      tl.to(
        counterContainer,
        {
          scale: 1,
          duration: 3,
          ease: "power3.out",
        },
        "<"
      );

      tl.to(
        ".progress-bar",
        {
          scaleX: 1,
          duration: 3,
          ease: "power3.out",
        },
        "<"
      );

      tl.to(
        ".hero-bg",
        {
          clipPath: "polygon(35% 35%, 65% 35%, 65% 65%, 35% 65%)",
          duration: 1.5,
          ease: "hop",
        },
        4.5
      );

      tl.to(
        ".hero-bg img",
        {
          scale: 1.5,
          duration: 1.5,
          ease: "hop",
        },
        "<"
      );

      tl.to(
        ".hero-bg",
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 2,
          ease: "hop",
        },
        6
      );

      tl.to(
        ".hero-bg img",
        {
          scale: 1,
          duration: 2,
          ease: "hop",
        },
        6
      );

      tl.to(
        ".progress",
        {
          scaleX: 1,
          duration: 2,
          ease: "hop",
        },
        6
      );

      // Feature 3: Warm Ember Backlight bloom as scene bursts to full bleed (6.0s)
      tl.fromTo(
        ".hero-ember-glow",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 0.85,
          scale: 1,
          duration: 2,
          ease: "power2.out",
          onComplete: () => {
            const glowEl = document.querySelector(".hero-ember-glow");
            if (glowEl) glowEl.classList.add("ember-pulsing");
          },
        },
        6
      );

      tl.to(
        headerSplit.chars,
        {
          x: "0%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.075,
        },
        7
      );

      tl.to(
        footerSplit.words,
        {
          y: "0%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.075,
        },
        7.5
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="landing-page-section">
      <div className="preloader-counter">
        <h1>0</h1>
      </div>

      <section ref={heroRef} className="hero">
        <div className="hero-bg">
          <img src="/assets/landing-page/hero.jpg" alt="" />
          {/* Layer: Cinematic Obsidian Vignette */}
          <div className="hero-vignette-overlay"></div>
          {/* Layer: Subtle Film Grain Texture */}
          <div className="hero-grain-overlay"></div>
        </div>

        {/* Ambient Warm Ember Backlight behind Headline */}
        <div className="hero-ember-glow"></div>

        <div className="header">
          <h1 className="header-title">Surya</h1>
        </div>

        <div className="hero-footer">
          <p>Permanence</p>
          <p>Craftsmanship</p>
          <p>Expression</p>
        </div>

        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </section>
    </div>
  );
}
