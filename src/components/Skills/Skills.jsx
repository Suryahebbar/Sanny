"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import "./Skills.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const MARQUEE_ITEMS = [
  { img: "/assets/testimonials/img_1.jpg", tag: "PORTRAIT // 01", name: "Elena Rostova" },
  { img: "/assets/testimonials/img_2.jpg", tag: "EDITORIAL // 02", name: "Marcus Vance" },
  { img: "/assets/testimonials/img_3.jpg", tag: "STUDIO // 03", name: "Koto Creative" },
  { img: "/assets/testimonials/img_4.jpg", tag: "EXHIBIT // 04", name: "Amara Chen" },
  { img: "/assets/testimonials/img_5.jpg", tag: "DOCUMENTARY // 05", name: "Soren Lindqvist" },
  { img: "/assets/testimonials/img_6.jpg", tag: "IDENTITY // 06", name: "Aura Media" },
  { img: "/assets/testimonials/img_7.jpg", tag: "PERSPECTIVE // 07", name: "Devon Blake" },
  { img: "/assets/testimonials/img_8.jpg", tag: "CAPTURE // 08", name: "Nova Collective" },
  { img: "/assets/testimonials/img_9.jpg", tag: "LIGHTING // 09", name: "Kai Takahashi" },
  { img: "/assets/testimonials/img_10.jpg", tag: "ARCHIVE // 10", name: "Miriam Mansoor" },
];

