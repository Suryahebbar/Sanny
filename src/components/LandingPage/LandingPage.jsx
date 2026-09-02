"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/all";
import { useGSAP } from "@gsap/react";
import "./LandingPage.css";

export default function LandingPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    }
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
      const navSplit = splitText(".landing-nav a", "words", "word");
      const footerSplit = splitText(".hero-footer p", "words", "word");

      const counterProgress = document.querySelector(".preloader-counter h1");
      const counterContainer = document.querySelector(".preloader-counter");
      const counter = { value: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
        },
      });

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

      tl.to(
        ".header-title .char",
        {
          x: "0%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.075,
        },
        7
      );

      tl.to(
        ".landing-nav a .word",
        {
          y: "0%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.075,
        },
        7.5
      );

      tl.to(
        ".hero-footer p .word",
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

      <nav className="landing-nav">
        <div className="nav-logo">
          <a href="#">Surya</a>
        </div>
        <div className="nav-links">
          <a href="#">Index</a>
          <a href="#">Collection</a>
          <a href="#">Material</a>
          <a href="#">Process</a>
          <a href="#">Info</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg">
          <img src="/assets/landing-page/hero.jpg" alt="" />
        </div>

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
