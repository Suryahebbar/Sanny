"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Footer.css";

function RollText({ children, hoverColor }) {
  return (
    <span className="roll-text">
      <span className="roll-default">{children}</span>
      <span className="roll-hover" style={hoverColor ? { color: hoverColor } : undefined}>
        {children}
      </span>
    </span>
  );
}

export default function Footer({
  contactEmail = "jeremywork064@gmail.com",
  contactPhone = "+254799711789",
  locationCity = "Bengaluru",
  locationArea = "India",
}) {
  const [timeStr, setTimeStr] = useState("");
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef(null);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const textToCopy = contactEmail;
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).catch(() => {
        fallbackCopyText(textToCopy);
      });
    } else {
      fallbackCopyText(textToCopy);
    }

    setCopied(true);
    setShowToast(true);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 2600);
  };

  const fallbackCopyText = (text) => {
    if (typeof document === "undefined") return;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    document.body.removeChild(textArea);
  };

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(now);
      setTimeStr(`${formatted} IST // UTC+5:30`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const revealWrapperRef = useRef(null);
  const revealInnerRef = useRef(null);
  const bannerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const banner = bannerRef.current;
    if (!canvas || !banner) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    // Parameters from backup/extracted/11. Footer/codegrid-artefakt-interactive-ascii-logo
    let CELL_SIZE = 7;
    let CELL_GAP = 2;
    let CELL_STEP = CELL_SIZE + CELL_GAP;
    const GRID_COLOR = "rgba(255, 220, 200, 0.04)";
    const CHAR_COLOR = "#ffffff"; // Pure luminous WHITE for SURYA
    const ASCII_CHARS = ".:+*#%@0369";
    const THRESHOLD = 0.45;
    const PUSH_RADIUS = 8;
    const PUSH_FORCE = 16;
    const SPRING = 0.038;
    const DAMPING = 0.82;

    let cols = 0;
    let rows = 0;
    let cells = [];
    let shockwaves = [];
    let animationFrameId = null;
    let characterIntervalId = null;
    let currentWidth = 0;
    let currentHeight = 0;

    function setupCanvas() {
      if (!banner || !canvas) return;
      currentWidth = banner.clientWidth;
      currentHeight = banner.clientHeight;
      if (currentWidth === 0 || currentHeight === 0) return;

      CELL_SIZE = currentWidth < 768 ? 4 : 7;
      CELL_GAP = currentWidth < 768 ? 1 : 2;
      CELL_STEP = CELL_SIZE + CELL_GAP;

      cols = Math.floor(currentWidth / CELL_STEP);
      rows = Math.floor(currentHeight / CELL_STEP);

      canvas.width = currentWidth * dpr;
      canvas.height = currentHeight * dpr;
      canvas.style.width = `${currentWidth}px`;
      canvas.style.height = `${currentHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function sampleSuryaIntoCells() {
      if (cols === 0 || rows === 0 || currentWidth === 0 || currentHeight === 0) return;

      const offCanvas = document.createElement("canvas");
      offCanvas.width = currentWidth;
      offCanvas.height = currentHeight;
      const offCtx = offCanvas.getContext("2d");

      offCtx.fillStyle = "#000000";
      offCtx.fillRect(0, 0, currentWidth, currentHeight);

      // Measure font so "SURYA" spans across the banner with heavy bold presence and fits vertically
      let maxFontSizeByHeight = Math.floor(currentHeight * 0.72);
      let fontSize = Math.min(Math.floor(currentWidth / 3.4), maxFontSizeByHeight);
      offCtx.font = `900 ${fontSize}px "Impact", "Arial Black", "Anton", sans-serif`;

      const metrics = offCtx.measureText("SURYA");
      if (metrics.width > 0 && metrics.width > currentWidth * 0.92) {
        fontSize = Math.floor(fontSize * ((currentWidth * 0.92) / metrics.width));
        offCtx.font = `900 ${fontSize}px "Impact", "Arial Black", "Anton", sans-serif`;
      }

      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#ffffff";

      // Positioning: Center cleanly within the canvas so "SURYA" is prominent and fully visible
      offCtx.fillText("SURYA", currentWidth / 2, currentHeight * 0.52);

      const { data } = offCtx.getImageData(0, 0, currentWidth, currentHeight);

      cells = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const sampleX = Math.min(currentWidth - 1, Math.floor(col * CELL_STEP + CELL_SIZE / 2));
          const sampleY = Math.min(currentHeight - 1, Math.floor(row * CELL_STEP + CELL_SIZE / 2));
          const idx = (sampleY * currentWidth + sampleX) * 4;

          const brightness =
            (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;
          const isLit = brightness > THRESHOLD;
          const char = isLit
            ? ASCII_CHARS[
            Math.min(
              ASCII_CHARS.length - 1,
              Math.floor(brightness * ASCII_CHARS.length)
            )
            ]
            : " ";

          cells.push({
            col,
            row,
            char,
            isLit,
            offsetX: 0,
            offsetY: 0,
            velX: 0,
            velY: 0,
          });
        }
      }
    }

    function renderFrame() {
      if (!ctx || currentWidth === 0 || currentHeight === 0) return;
      ctx.clearRect(0, 0, currentWidth, currentHeight);

      // Subtle grid
      ctx.fillStyle = GRID_COLOR;
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        ctx.fillRect(c.col * CELL_STEP, c.row * CELL_STEP, CELL_SIZE, CELL_SIZE);
      }

      // Render glowing volcanic shockwave energy ripples
      for (let s = 0; s < shockwaves.length; s++) {
        const sw = shockwaves[s];
        const ringAlpha = (sw.force / sw.initialForce) * 0.45;
        if (ringAlpha > 0.02) {
          ctx.save();
          ctx.beginPath();
          const cx = sw.originCol * CELL_STEP;
          const cy = sw.originRow * CELL_STEP;
          ctx.arc(cx, cy, sw.radius * CELL_STEP, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 110, 30, ${ringAlpha})`;
          ctx.lineWidth = Math.max(1.5, 3 * (sw.force / sw.initialForce));
          ctx.shadowColor = "rgba(206, 32, 23, 0.9)";
          ctx.shadowBlur = 16;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Lit characters forming SURYA in glowing WHITE with dynamic volcanic ember energy
      ctx.font = `900 ${CELL_SIZE + 2}px monospace`;
      ctx.textBaseline = "top";
      ctx.textAlign = "center";

      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        if (!c.isLit) continue;
        const x = (c.col + Math.round(c.offsetX)) * CELL_STEP;
        const y = (c.row + Math.round(c.offsetY)) * CELL_STEP;

        const speed = Math.sqrt(c.velX * c.velX + c.velY * c.velY);
        if (speed > 1.8) {
          const t = Math.min(1, (speed - 1.8) / 8);
          // Interpolate from pure white to hot volcanic ember/crimson
          const g = Math.round(255 - t * 140);
          const b = Math.round(255 - t * 225);
          ctx.fillStyle = `rgb(255, ${g}, ${b})`;
          ctx.shadowColor = `rgba(255, 85, 0, ${0.7 * t})`;
          ctx.shadowBlur = 8 * t;
        } else {
          ctx.fillStyle = CHAR_COLOR;
          ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
          ctx.shadowBlur = 4;
        }

        ctx.fillText(c.char, x + CELL_SIZE / 2, y);
      }

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }

    function init() {
      setupCanvas();
      sampleSuryaIntoCells();
      renderFrame();
    }

    init();

    const ro = new ResizeObserver(() => {
      init();
    });
    ro.observe(banner);

    // Character scrambler every 50ms from backup/extracted/11. Footer
    characterIntervalId = setInterval(() => {
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].isLit) {
          cells[i].char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
        }
      }
      renderFrame();
    }, 50);

    // Interactive spring physics & shockwave blast propagation
    let mouse = { col: -999, row: -999, isMoving: false };
    let idleTimer = null;

    function triggerShockwave(clientX, clientY) {
      if (!banner) return;
      const rect = banner.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        const originCol = (clientX - rect.left) / CELL_STEP;
        const originRow = (clientY - rect.top) / CELL_STEP;
        const maxRadius = Math.max(cols, rows) * 1.35;

        shockwaves.push({
          originCol,
          originRow,
          radius: 0,
          maxRadius,
          speed: 3.2,
          waveThickness: 8,
          force: 48,
          initialForce: 48,
        });

        // Immediate epicenter burst scattering characters right under the click
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          if (!cell.isLit) continue;
          const dx = cell.col - originCol;
          const dy = cell.row - originRow;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 12) {
            const angle = dist > 0.001 ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2;
            const blast = (1 - dist / 12) ** 1.5 * 40;
            cell.velX += Math.cos(angle) * blast;
            cell.velY += Math.sin(angle) * blast;
            cell.char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
          }
        }
      }
    }

    function updatePhysics() {
      // 1. Process active shockwaves (expanding 360° blast rings)
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += sw.speed;
        sw.force *= 0.935; // smooth exponential decay

        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          if (!cell.isLit) continue;

          const dx = cell.col + cell.offsetX - sw.originCol;
          const dy = cell.row + cell.offsetY - sw.originRow;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const delta = Math.abs(dist - sw.radius);
          if (delta < sw.waveThickness) {
            const factor = 1 - delta / sw.waveThickness;
            const impulse = factor * factor * sw.force;
            const angle = dist > 0.001 ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2;
            cell.velX += Math.cos(angle) * impulse;
            cell.velY += Math.sin(angle) * impulse;

            // Scramble character on shockwave contact for high-tech digital effect
            if (Math.random() < 0.28) {
              cell.char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
            }
          }
        }

        if (sw.radius > sw.maxRadius || sw.force < 0.2) {
          shockwaves.splice(s, 1);
        }
      }

      // 2. Process cursor hover repulsion & spring rebound
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (!cell.isLit) continue;

        if (mouse.isMoving) {
          const dx = cell.col + cell.offsetX - mouse.col;
          const dy = cell.row + cell.offsetY - mouse.row;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < PUSH_RADIUS && dist > 0) {
            const force = (1 - dist / PUSH_RADIUS) ** 2 * PUSH_FORCE;
            cell.velX += (dx / dist) * force;
            cell.velY += (dy / dist) * force;
          }
        }

        cell.velX += -cell.offsetX * SPRING;
        cell.velY += -cell.offsetY * SPRING;
        cell.velX *= DAMPING;
        cell.velY *= DAMPING;
        cell.offsetX += cell.velX;
        cell.offsetY += cell.velY;

        if (Math.abs(cell.offsetX) < 0.015 && Math.abs(cell.velX) < 0.015) {
          cell.offsetX = 0;
          cell.velX = 0;
        }
        if (Math.abs(cell.offsetY) < 0.015 && Math.abs(cell.velY) < 0.015) {
          cell.offsetY = 0;
          cell.velY = 0;
        }
      }
    }

    function animationLoop() {
      updatePhysics();
      renderFrame();
      animationFrameId = requestAnimationFrame(animationLoop);
    }

    function handlePointer(clientX, clientY) {
      if (!banner) return;
      const rect = banner.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        mouse.col = (clientX - rect.left) / CELL_STEP;
        mouse.row = (clientY - rect.top) / CELL_STEP;
        mouse.isMoving = true;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          mouse.isMoving = false;
        }, 120);
      } else {
        mouse.isMoving = false;
      }
    }

    const onPointerMove = (e) => {
      handlePointer(e.clientX, e.clientY);
    };

    const onPointerDown = (e) => {
      handlePointer(e.clientX, e.clientY);
      triggerShockwave(e.clientX, e.clientY);
    };

    const onBannerClick = (e) => {
      triggerShockwave(e.clientX, e.clientY);
    };

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
        triggerShockwave(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onPointerLeave = () => {
      mouse.col = -999;
      mouse.row = -999;
      mouse.isMoving = false;
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerleave", onPointerLeave);
    banner.addEventListener("click", onBannerClick);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    animationLoop();

    return () => {
      ro.disconnect();
      if (canvas) {
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerleave", onPointerLeave);
      }
      if (banner) {
        banner.removeEventListener("click", onBannerClick);
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      cancelAnimationFrame(animationFrameId);
      clearInterval(characterIntervalId);
    };
  }, []);

  // Curtain reveal parallax depth and dynamic layout height observer
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = revealWrapperRef.current;
    const inner = revealInnerRef.current;
    if (!wrapper || !inner) return;

    const updateHeight = () => {
      const h = inner.offsetHeight;
      const minH = typeof window !== "undefined" ? window.innerHeight : 0;
      wrapper.style.height = `${Math.max(minH, h)}px`;
    };

    updateHeight();

    const ro = new ResizeObserver(() => {
      updateHeight();
      ScrollTrigger.refresh();
    });
    ro.observe(inner);

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (inner) {
          const yVal = gsap.utils.mapRange(0, 1, 20, 0, p);
          const scaleVal = gsap.utils.mapRange(0, 1, 0.98, 1.0, p);
          const brightnessVal = gsap.utils.mapRange(0, 1, 0.85, 1.0, p);
          gsap.set(inner, {
            y: yVal,
            scale: scaleVal,
            filter: `brightness(${brightnessVal})`,
          });
        }
      },
    });

    return () => {
      ro.disconnect();
      if (st) st.kill();
    };
  }, []);

  // Magnetic cursor pull for CTA buttons and social link icons
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;

    const container = revealInnerRef.current;
    if (!container) return;

    const cleanups = [];

    // Magnetic pull for Get In Touch CTA button & badge
    const getInTouchBtn = container.querySelector("#get-in-touch-btn");
    const badge = getInTouchBtn?.querySelector(".btn-badge");
    const arrow = badge?.querySelector(".btn-arrow");

    if (getInTouchBtn && badge) {
      const onBtnMouseMove = (e) => {
        const btnRect = getInTouchBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;
        const distBtnX = (e.clientX - btnCenterX) * 0.22;
        const distBtnY = (e.clientY - btnCenterY) * 0.22;

        gsap.to(getInTouchBtn, {
          x: distBtnX,
          y: distBtnY,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });

        const badgeRect = badge.getBoundingClientRect();
        const badgeCenterX = badgeRect.left + badgeRect.width / 2;
        const badgeCenterY = badgeRect.top + badgeRect.height / 2;
        const distBadgeX = (e.clientX - badgeCenterX) * 0.42;
        const distBadgeY = (e.clientY - badgeCenterY) * 0.42;

        gsap.to(badge, {
          x: distBadgeX,
          y: distBadgeY,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (arrow) {
          gsap.to(arrow, {
            x: distBadgeX * 0.35,
            y: distBadgeY * 0.35,
            rotation: distBadgeX * 0.45,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      const onBtnMouseLeave = () => {
        gsap.to(getInTouchBtn, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        });
        gsap.to(badge, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        });
        if (arrow) {
          gsap.to(arrow, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.65,
            ease: "elastic.out(1.1, 0.4)",
            overwrite: "auto",
          });
        }
      };

      getInTouchBtn.addEventListener("mousemove", onBtnMouseMove);
      getInTouchBtn.addEventListener("mouseleave", onBtnMouseLeave);

      cleanups.push(() => {
        getInTouchBtn.removeEventListener("mousemove", onBtnMouseMove);
        getInTouchBtn.removeEventListener("mouseleave", onBtnMouseLeave);
      });
    }

    // Magnetic pull for Quick Copy button
    const quickCopyBtn = container.querySelector("#quick-copy-btn");
    const copyBadge = quickCopyBtn?.querySelector(".copy-badge");

    if (quickCopyBtn) {
      const onCopyMouseMove = (e) => {
        const copyRect = quickCopyBtn.getBoundingClientRect();
        const copyCenterX = copyRect.left + copyRect.width / 2;
        const copyCenterY = copyRect.top + copyRect.height / 2;
        const distCopyX = (e.clientX - copyCenterX) * 0.24;
        const distCopyY = (e.clientY - copyCenterY) * 0.24;

        gsap.to(quickCopyBtn, {
          x: distCopyX,
          y: distCopyY,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (copyBadge) {
          gsap.to(copyBadge, {
            x: distCopyX * 0.38,
            y: distCopyY * 0.38,
            scale: 1.14,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      const onCopyMouseLeave = () => {
        gsap.to(quickCopyBtn, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        });
        if (copyBadge) {
          gsap.to(copyBadge, {
            x: 0,
            y: 0,
            scale: 1.0,
            duration: 0.65,
            ease: "elastic.out(1.1, 0.4)",
            overwrite: "auto",
          });
        }
      };

      quickCopyBtn.addEventListener("mousemove", onCopyMouseMove);
      quickCopyBtn.addEventListener("mouseleave", onCopyMouseLeave);

      cleanups.push(() => {
        quickCopyBtn.removeEventListener("mousemove", onCopyMouseMove);
        quickCopyBtn.removeEventListener("mouseleave", onCopyMouseLeave);
      });
    }

    // Magnetic pull for social dot icons
    const socialLinks = container.querySelectorAll(".social-link");
    socialLinks.forEach((link) => {
      const icon = link.querySelector(".social-dot-icon");
      if (!icon) return;

      const onSocialMove = (e) => {
        const iconRect = icon.getBoundingClientRect();
        const iconCenterX = iconRect.left + iconRect.width / 2;
        const iconCenterY = iconRect.top + iconRect.height / 2;
        const dx = (e.clientX - iconCenterX) * 0.35;
        const dy = (e.clientY - iconCenterY) * 0.35;

        gsap.to(icon, {
          x: dx,
          y: dy,
          scale: 1.2,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const onSocialLeave = () => {
        gsap.to(icon, {
          x: 0,
          y: 0,
          scale: 1.0,
          duration: 0.6,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        });
      };

      link.addEventListener("mousemove", onSocialMove);
      link.addEventListener("mouseleave", onSocialLeave);

      cleanups.push(() => {
        link.removeEventListener("mousemove", onSocialMove);
        link.removeEventListener("mouseleave", onSocialLeave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="footer-reveal-wrapper" ref={revealWrapperRef}>
      <div className="footer-reveal-inner" ref={revealInnerRef}>
        <footer className="footer-section">
          {/* Animated Copied to Clipboard Toast Notification */}
          <div
            className={`copy-toast-notification ${showToast ? "toast-visible" : ""}`}
            role="status"
            aria-live="polite"
          >
            <span className="toast-emerald-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <div className="toast-text-group">
              <span className="toast-title">Copied to clipboard! ✓</span>
              <span className="toast-email">{contactEmail}</span>
            </div>
          </div>

          <div className="footer-container">
            {/* ==========================================================
            Top Section: Headline, CTA & Metadata Columns
            ========================================================== */}
            <div className="footer-top">
              {/* Left Hero Column */}
              <div className="footer-hero-col">
                <div className="availability-badge">
                  <span className="pulsing-emerald-dot">
                    <span className="dot-ping"></span>
                    <span className="dot-core"></span>
                  </span>
                  <span className="availability-text">Online</span>
                </div>

                <h2 className="footer-headline">
                  Let&apos;s Build<br />
                  Something Amazing<span className="accent-dot">.</span>
                </h2>

                <div className="footer-cta-group">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="get-in-touch-btn"
                    id="get-in-touch-btn"
                  >
                    <span className="btn-label">
                      <RollText hoverColor="#ff5500">Get In Touch</RollText>
                    </span>
                    <span className="btn-badge">
                      <svg
                        className="btn-arrow"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={`quick-copy-btn ${copied ? "copied" : ""}`}
                    id="quick-copy-btn"
                    title={`Copy ${contactEmail} to clipboard`}
                    aria-label="Copy email address"
                  >
                    <span className="copy-badge">
                      {copied ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </span>
                    <span className="copy-label">
                      {copied ? "Copied!" : "Copy Email"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Side: Glassmorphic Bento Grid */}
              <div className="footer-bento-grid">
                {/* Bento Card 1: Location & Local Time */}
                <div className="bento-card bento-card-location">
                  <div className="bento-card-header">
                    <span className="bento-badge-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                    </span>
                    <span className="bento-badge-text">Location & Time</span>
                  </div>
                  <div className="bento-location-content">
                    <span className="bento-city-name">{locationCity}, {locationArea}</span>
                    <div className="live-clock-badge">
                      <span className="clock-icon">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </span>
                      <span className="clock-time">{mounted && timeStr ? timeStr : "04:30:00 PM IST // UTC+5:30"}</span>
                    </div>
                  </div>
                </div>

                {/* Bento Card 2: Direct Line / Contact */}
                <div className="bento-card bento-card-contact">
                  <div className="bento-card-header">
                    <span className="bento-badge-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </span>
                    <span className="bento-badge-text">Direct Line</span>
                  </div>
                  <div className="bento-contact-rows">
                    <a href={`mailto:${contactEmail}`} className="bento-contact-link">
                      <RollText>{contactEmail}</RollText>
                    </a>
                    <a href={`tel:${contactPhone}`} className="bento-contact-link">
                      <RollText>{contactPhone}</RollText>
                    </a>
                  </div>
                </div>

                {/* Bento Card 3: Social Radar */}
                <div className="bento-card bento-card-social">
                  <div className="bento-card-header">
                    <span className="bento-badge-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </span>
                    <span className="bento-badge-text">Social Radar</span>
                  </div>
                  <div className="social-links-grid">
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link">
                      <span className="social-dot-icon">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </span>
                      <RollText>Instagram</RollText>
                    </a>

                    <a href="https://x.com" target="_blank" rel="noreferrer" className="social-link">
                      <span className="social-dot-icon">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </span>
                      <RollText>Twitter/X</RollText>
                    </a>

                    <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-link">
                      <span className="social-dot-icon">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </span>
                      <RollText>YouTube</RollText>
                    </a>

                    <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="social-link">
                      <span className="social-dot-icon">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.98-.13-2.48.03-3.55.14-.98.92-6.52.92-6.52s-.23-.47-.23-1.16c0-1.09.63-1.9 1.42-1.9.67 0 1 .5 1 1.1 0 .67-.43 1.68-.65 2.61-.18.79.4 1.43 1.17 1.43 1.4 0 2.48-1.48 2.48-3.62 0-1.89-1.36-3.21-3.3-3.21-2.41 0-3.82 1.81-3.82 3.68 0 .73.28 1.51.63 1.93.07.08.08.16.06.24-.07.28-.22.88-.25.99-.04.16-.13.2-.3.12-1.12-.52-1.82-2.15-1.82-3.46 0-2.82 2.05-5.41 5.91-5.41 3.1 0 5.51 2.21 5.51 5.17 0 3.08-1.94 5.56-4.63 5.56-.91 0-1.76-.47-2.05-1.02l-.56 2.13c-.2.78-.75 1.76-1.12 2.36A12 12 0 1 0 12 0z" />
                        </svg>
                      </span>
                      <RollText>Pinterest</RollText>
                    </a>
                  </div>
                </div>

                {/* Bento Card 4: Navigation Index */}
                <div className="bento-card bento-card-nav">
                  <div className="bento-card-header">
                    <span className="bento-badge-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                      </svg>
                    </span>
                    <span className="bento-badge-text">Quick Index</span>
                  </div>
                  <div className="bento-pills-wrap">
                    <a href="#" className="bento-nav-pill"><RollText>Privacy</RollText></a>
                    <a href="#" className="bento-nav-pill"><RollText>About</RollText></a>
                    <a href="#" className="bento-nav-pill"><RollText>Services</RollText></a>
                    <a href="#" className="bento-nav-pill"><RollText>Work</RollText></a>
                    <a href="#" className="bento-nav-pill"><RollText>Blog</RollText></a>
                  </div>
                </div>
              </div>
            </div>

            {/* ==========================================================
            Bottom Banner: Blurred Background Tower, Semi-transparent
            Code Watermarks & Pure WHITE Interactive ASCII "SURYA"
            ========================================================== */}
            <div ref={bannerRef} className="footer-create-banner" id="footer-create-banner">
              {/* Layer 1: Blurred tower background photo receded into deep background */}
              <div className="banner-tower-bg"></div>

              {/* Layer 2: Warm ambient gradient overlay */}
              <div className="banner-ambient-overlay"></div>

              {/* Layer 3: Subtle watermark code snippet (Left) */}
              <div className="code-overlay-left">
                <pre>
                  {`const slider = document.querySelector(".slider");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
let index = 0;
const slides = document.querySelectorAll(".slide");

function updateSlide() {
  slider.style.transform = \`translateX(-\${index * 100}%)\`;
}`}
                </pre>
              </div>

              {/* Layer 3: Subtle watermark code snippet (Right) */}
              <div className="code-overlay-right">
                <pre>
                  {`window.addEventListener('resize', () => {
  updateSlide();
});

next.addEventListener('click', () => {
  index = (index + 1) % slides.length;
  updateSlide();
});`}
                </pre>
              </div>

              {/* Layer 4: Interactive ASCII Canvas with White SURYA */}
              <canvas ref={canvasRef} className="ascii-canvas"></canvas>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