export default function Skills() {
  const containerRef = useRef(null);
  const velocityRef = useRef(0);

  // Hook into root Lenis instance to drive marquee scroll velocity identical to original
  useLenis((lenis) => {
    if (lenis && typeof lenis.velocity === "number") {
      velocityRef.current = Math.abs(lenis.velocity) * 0.02;
    }
  });

  useGSAP(
    () => {
      /* ======================================================================
         1. Skills Cards Animations (Identical mechanics, blank screens removed)
         ====================================================================== */
      const cardContainer = containerRef.current.querySelector(".card-container");
      const stickyHeader = containerRef.current.querySelector(".sticky-header h1");
      const ambientGlow = containerRef.current.querySelector(".ambient-glow");
      let isGapAnimationCompleted = false;
      let isFlipAnimationCompleted = false;

      function initSkillsCards() {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (
            trigger.vars.trigger === ".sticky" ||
            trigger.vars.trigger === containerRef.current?.querySelector(".sticky")
          ) {
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
          if (ambientGlow) ambientGlow.style = "";
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
              } else if (progress > 0.25 && progress < 0.85) {
                gsap.set(stickyHeader, {
                  y: 0,
                  opacity: 1,
                });
              } else if (progress >= 0.85) {
                const exitProgress = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.85, 0.98, 0, 1, progress));
                const exitY = gsap.utils.mapRange(0, 1, 0, -30, exitProgress);
                const exitOpacity = gsap.utils.mapRange(0, 1, 1, 0, exitProgress);
                gsap.set(stickyHeader, {
                  y: exitY,
                  opacity: exitOpacity,
                });
              }

              // Ambient Atmospheric Glow behind center red card
              if (ambientGlow) {
                if (progress < 0.6) {
                  const p = gsap.utils.mapRange(0, 0.6, 0.75, 1.0, progress);
                  gsap.set(ambientGlow, {
                    scale: p,
                    opacity: gsap.utils.mapRange(0, 0.6, 0.08, 0.14, progress),
                  });
                } else if (progress >= 0.6 && progress < 0.85) {
                  const p = gsap.utils.mapRange(0.6, 0.85, 0, 1, progress);
                  gsap.set(ambientGlow, {
                    scale: gsap.utils.mapRange(0, 1, 1.0, 1.45, p),
                    opacity: gsap.utils.mapRange(0, 1, 0.14, 0.24, p),
                  });
                } else if (progress >= 0.85) {
                  const p = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.85, 1.0, 0, 1, progress));
                  gsap.set(ambientGlow, {
                    scale: gsap.utils.mapRange(0, 1, 1.45, 1.6, p),
                    opacity: gsap.utils.mapRange(0, 1, 0.24, 0.04, p),
                  });
                }
              }

              if (progress <= 0.25) {
                const widthPercentage = gsap.utils.mapRange(0, 0.25, 75, 60, progress);
                gsap.set(cardContainer, { width: `${widthPercentage}%` });
              } else {
                gsap.set(cardContainer, { width: "60%" });
              }

              // Seamless bridge transition: floating backwards with depth (scale: 0.92, blur: 4px)
              if (progress >= 0.85) {
                const bridgeProgress = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.85, 1.0, 0, 1, progress));
                const bridgeScale = gsap.utils.mapRange(0, 1, 1, 0.92, bridgeProgress);
                const bridgeBlur = gsap.utils.mapRange(0, 1, 0, 4, bridgeProgress);
                const bridgeOpacity = gsap.utils.mapRange(0, 1, 1, 0.45, bridgeProgress);
                const bridgeY = gsap.utils.mapRange(0, 1, 40, 15, bridgeProgress);

                gsap.set(cardContainer, {
                  scale: bridgeScale,
                  filter: `blur(${bridgeBlur}px)`,
                  opacity: bridgeOpacity,
                  y: bridgeY,
                });
              } else {
                gsap.set(cardContainer, {
                  scale: 1,
                  filter: "blur(0px)",
                  opacity: 1,
                  y: 40,
                });
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

                gsap.to(containerRef.current.querySelectorAll(".card-back"), {
                  "--tilt-x": "0deg",
                  "--tilt-y": "0deg",
                  "--sheen-opacity": 0,
                  duration: 0.4,
                  ease: "power2.out",
                });

                isFlipAnimationCompleted = false;
              }
            },
          });
          return () => { };
        });
      }

      initSkillsCards();

      let resizeTimer;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          initSkillsCards();
        }, 250);
      };
      window.addEventListener("resize", handleResize);

      /* ======================================================================
         2. Testimonials Animations (Identical mechanics: SplitText + Marquee)
         ====================================================================== */
      const hero = containerRef.current.querySelector(".hero");
      const testimonialsContainer = containerRef.current.querySelector(
        ".testimonials-wrapper .container"
      );
      const indicator = containerRef.current.querySelector(".scroll-indicator");
      const marqueeTrack = containerRef.current.querySelector(".marquee-track");
      const textBlocks = gsap.utils.toArray(
        containerRef.current.querySelectorAll(".copy-block p")
      );

      // Split text into words with individual masks
      const createFallbackWordMask = (block) => {
        const text = block.innerText.trim();
        block.innerHTML = "";
        const words = text.split(/\s+/);
        const wordSpans = [];
        words.forEach((w) => {
          const mask = document.createElement("span");
          mask.className = "word-mask";
          const word = document.createElement("span");
          word.className = "word";
          word.textContent = w;
          mask.appendChild(word);
          block.appendChild(mask);
          wordSpans.push(word);
        });
        return {
          words: wordSpans,
          revert: () => {
            block.innerText = text;
          },
        };
      };

      const splitInstances = textBlocks.map((block) => {
        try {
          return SplitText.create(block, {
            type: "words",
            mask: "words",
            wordsClass: "word",
          });
        } catch (e) {
          return createFallbackWordMask(block);
        }
      });

      // Initial state: Block 1 visible, Blocks 2 and 3 hidden
      if (splitInstances[0]?.words) gsap.set(splitInstances[0].words, { yPercent: 0 });
      if (splitInstances[1]?.words) gsap.set(splitInstances[1].words, { yPercent: 100 });
      if (splitInstances[2]?.words) gsap.set(splitInstances[2].words, { yPercent: 100 });

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

      // Clone marquee items once for seamless continuous loop
      const items = gsap.utils.toArray(
        containerRef.current.querySelectorAll(".marquee-item")
      );
      if (marqueeTrack && items.length === 10) {
        items.forEach((item) => marqueeTrack.appendChild(item.cloneNode(true)));
      }

      let marqueePosition = 0;
      let smoothVelocity = 0;
      let targetVelocity = 0;
      let isMarqueeHovered = false;
      let currentBaseSpeed = 0.45;

      const marqueeEl = containerRef.current.querySelector(".marquee");
      const handleMarqueeEnter = () => {
        isMarqueeHovered = true;
      };
      const handleMarqueeLeave = () => {
        isMarqueeHovered = false;
      };

      if (marqueeEl) {
        marqueeEl.addEventListener("mouseenter", handleMarqueeEnter);
        marqueeEl.addEventListener("mouseleave", handleMarqueeLeave);
      }

      const tickerFunction = () => {
        if (velocityRef.current > 0) {
          targetVelocity = Math.max(targetVelocity, velocityRef.current);
          velocityRef.current = 0;
        }

        smoothVelocity += (targetVelocity - smoothVelocity) * 0.5;

        // Smooth 70% deceleration when hovered (friction feel)
        const targetBaseSpeed = isMarqueeHovered ? 0.135 : 0.45;
        currentBaseSpeed += (targetBaseSpeed - currentBaseSpeed) * 0.08;

        const speed = currentBaseSpeed + smoothVelocity * 9;

        marqueePosition -= speed;

        if (marqueeTrack) {
          const trackWidth = marqueeTrack.scrollWidth / 2;
          if (trackWidth > 0 && marqueePosition <= -trackWidth) {
            marqueePosition = 0;
          }
          gsap.set(marqueeTrack, { x: marqueePosition });
        }

        targetVelocity *= 0.9;
      };

      gsap.ticker.add(tickerFunction);

      // GSAP ScrollTrigger pinning & phase text progression
      const testimonialsST = ScrollTrigger.create({
        trigger: testimonialsContainer,
        start: "top top",
        end: "bottom bottom",
        pin: hero,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: (self) => {
          const scrollProgress = self.progress;

          // ScrollTrigger velocity fallback if needed
          if (typeof self.getVelocity === "function") {
            const scrollVel = Math.abs(self.getVelocity()) * 0.002;
            if (scrollVel > targetVelocity) {
              targetVelocity = Math.min(scrollVel, 8);
            }
          }

          gsap.set(indicator, { "--progress": scrollProgress });

          if (scrollProgress <= 0.5) {
            const phase1 = scrollProgress / 0.5;
            animateBlock(splitInstances[0], splitInstances[1], phase1);
            gsap.set(splitInstances[2].words, { yPercent: 100 });
          } else {
            const phase2 = (scrollProgress - 0.5) / 0.5;
            gsap.set(splitInstances[0].words, { yPercent: 100 });
            animateBlock(splitInstances[1], splitInstances[2], phase2);
          }
        },
      });

      const testimonialsNav = containerRef.current.querySelector(".testimonials-nav");
      const aboutCopy = containerRef.current.querySelector(".about-copy");
      const marquee = containerRef.current.querySelector(".marquee");

      // Seamless bridge entrance as testimonials approaches viewport
      const mmTestimonials = gsap.matchMedia();

      mmTestimonials.add("(min-width: 1000px)", () => {
        if (testimonialsNav) gsap.set(testimonialsNav, { opacity: 0, y: -25 });
        if (marquee) gsap.set(marquee, { opacity: 0, y: 35 });
        if (indicator) gsap.set(indicator, { opacity: 0 });
        if (aboutCopy) gsap.set(aboutCopy, { opacity: 0 });

        const bridgeEntranceST = ScrollTrigger.create({
          trigger: testimonialsContainer,
          start: "top 95%",
          end: "top top",
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (testimonialsNav) {
              gsap.set(testimonialsNav, {
                y: gsap.utils.mapRange(0, 1, -25, 0, p),
                opacity: gsap.utils.mapRange(0, 1, 0, 1, p),
              });
            }
            if (marquee) {
              gsap.set(marquee, {
                y: gsap.utils.mapRange(0, 1, 35, 0, p),
                opacity: gsap.utils.mapRange(0, 1, 0, 1, p),
              });
            }
            if (indicator) {
              gsap.set(indicator, {
                opacity: gsap.utils.mapRange(0, 1, 0, 1, p),
              });
            }
            if (aboutCopy) {
              gsap.set(aboutCopy, {
                opacity: gsap.utils.mapRange(0, 1, 0, 1, p),
              });
            }
          },
        });

        return () => {
          if (bridgeEntranceST) bridgeEntranceST.kill();
        };
      });

      mmTestimonials.add("(max-width: 999px)", () => {
        if (testimonialsNav) testimonialsNav.style = "";
        if (marquee) marquee.style = "";
        if (indicator) indicator.style = "";
        if (aboutCopy) aboutCopy.style = "";
        return {};
      });

      // 3. Interactive 3D Cursor Tilt & Specular Sheen on Flipped Cards
      const cards = containerRef.current.querySelectorAll(".card");
      const cardCleanups = [];

      cards.forEach((card) => {
        const cardBack = card.querySelector(".card-back");
        if (!cardBack) return;

        const handleMouseMove = (e) => {
          if (!isFlipAnimationCompleted) return;

          const rect = card.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          const xPercent = (mouseX / rect.width) * 100;
          const yPercent = (mouseY / rect.height) * 100;

          const normX = mouseX / rect.width - 0.5; // -0.5 to 0.5
          const normY = mouseY / rect.height - 0.5; // -0.5 to 0.5

          const maxTilt = 14;
          const tiltX = -normY * maxTilt;
          const tiltY = normX * maxTilt;

          gsap.to(cardBack, {
            "--tilt-x": `${tiltX}deg`,
            "--tilt-y": `${tiltY}deg`,
            "--sheen-x": `${xPercent}%`,
            "--sheen-y": `${yPercent}%`,
            "--sheen-opacity": 1,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const handleMouseEnter = () => {
          if (!isFlipAnimationCompleted) return;
          gsap.to(cardBack, {
            "--sheen-opacity": 1,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(cardBack, {
            "--tilt-x": "0deg",
            "--tilt-y": "0deg",
            "--sheen-opacity": 0,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);

        cardCleanups.push(() => {
          card.removeEventListener("mousemove", handleMouseMove);
          card.removeEventListener("mouseenter", handleMouseEnter);
          card.removeEventListener("mouseleave", handleMouseLeave);
        });
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        cardCleanups.forEach((fn) => fn());
        if (marqueeEl) {
          marqueeEl.removeEventListener("mouseenter", handleMarqueeEnter);
          marqueeEl.removeEventListener("mouseleave", handleMarqueeLeave);
        }
        gsap.ticker.remove(tickerFunction);
        if (testimonialsST) testimonialsST.kill();
        mmTestimonials.revert();
        splitInstances.forEach((inst) => {
          if (inst && typeof inst.revert === "function") inst.revert();
        });
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="skills-section">
      {/* 1. Three Pillars 3D Cards */}
      <section className="sticky">
        <div className="ambient-glow"></div>
        <div className="sticky-header">
          <h1>Three pillars with one purpose</h1>
        </div>

        <div className="card-container">
          <div className="card" id="card-1">
            <div className="card-front">
              <img src="/assets/skills/card_cover_1.jpg" alt="" />
            </div>
            <div className="card-back">
              <div className="card-glare"></div>
              <div className="card-sheen"></div>
              <div className="card-header-meta">
                <span className="card-index">( 01 )</span>
                <span className="card-stamp">EST. 2024 // SPEC.01</span>
              </div>
              <p>Interactive Web Experiences</p>
              <div className="card-tags">
                <span className="card-tag">Three.js</span>
                <span className="card-tag">GSAP</span>
                <span className="card-tag">WebGL</span>
                <span className="card-tag">Lenis</span>
                <span className="card-tag">React</span>
              </div>
            </div>
          </div>

          <div className="card" id="card-2">
            <div className="card-front">
              <img src="/assets/skills/card_cover_2.jpg" alt="" />
            </div>
            <div className="card-back">
              <div className="card-glare"></div>
              <div className="card-sheen"></div>
              <div className="card-header-meta">
                <span className="card-index">( 02 )</span>
                <span className="card-stamp">EST. 2024 // SPEC.02</span>
              </div>
              <p>Thoughtful Design Language</p>
              <div className="card-tags">
                <span className="card-tag">Figma</span>
                <span className="card-tag">Design Systems</span>
                <span className="card-tag">Micro-UX</span>
                <span className="card-tag">Prototypes</span>
              </div>
            </div>
          </div>

          <div className="card" id="card-3">
            <div className="card-front">
              <img src="/assets/skills/card_cover_3.jpg" alt="" />
            </div>
            <div className="card-back">
              <div className="card-glare"></div>
              <div className="card-sheen"></div>
              <div className="card-header-meta">
                <span className="card-index">( 03 )</span>
                <span className="card-stamp">EST. 2024 // SPEC.03</span>
              </div>
              <p>Visual Design Systems</p>
              <div className="card-tags">
                <span className="card-tag">Brand Identity</span>
                <span className="card-tag">Typography</span>
                <span className="card-tag">3D Assets</span>
                <span className="card-tag">Art Direction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Testimonials (Perspective Text + Marquee) */}
      <div className="testimonials-wrapper">
        <div className="container">
          <section className="hero">
            <div className="testimonials-nav">
              <p>/ TESTIMONIALS</p>
              <p>WORDS & PERSPECTIVE</p>
            </div>

            <div className="about-copy">
              <div className="copy-block">
                <p>
                  I work in portrait photography with a focus on light, tone, and
                  quiet expression. My approach is patient and intentional.
                </p>
              </div>
              <div className="copy-block">
                <p>
                  I try to build images that feel honest, with enough breathing
                  room for personality to settle into the frame.
                </p>
              </div>
              <div className="copy-block">
                <p>
                  The final images aim to capture the shift between who they are
                  and become the moment the shutter falls still.
                </p>
              </div>
            </div>

            <div className="marquee">
              <div className="marquee-track">
                {MARQUEE_ITEMS.map((item, idx) => (
                  <div key={idx} className="marquee-item">
                    <img src={item.img} alt={item.name} />
                    <div className="marquee-caption">
                      <span className="caption-tag">{item.tag}</span>
                      <p className="caption-name">{item.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="scroll-indicator"></div>
          </section>
        </div>
      </div>
    </div>
  );
}
