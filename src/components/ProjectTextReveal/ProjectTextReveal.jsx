"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Copy from "../Copy";
import "./ProjectTextReveal.css";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectTextReveal() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const imageWrappers = containerRef.current.querySelectorAll(
        ".preview-image-wrapper"
      );

      imageWrappers.forEach((wrapper) => {
        const img = wrapper.querySelector("img");
        if (!img) return;

        gsap.fromTo(
          img,
          {
            yPercent: 25,
            scale: 1.4,
          },
          {
            yPercent: -25,
            scale: 1.4,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="project-text-reveal-section">
      <nav>
        <div className="col">
          <div className="sub-col">
            <span>Greyloom</span>
          </div>
          <div className="sub-col">
            <span>Home</span>
            <span>Projects</span>
            <span>About</span>
            <span>Lab</span>
          </div>
        </div>
        <div className="col">
          <span>Let's talk</span>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-img">
          <img src="/hero.jpg" alt="" />
        </div>

        <div className="header">
          <Copy delay={0.5}>
            <h1>We craft identities and experiences for the bold.</h1>
          </Copy>
        </div>
      </section>

      <section className="about">
        <Copy>
          <span>Design & Strategy for the Vision-Driven</span>
        </Copy>
        <div className="header">
          <Copy>
            <h1>
              We partner with founders, innovators, and change-makers to shape
              brands that resonate. From first lines of code to global
              launches, we bring focus, elegance, and intent to every stage.
            </h1>
          </Copy>
        </div>
      </section>

      <section className="about-img">
        <img src="/about.jpg" alt="" />
      </section>

      <section className="story">
        <div className="col">
          <Copy>
            <h1>
              The Story Behind <br /> Our Stillness
            </h1>
          </Copy>
        </div>
        <div className="col">
          <Copy>
            <p>
              Greyloom was born from a simple idea: that creativity, when
              wielded with intention, can quietly reshape the world. In an era
              of overstimulation and fleeting trends, we chose a different
              path. One of clarity, restraint, and long-form vision.
            </p>

            <p>
              We began as a small collective of designers, developers, and
              strategists who shared an obsession with thoughtful execution.
              No shortcuts, no templates. Just the hard, honest work of
              listening deeply, thinking critically, and building beautifully.
              Over time, our work began to attract the kind of clients we had
              always hoped for. Visionary founders, principled organizations,
              and global teams with sharp ideas and quiet confidence.
            </p>

            <p>
              We don’t chase virality. We don’t trade in noise. We build for
              the long haul: timeless identities, seamless digital
              experiences, and strategies that evolve with clarity and
              purpose. Greyloom exists for those who believe that the most
              enduring ideas don’t demand attention. They earn it.
            </p>
          </Copy>
        </div>
      </section>

      <section className="projects">
        <div className="projects-badge-wrapper">
          <div className="projects-badge">
            <Copy>
              <span>PROJECTS</span>
            </Copy>
          </div>
        </div>

        <div className="projects-list">
          {/* Project 1 (Page 1): Top Row (Title Left, 2 Cols Right) + Wide Image Bottom */}
          <div className="project-item project-1">
            <div className="project-top-row">
              <div className="project-title-col">
                <Copy>
                  <h1>1. Lorem Ipsum Dolor Sit Amet<br />Consectetur</h1>
                </Copy>
              </div>
              <div className="project-desc-col">
                <Copy>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Ut enim ad minim veniam.
                  </p>
                </Copy>
              </div>
              <div className="project-desc-col">
                <Copy>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Ut enim ad minim veniam.
                  </p>
                </Copy>
              </div>
            </div>

            <div className="project-preview-box">
              <div className="preview-image-wrapper wide">
                <img src="/hero.jpg" alt="Project 1 Preview" />
              </div>
            </div>
          </div>

          {/* Project 2 (Page 2): Split Layout (Title Top-Left, 2 Stacked Paragraphs Bottom-Left, Portrait Image Right) */}
          <div className="project-item project-2">
            <div className="project-split-layout">
              <div className="project-split-info">
                <div className="project-title-col">
                  <Copy>
                    <h1>2. Consectetur Adipiscing Elit<br />Sed Do Eiusmod</h1>
                  </Copy>
                </div>
                <div className="project-desc-group">
                  <Copy>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate
                      velit esse cillum dolore eu fugiat nulla pariatur.
                      Excepteur sint occaecat cupidatat non proident, sunt
                      in culpa qui officia deserunt mollit anim id est
                      laborum.
                    </p>
                  </Copy>
                  <Copy>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate
                      velit esse cillum dolore eu fugiat nulla pariatur.
                      Excepteur sint occaecat cupidatat non proident, sunt
                      in culpa qui officia deserunt mollit anim id est
                      laborum.
                    </p>
                  </Copy>
                </div>
              </div>

              <div className="project-preview-box portrait-box">
                <div className="preview-image-wrapper portrait">
                  <img src="/about.jpg" alt="Project 2 Preview" />
                </div>
              </div>
            </div>
          </div>

          {/* Project 3 (Page 3): Top Row (2 Paragraphs Left, Title Right) + Wide Image Bottom */}
          <div className="project-item project-3">
            <div className="project-top-row-reversed">
              <div className="project-desc-col">
                <Copy>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate
                    velit esse cillum dolore eu fugiat nulla. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla.
                  </p>
                </Copy>
              </div>
              <div className="project-desc-col">
                <Copy>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate
                    velit esse cillum dolore eu fugiat nulla. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla.
                  </p>
                </Copy>
              </div>
              <div className="project-title-col right-align">
                <Copy>
                  <h1>3. Tempor Incididunt Ut<br />Labore</h1>
                </Copy>
              </div>
            </div>

            <div className="project-preview-box">
              <div className="preview-image-wrapper wide">
                <img src="/assets/experience/slide-2.jpg" alt="Project 3 Preview" />
              </div>
            </div>
          </div>

          {/* Project 4 (Page 4): WHITE BACKGROUND (Title Left, 2 Cols Right, Dual Images Bottom) */}
          <div className="project-item project-4 project-white-bg">
            <div className="project-top-row">
              <div className="project-title-col">
                <Copy>
                  <h1>4. Lorem Ipsum Dolor Sit Amet</h1>
                </Copy>
              </div>
              <div className="project-desc-col">
                <Copy>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Ut enim ad minim veniam.
                  </p>
                </Copy>
              </div>
              <div className="project-desc-col">
                <Copy>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate
                    velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident.
                  </p>
                </Copy>
              </div>
            </div>

            <div className="project-dual-previews">
              <div className="project-preview-box">
                <div className="preview-image-wrapper dual">
                  <img src="/assets/experience/img-1.jpg" alt="Project 4 Preview A" />
                </div>
              </div>
              <div className="project-preview-box">
                <div className="preview-image-wrapper dual">
                  <img src="/assets/experience/img-2.jpg" alt="Project 4 Preview B" />
                </div>
              </div>
            </div>
          </div>

          {/* Project 5 (Page 5): Split Layout (Title Top-Left, Long Paragraph Bottom-Left, Tech Image Right) */}
          <div className="project-item project-5">
            <div className="project-split-layout">
              <div className="project-split-info">
                <div className="project-title-col">
                  <Copy>
                    <h1>5. Excepteur Sint Occaecat Cupidatat</h1>
                  </Copy>
                </div>
                <div className="project-desc-group">
                  <Copy>
                    <p>
                      Natus error sit voluptatem accusantium doloremque
                      laudantium totam rem aperiam. Sunt in culpa qui officia
                      deserunt mollit anim id est laborum sed ut
                      perspiciatis. Sunt in culpa qui officia deserunt mollit
                      anim id est laborum sed ut perspiciatis. Sunt in culpa
                      qui officia deserunt mollit anim id est laborum sed ut
                      perspiciatis. Sunt in culpa qui officia deserunt mollit
                      anim id est laborum sed ut perspiciatis. Sunt in culpa
                      qui officia deserunt mollit anim id est laborum sed ut
                      perspiciatis.
                    </p>
                  </Copy>
                </div>
              </div>

              <div className="project-preview-box portrait-box">
                <div className="preview-image-wrapper portrait">
                  <img src="/assets/experience/img-7.jpg" alt="Project 5 Preview" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="philosophy">
        <Copy>
          <span>The Thought Beneath</span>
        </Copy>
        <div className="header">
          <Copy>
            <h1>
              We believe in the power of quiet conviction. In work that speaks
              softly but lingers long. In design as a tool for clarity, not
              decoration. We believe that the best ideas don't demand
              attention. Our philosophy is simple. Create with purpose.
            </h1>
          </Copy>
        </div>
      </section>
    </div>
  );
}
