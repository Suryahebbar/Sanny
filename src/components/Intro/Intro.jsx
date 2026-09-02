"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./Intro.css";

export default function Intro() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const animeTextParagraphs = containerRef.current.querySelectorAll(".anime-text p");
      const wordHighlightBgColor = "60, 60, 60";
      const keywords = [
        "vibrant",
        "living",
        "clarity",
        "expression",
        "shape",
        "intuitive",
        "storytelling",
        "interactive",
        "vision",
      ];

      animeTextParagraphs.forEach((paragraph) => {
        const text = paragraph.textContent;
        const words = text.split(/\s+/);
        paragraph.innerHTML = "";

        words.forEach((word) => {
          if (word.trim()) {
            const wordContainer = document.createElement("div");
            wordContainer.className = "word";

            const wordText = document.createElement("span");
            wordText.textContent = word;

            const normalizedWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");
            if (keywords.includes(normalizedWord)) {
              wordContainer.classList.add("keyword-wrapper");
              wordText.classList.add("keyword", normalizedWord);
            }

            wordContainer.appendChild(wordText);
            paragraph.appendChild(wordContainer);
          }
        });
      });

      const animeTextContainers = containerRef.current.querySelectorAll(".anime-text-container");

      animeTextContainers.forEach((container) => {
        ScrollTrigger.create({
          trigger: container,
          pin: container,
          start: "top top",
          end: `+=${window.innerHeight * 3}`,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const words = Array.from(container.querySelectorAll(".anime-text .word"));
            const totalWords = words.length;

            const progressTarget = 0.85;
            const revealProgress = Math.min(1, Math.max(0, progress / progressTarget));

            const overlapWords = 15;
            const totalAnimationLength = 1 + overlapWords / totalWords;

            words.forEach((word, index) => {
              const wordText = word.querySelector("span");
              if (!wordText) return;

              const wordStart = index / totalWords;
              const wordEnd = wordStart + overlapWords / totalWords;

              const timelineScale =
                1 /
                Math.min(
                  totalAnimationLength,
                  1 + (totalWords - 1) / totalWords + overlapWords / totalWords
                );

              const adjustedStart = wordStart * timelineScale;
              const adjustedEnd = wordEnd * timelineScale;
              const duration = adjustedEnd - adjustedStart;

              const wordProgress =
                revealProgress <= adjustedStart
                  ? 0
                  : revealProgress >= adjustedEnd
                  ? 1
                  : (revealProgress - adjustedStart) / duration;

              word.style.opacity = wordProgress;

              const backgroundFadeStart = wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
              const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
              word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;

              const textRevealThreshold = 0.9;
              const textRevealProgress =
                wordProgress >= textRevealThreshold
                  ? (wordProgress - textRevealThreshold) / (1 - textRevealThreshold)
                  : 0;
              wordText.style.opacity = Math.pow(textRevealProgress, 0.5);
            });
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="intro-section">
      <section className="hero">
        <div className="copy-container">
          <h1>Playground for bold ideas and creative interfaces.</h1>
        </div>
      </section>

      <section className="about anime-text-container">
        <div className="copy-container">
          <div className="anime-text">
            <p>
              Huebase is a vibrant space for designers who think in motion and
              build with intent. It's more than a tool — it's where bold ideas
              turn into living interfaces, powered by color, rhythm, and creative
              control.
            </p>
            <p>
              We believe great design starts with clarity and expression ends.
              That's why Huebase is built to simplify your workflow while
              amplifying your creative reach. From the first concept to the final
              handoff, it's a space where your ideas take shape and more, your
              palette comes to life, and your interface begins.
            </p>
          </div>
        </div>
      </section>
      <section className="outro">
        <div className="copy-container">
          <h1>Built for designers who shape the web.</h1>
        </div>
      </section>
    </div>
  );
}
