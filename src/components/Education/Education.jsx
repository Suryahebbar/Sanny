"use client";

import React from "react";
import Copy from "../Copy";
import "./Education.css";

export default function Education() {
  return (
    <div className="education-section">
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
    </div>
  );
}
