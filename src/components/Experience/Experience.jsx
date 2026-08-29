"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import "./Experience.css";

export default function Experience() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger, Flip);

      const localContainer = containerRef.current.querySelector(".container");
      const lightColor = "#edf1e8";
      const darkColor = "#101010";

      function interpolateColor(color1, color2, factor) {
        return gsap.utils.interpolate(color1, color2, factor);
      }

      gsap.to(".marquee-images", {
        scrollTrigger: {
          trigger: ".marquee",
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const xPosition = -75 + progress * 25;
            gsap.set(".marquee-images", {
              x: `${xPosition}%`,
            });
          },
        },
      });

      let pinnedMarqueeImgClone = null;
      let isImgCloneActive = false;

      function createPinnedMarqueeImgClone() {
        if (isImgCloneActive) return;

        const originalMarqueeImg = containerRef.current.querySelector(".marquee-img.pin img");
        if (!originalMarqueeImg) return;
        
        const rect = originalMarqueeImg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        pinnedMarqueeImgClone = originalMarqueeImg.cloneNode(true);

        gsap.set(pinnedMarqueeImgClone, {
          position: "fixed",
          left: centerX - originalMarqueeImg.offsetWidth / 2 + "px",
          top: centerY - originalMarqueeImg.offsetHeight / 2 + "px",
          width: originalMarqueeImg.offsetWidth + "px",
          height: originalMarqueeImg.offsetHeight + "px",
          transform: "rotate(-5deg)",
          transformOrigin: "center center",
          pointerEvents: "none",
          willChange: "transform",
          zIndex: 100,
        });

        document.body.appendChild(pinnedMarqueeImgClone);
        gsap.set(originalMarqueeImg, { opacity: 0 });
        isImgCloneActive = true;
      }

      function removePinnedMarqueeImgClone() {
        if (!isImgCloneActive) return;
        if (pinnedMarqueeImgClone) {
          pinnedMarqueeImgClone.remove();
          pinnedMarqueeImgClone = null;
        }
        const originalMarqueeImg = containerRef.current.querySelector(".marquee-img.pin img");
        if (originalMarqueeImg) {
          gsap.set(originalMarqueeImg, { opacity: 1 });
        }
        isImgCloneActive = false;
      }

      ScrollTrigger.create({
        trigger: ".horizontal-scroll",
        start: "top top",
        end: () => `+=${window.innerHeight * 5}`,
        pin: true,
      });

      ScrollTrigger.create({
        trigger: ".marquee",
        start: "top top",
        onEnter: createPinnedMarqueeImgClone,
        onEnterBack: createPinnedMarqueeImgClone,
        onLeaveBack: removePinnedMarqueeImgClone,
      });

      let flipAnimation = null;

      ScrollTrigger.create({
        trigger: ".horizontal-scroll",
        start: "top 50%",
        end: () => `+=${window.innerHeight * 5.5}`,
        onEnter: () => {
          if (pinnedMarqueeImgClone && isImgCloneActive && !flipAnimation) {
            const state = Flip.getState(pinnedMarqueeImgClone);

            gsap.set(pinnedMarqueeImgClone, {
              position: "fixed",
              left: "0px",
              top: "0px",
              width: "100%",
              height: "100svh",
              transform: "rotate(0deg)",
              transformOrigin: "center center",
            });

            flipAnimation = Flip.from(state, {
              duration: 1,
              ease: "none",
              paused: true,
            });
          }
        },
        onLeaveBack: () => {
          if (flipAnimation) {
            flipAnimation.kill();
            flipAnimation = null;
          }
          gsap.set(localContainer, {
            backgroundColor: lightColor,
          });
          gsap.set(".horizontal-scroll-wrapper", {
            x: "0%",
          });
        },
      });

      ScrollTrigger.create({
        trigger: ".horizontal-scroll",
        start: "top 50%",
        end: () => `+=${window.innerHeight * 5.5}`,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress <= 0.05) {
            const bgColorProgress = Math.min(progress / 0.05, 1);
            const newBgColor = interpolateColor(
              lightColor,
              darkColor,
              bgColorProgress
            );
            gsap.set(localContainer, {
              backgroundColor: newBgColor,
            });
          } else if (progress > 0.05) {
            gsap.set(localContainer, {
              backgroundColor: darkColor,
            });
          }

          if (progress <= 0.2) {
            const scaleProgress = progress / 0.2;
            if (flipAnimation) {
              flipAnimation.progress(scaleProgress);
            }
          }

          if (progress > 0.2 && progress <= 0.95) {
            if (flipAnimation) {
              flipAnimation.progress(1);
            }

            const horizontalProgress = (progress - 0.2) / 0.75;

            const wrapperTranslateX = -66.67 * horizontalProgress;
            gsap.set(".horizontal-scroll-wrapper", {
              x: `${wrapperTranslateX}%`,
            });

            const slideMovement = (66.67 / 100) * 3 * horizontalProgress;
            const imageTranslateX = -slideMovement * 100;
            if (pinnedMarqueeImgClone) {
              gsap.set(pinnedMarqueeImgClone, {
                x: `${imageTranslateX}%`,
              });
            }
          } else if (progress > 0.95) {
            if (flipAnimation) {
              flipAnimation.progress(1);
            }
            if (pinnedMarqueeImgClone) {
              gsap.set(pinnedMarqueeImgClone, {
                x: "-200%",
              });
            }
            gsap.set(".horizontal-scroll-wrapper", {
              x: "-66.67%",
            });
          }
        },
      });

      return () => {
        if (pinnedMarqueeImgClone) {
          pinnedMarqueeImgClone.remove();
        }
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="experience-section">
      <div className="container">
        <section className="hero">
          <h1>
            Fragments of thought arranged in sequence become patterns. They unfold
            step by step, shaping meaning as they move forward.
          </h1>
        </section>

        <section className="marquee">
          <div className="marquee-wrapper">
            <div className="marquee-images">
              <div className="marquee-img"><img src="/assets/experience/img-1.jpg" alt="" /></div>
              <div className="marquee-img"><img src="/assets/experience/img-2.jpg" alt="" /></div>
              <div className="marquee-img"><img src="/assets/experience/img-3.jpg" alt="" /></div>
              <div className="marquee-img"><img src="/assets/experience/img-4.jpg" alt="" /></div>
              <div className="marquee-img"><img src="/assets/experience/img-5.jpg" alt="" /></div>
              <div className="marquee-img"><img src="/assets/experience/img-6.jpg" alt="" /></div>
              <div className="marquee-img pin"><img src="/assets/experience/img-7.jpg" alt="" /></div>
              <div className="marquee-img"><img src="/assets/experience/img-8.jpg" alt="" /></div>
              <div className="marquee-img"><img src="/assets/experience/img-9.jpg" alt="" /></div>
              <div className="marquee-img"><img src="/assets/experience/img-10.jpg" alt="" /></div>
              <div className="marquee-img"><img src="/assets/experience/img-11.jpg" alt="" /></div>
              <div className="marquee-img"><img src="/assets/experience/img-12.jpg" alt="" /></div>
              <div className="marquee-img"><img src="/assets/experience/img-13.jpg" alt="" /></div>
            </div>
          </div>
        </section>

        <section className="horizontal-scroll">
          <div className="horizontal-scroll-wrapper">
            <div className="horizontal-slide horizontal-spacer"></div>
            <div className="horizontal-slide">
              <div className="col">
                <h3>
                  A landscape in constant transition, where every shape, sound,
                  and shadow refuses to stay still. What seems stable begins to
                  dissolve, and what fades returns again in a new form.
                </h3>
              </div>
              <div className="col">
                <img src="/assets/experience/slide-1.jpg" alt="" />
              </div>
            </div>
            <div className="horizontal-slide">
              <div className="col">
                <h3>
                  The rhythm of motion carries us forward into spaces that feel
                  familiar yet remain undefined. Each shift is subtle, yet
                  together they remind us that nothing we see is ever permanent.
                </h3>
              </div>
              <div className="col">
                <img src="/assets/experience/slide-2.jpg" alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className="outro">
          <h1>
            Shadows fold into light. Shapes shift across the frame, reminding us
            that stillness is only temporary.
          </h1>
        </section>
      </div>
    </div>
  );
}
