"use client";

import React, { useRef, useEffect } from "react";
import "./Footer.css";

export default function Footer() {
  const canvasRef = useRef(null);
  const logoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const logoImg = logoRef.current;
    if (!canvas || !logoImg) return;

    let CELL_SIZE = 8;
    let CELL_GAP = 2;
    let CELL_STEP = CELL_SIZE + CELL_GAP;
    const GRID_COLOR = "#171717";
    const CHAR_COLOR = "#dadada";
    const ASCII_CHARS = ".:+*#%@0369";
    const THRESHOLD = 0.5;
    const PUSH_RADIUS = 5;
    const PUSH_FORCE = 30;
    const SPRING = 0.025;
    const DAMPING = 0.5;

    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    let cols = 0, rows = 0, cells = [];
    let animationFrameId = null;
    let characterIntervalId = null;

    function setupCanvas() {
      if (typeof window === "undefined") return;
      CELL_SIZE = window.innerWidth < 768 ? 3 : 8;
      CELL_GAP = window.innerWidth < 768 ? 1 : 2;
      CELL_STEP = CELL_SIZE + CELL_GAP;
      cols = Math.floor(window.innerWidth / CELL_STEP);
      rows = Math.floor(window.innerHeight / CELL_STEP);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawGrid() {
      if (typeof window === "undefined") return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = GRID_COLOR;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          ctx.fillRect(col * CELL_STEP, row * CELL_STEP, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    function sampleLogoIntoCells() {
      if (typeof window === "undefined") return;
      const rect = logoImg.getBoundingClientRect();
      const logoCols = Math.ceil(rect.width / CELL_STEP);
      const logoRows = Math.ceil(rect.height / CELL_STEP);
      
      // Calculate startCol and startRow relative to the container/viewport
      // since logoImg is positioned absolute at center (50%)
      const parentRect = containerRef.current.getBoundingClientRect();
      const startCol = Math.floor((rect.left - parentRect.left) / CELL_STEP);
      const startRow = Math.floor((rect.top - parentRect.top) / CELL_STEP);

      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = logoCols;
      sampleCanvas.height = logoRows;
      const sampleCtx = sampleCanvas.getContext("2d");
      sampleCtx.fillStyle = "#000";
      sampleCtx.fillRect(0, 0, logoCols, logoRows);
      sampleCtx.drawImage(logoImg, 0, 0, logoCols, logoRows);
      const { data } = sampleCtx.getImageData(0, 0, logoCols, logoRows);

      cells = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const inLogo =
            col >= startCol &&
            col < startCol + logoCols &&
            row >= startRow &&
            row < startRow + logoRows;
          let isLit = false,
            char = " ";
          if (inLogo) {
            const idx = ((row - startRow) * logoCols + (col - startCol)) * 4;
            const brightness =
              (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) /
              255;
            isLit = brightness > THRESHOLD;
            char = isLit
              ? ASCII_CHARS[
                  Math.min(
                    ASCII_CHARS.length - 1,
                    Math.floor(brightness * ASCII_CHARS.length)
                  )
                ]
              : " ";
          }
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
      if (typeof window === "undefined") return;
      ctx.font = `${CELL_SIZE + 2}px monospace`;
      ctx.textBaseline = "top";
      ctx.textAlign = "center";
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.fillStyle = GRID_COLOR;
      for (const { col, row } of cells) {
        ctx.fillRect(col * CELL_STEP, row * CELL_STEP, CELL_SIZE, CELL_SIZE);
      }

      ctx.fillStyle = CHAR_COLOR;
      for (const { col, row, char, isLit, offsetX, offsetY } of cells) {
        if (!isLit) continue;
        const x = (col + Math.round(offsetX)) * CELL_STEP;
        const y = (row + Math.round(offsetY)) * CELL_STEP;
        ctx.fillText(char, x + CELL_SIZE / 2, y);
      }
    }

    function init() {
      setupCanvas();
      sampleLogoIntoCells();
      renderFrame();
    }

    const handleResize = () => {
      init();
    };

    window.addEventListener("resize", handleResize);

    if (logoImg.complete) {
      init();
    } else {
      logoImg.addEventListener("load", init);
    }

    characterIntervalId = setInterval(() => {
      for (const cell of cells) {
        if (cell.isLit) {
          cell.char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
        }
      }
      renderFrame();
    }, 50);

    let mouse = { col: -999, row: -999, isMoving: false };
    let idleTimer = null;

    function updatePhysics() {
      for (const cell of cells) {
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
        if (Math.abs(cell.offsetX) < 0.01 && Math.abs(cell.velX) < 0.01) {
          cell.offsetX = cell.velX = 0;
        }
        if (Math.abs(cell.offsetY) < 0.01 && Math.abs(cell.velY) < 0.01) {
          cell.offsetY = cell.velY = 0;
        }
      }
    }

    function animationLoop() {
      updatePhysics();
      renderFrame();
      animationFrameId = requestAnimationFrame(animationLoop);
    }

    const handleMouseMove = (e) => {
      const parentRect = containerRef.current.getBoundingClientRect();
      mouse.col = (e.clientX - parentRect.left) / CELL_STEP;
      mouse.row = (e.clientY - parentRect.top) / CELL_STEP;
      mouse.isMoving = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        mouse.isMoving = false;
      }, 50);
    };

    const handleMouseLeave = () => {
      mouse.col = mouse.row = -999;
      mouse.isMoving = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    animationLoop();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      logoImg.removeEventListener("load", init);
      cancelAnimationFrame(animationFrameId);
      clearInterval(characterIntervalId);
    };
  }, []);

  return (
    <div ref={containerRef} className="footer-section">
      <section className="hero">
        <canvas ref={canvasRef} id="grid"></canvas>

        <div className="logo">
          <img ref={logoRef} id="source" src="/assets/footer/logo.png" alt="Logo" />
        </div>
      </section>
    </div>
  );
}
