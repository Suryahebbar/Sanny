"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./ExperienceTunnel.css";

export default function ExperienceTunnel() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const progressTextRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      if (!container) return;

      // ----------------------------------------------------
      // 1. SCENE, CAMERA & RENDERER SETUP
      // ----------------------------------------------------
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      scene.fog = new THREE.FogExp2(0x000000, 0.0045);

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // Dynamic wide-angle perspective for dramatic corridor depth
      const camera = new THREE.PerspectiveCamera(68, width / height, 0.1, 1000);
      camera.position.set(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

      // ----------------------------------------------------
      // 2. TEXT CANVAS TEXTURE GENERATOR (EXPERIENCE STREAM)
      // ----------------------------------------------------
      function createTextTexture(text, isCeiling = false) {
        const canvas = document.createElement("canvas");
        canvas.width = 2048;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");

        // Pitch black background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        if (isCeiling) {
          // Flip vertically so letter tops point towards the ceiling/top edge
          // while preserving Left-to-Right reading order
          ctx.translate(0, canvas.height);
          ctx.scale(1, -1);
        }

        // Heavy high-contrast condensed sans-serif
        ctx.fillStyle = "#ffffff";
        ctx.font = '900 230px "Impact", "Barlow Condensed", "Arial Black", sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const upperText = text.toUpperCase();
        const metrics = ctx.measureText(upperText);
        const leftBound = metrics.actualBoundingBoxLeft ?? metrics.width / 2;
        const rightBound = metrics.actualBoundingBoxRight ?? metrics.width / 2;
        const totalWidth = leftBound + rightBound || metrics.width || 1100;

        // Scale horizontally so the word "EXPERIENCE" extends right till the boundary line
        const targetWidth = canvas.width * 0.985;
        const scaleX = targetWidth / totalWidth;

        const yPos = canvas.height / 2 + (isCeiling ? -8 : 8);
        ctx.translate(canvas.width / 2, yPos);
        ctx.scale(scaleX, 1);
        ctx.fillText(upperText, 0, 0);
        ctx.restore();

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        if (renderer.capabilities.getMaxAnisotropy) {
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        }
        return texture;
      }

      // Top ceiling text texture (flipped vertically so tops of letters touch ceiling)
      const textTextureTop = createTextTexture("EXPERIENCE", true);
      textTextureTop.repeat.set(1, 32);

      // Bottom floor text texture (regular upright reading towards vanishing point)
      const textTextureBottom = createTextTexture("EXPERIENCE", false);
      textTextureBottom.repeat.set(1, 32);

      // Faint grey text texture for background depth layers
      function createFaintTextTexture(text) {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(200, 200, 200, 0.4)";
        ctx.font = '900 110px "Impact", "Arial Black", sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
      }
      const faintTexture = createFaintTextTexture("EXPERIENCE");

      // ----------------------------------------------------
      // 3. TOP & BOTTOM PLANES (CEILING & FLOOR)
      // ----------------------------------------------------
      const tunnelGroup = new THREE.Group();
      scene.add(tunnelGroup);

      const planeWidth = 24;
      const gapHeight = 9.2;
      const tunnelLength = 650;
      const tunnelCenterZ = -280; // Spans from z = +45 to z = -605

      const planeGeometry = new THREE.PlaneGeometry(planeWidth, tunnelLength, 1, 64);

      // Top Plane (Ceiling)
      const ceilingMat = new THREE.MeshBasicMaterial({
        map: textTextureTop,
        side: THREE.DoubleSide,
        transparent: false,
      });
      const ceiling = new THREE.Mesh(planeGeometry, ceilingMat);
      ceiling.position.set(0, gapHeight / 2, tunnelCenterZ);
      ceiling.rotation.x = Math.PI / 2;
      tunnelGroup.add(ceiling);

      // Bottom Plane (Floor)
      const floorMat = new THREE.MeshBasicMaterial({
        map: textTextureBottom,
        side: THREE.DoubleSide,
        transparent: false,
      });
      const floor = new THREE.Mesh(planeGeometry, floorMat);
      floor.position.set(0, -gapHeight / 2, tunnelCenterZ);
      floor.rotation.x = -Math.PI / 2;
      floor.scale.x = 1; // Direct left-to-right reading order
      tunnelGroup.add(floor);

      // ----------------------------------------------------
      // 4. RECEDING GLOWING WIREFRAME PORTAL FRAMES
      // ----------------------------------------------------
      const portalGroup = new THREE.Group();
      tunnelGroup.add(portalGroup);

      const portalZPositions = [-50, -115, -180, -250, -320];
      const portalW = 16.5;
      const portalH = 8.2;

      function createPortalFrame(w, h, zPos, isFocal) {
        const frame = new THREE.Group();
        frame.position.set(0, 0, zPos);

        const hw = w / 2;
        const hh = h / 2;

        // Glowing rectangle border
        const borderPts = [
          new THREE.Vector3(-hw, hh, 0),
          new THREE.Vector3(hw, hh, 0),
          new THREE.Vector3(hw, -hh, 0),
          new THREE.Vector3(-hw, -hh, 0),
          new THREE.Vector3(-hw, hh, 0),
        ];
        const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPts);
        const borderMat = new THREE.LineBasicMaterial({
          color: isFocal ? 0xf5c26b : 0xe6be8a,
          transparent: true,
          opacity: isFocal ? 0.95 : 0.65,
        });
        frame.add(new THREE.Line(borderGeo, borderMat));

        // Corner 'X' marks at each vertex
        const cSize = isFocal ? 0.45 : 0.6;
        const corners = [
          [-hw, hh],
          [hw, hh],
          [hw, -hh],
          [-hw, -hh],
        ];

        corners.forEach(([cx, cy]) => {
          const xPts = [
            new THREE.Vector3(cx - cSize, cy - cSize, 0.01),
            new THREE.Vector3(cx + cSize, cy + cSize, 0.01),
            new THREE.Vector3(cx, cy, 0.01),
            new THREE.Vector3(cx - cSize, cy + cSize, 0.01),
            new THREE.Vector3(cx + cSize, cy - cSize, 0.01),
          ];
          const xGeo = new THREE.BufferGeometry().setFromPoints(xPts);
          const xMat = new THREE.LineBasicMaterial({
            color: isFocal ? 0xffffff : 0xdfb16c,
            transparent: true,
            opacity: 0.85,
          });
          frame.add(new THREE.Line(xGeo, xMat));
        });

        return frame;
      }

      portalZPositions.forEach((zPos, idx) => {
        const isFocal = idx === portalZPositions.length - 1;
        portalGroup.add(createPortalFrame(portalW, portalH, zPos, isFocal));
      });

      // Perspective guide lines from inner portal to screen entry
      const focalZ = -320;
      const rayPts = [
        new THREE.Vector3(-portalW / 2, portalH / 2, focalZ),
        new THREE.Vector3(-planeWidth / 2, gapHeight / 2, 20),

        new THREE.Vector3(portalW / 2, portalH / 2, focalZ),
        new THREE.Vector3(planeWidth / 2, gapHeight / 2, 20),

        new THREE.Vector3(-portalW / 2, -portalH / 2, focalZ),
        new THREE.Vector3(-planeWidth / 2, -gapHeight / 2, 20),

        new THREE.Vector3(portalW / 2, -portalH / 2, focalZ),
        new THREE.Vector3(planeWidth / 2, -gapHeight / 2, 20),
      ];
      const rayGeo = new THREE.BufferGeometry().setFromPoints(rayPts);
      const rayMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.22,
      });
      tunnelGroup.add(new THREE.LineSegments(rayGeo, rayMat));

      // ----------------------------------------------------
      // 5. CENTER FOCAL PORTRAIT CARD & EDITORIAL ACCENTS
      // ----------------------------------------------------
      const focalCardGroup = new THREE.Group();
      focalCardGroup.position.set(0, 0, -322);
      tunnelGroup.add(focalCardGroup);

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        "/assets/experience/fashion-portrait.jpg",
        (portraitTexture) => {
          portraitTexture.generateMipmaps = true;
          portraitTexture.minFilter = THREE.LinearMipmapLinearFilter;

          const cardW = 3.6;
          const cardH = 4.4;
          const cardGeo = new THREE.PlaneGeometry(cardW, cardH);
          const cardMat = new THREE.MeshBasicMaterial({
            map: portraitTexture,
            side: THREE.FrontSide,
          });
          const cardMesh = new THREE.Mesh(cardGeo, cardMat);
          focalCardGroup.add(cardMesh);

          // Golden border outline around photo
          const halfCW = cardW / 2;
          const halfCH = cardH / 2;
          const cardBorderPts = [
            new THREE.Vector3(-halfCW, halfCH, 0.02),
            new THREE.Vector3(halfCW, halfCH, 0.02),
            new THREE.Vector3(halfCW, -halfCH, 0.02),
            new THREE.Vector3(-halfCW, -halfCH, 0.02),
            new THREE.Vector3(-halfCW, halfCH, 0.02),
          ];
          const cBorderGeo = new THREE.BufferGeometry().setFromPoints(cardBorderPts);
          const cBorderMat = new THREE.LineBasicMaterial({
            color: 0xf5c26b,
          });
          focalCardGroup.add(new THREE.Line(cBorderGeo, cBorderMat));

          // Corner 'X' accents on photo frame
          const pCorners = [
            [-halfCW, halfCH],
            [halfCW, halfCH],
            [halfCW, -halfCH],
            [-halfCW, -halfCH],
          ];
          const pCrossSize = 0.35;
          pCorners.forEach(([cx, cy]) => {
            const pts = [
              new THREE.Vector3(cx - pCrossSize, cy - pCrossSize, 0.04),
              new THREE.Vector3(cx + pCrossSize, cy + pCrossSize, 0.04),
              new THREE.Vector3(cx, cy, 0.04),
              new THREE.Vector3(cx - pCrossSize, cy + pCrossSize, 0.04),
              new THREE.Vector3(cx + pCrossSize, cy - pCrossSize, 0.04),
            ];
            const pCrossGeo = new THREE.BufferGeometry().setFromPoints(pts);
            const pCrossMat = new THREE.LineBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.9,
            });
            focalCardGroup.add(new THREE.Line(pCrossGeo, pCrossMat));
          });
        }
      );

      // Faint background text echoes above and below card
      const faintMat = new THREE.MeshBasicMaterial({
        map: faintTexture,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });
      const faintTop = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 1.2), faintMat);
      faintTop.position.set(0, 3.0, -321.8);
      focalCardGroup.add(faintTop);

      const faintBottom = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 1.2), faintMat);
      faintBottom.position.set(0, -3.0, -321.8);
      focalCardGroup.add(faintBottom);

      // Sketch arrow pointing right
      const arrowPts = [
        new THREE.Vector3(2.5, 0, 0.02),
        new THREE.Vector3(3.8, 0, 0.02),
        new THREE.Vector3(3.4, 0.28, 0.02),
        new THREE.Vector3(3.8, 0, 0.02),
        new THREE.Vector3(3.4, -0.28, 0.02),
      ];
      const arrowGeo = new THREE.BufferGeometry().setFromPoints(arrowPts);
      const arrowMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.75,
      });
      focalCardGroup.add(new THREE.Line(arrowGeo, arrowMat));

      // 4-Point Star Sparkle on bottom right
      function createStarSparkle(x, y, z, size) {
        const star = new THREE.Group();
        star.position.set(x, y, z);
        const pts = [
          new THREE.Vector3(-size, 0, 0),
          new THREE.Vector3(size, 0, 0),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, -size, 0),
          new THREE.Vector3(0, size, 0),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(-size * 0.4, -size * 0.4, 0),
          new THREE.Vector3(size * 0.4, size * 0.4, 0),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(-size * 0.4, size * 0.4, 0),
          new THREE.Vector3(size * 0.4, -size * 0.4, 0),
        ];
        const sGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const sMat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.8,
        });
        star.add(new THREE.Line(sGeo, sMat));
        return star;
      }
      const sparkle = createStarSparkle(7.2, -3.8, -320, 0.55);
      tunnelGroup.add(sparkle);

      // Monogram logo "N" in bottom right corner
      const nPts = [
        new THREE.Vector3(8.2, -4.4, -320),
        new THREE.Vector3(8.2, -3.8, -320),
        new THREE.Vector3(8.7, -4.4, -320),
        new THREE.Vector3(8.7, -3.8, -320),
      ];
      const nGeo = new THREE.BufferGeometry().setFromPoints(nPts);
      const nMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
      });
      tunnelGroup.add(new THREE.Line(nGeo, nMat));

      // ----------------------------------------------------
      // 6. GSAP SCROLLTRIGGER ANIMATION
      // ----------------------------------------------------
      const scrollAnim = {
        zProgress: 0,
        textOffset: 0,
      };

      const maxCameraZ = 290;
      const maxTextOffset = 7.5;

      const st = ScrollTrigger.create({
        trigger: trackRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress;

          // Camera moves forward down Z
          scrollAnim.zProgress = p * maxCameraZ;
          camera.position.z = -scrollAnim.zProgress;

          // Text streams dynamically in sync with scroll
          scrollAnim.textOffset = p * maxTextOffset;
          textTextureTop.offset.y = scrollAnim.textOffset;
          textTextureBottom.offset.y = scrollAnim.textOffset;

          // Update HUD readout
          if (progressTextRef.current) {
            progressTextRef.current.textContent = `${Math.round(p * 100).toString().padStart(3, "0")}%`;
          }
        },
      });

      // Ensure ScrollTrigger accurately calculates start position after preceding sections settle
      ScrollTrigger.refresh();
      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
      const onWindowLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onWindowLoad);

      // ----------------------------------------------------
      // 7. MOUSE PARALLAX & RENDER LOOP
      // ----------------------------------------------------
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (e) => {
        const halfX = window.innerWidth / 2;
        const halfY = window.innerHeight / 2;
        targetX = (e.clientX - halfX) / halfX;
        targetY = (e.clientY - halfY) / halfY;
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      let animId;
      const animate = () => {
        animId = requestAnimationFrame(animate);

        // Smooth cursor lerp for organic 3D dynamic tilt
        mouseX += (targetX - mouseX) * 0.04;
        mouseY += (targetY - mouseY) * 0.04;

        camera.position.x = mouseX * 0.6;
        camera.position.y = -mouseY * 0.35;
        camera.rotation.y = -mouseX * 0.02;
        camera.rotation.x = mouseY * 0.02;

        if (sparkle) {
          sparkle.rotation.z += 0.012;
        }

        renderer.render(scene, camera);
      };
      animate();

      // ----------------------------------------------------
      // 8. RESIZE HANDLER
      // ----------------------------------------------------
      const handleResize = () => {
        if (!container) return;
        const curW = container.clientWidth || window.innerWidth;
        const curH = container.clientHeight || window.innerHeight;

        camera.aspect = curW / curH;
        camera.updateProjectionMatrix();

        renderer.setSize(curW, curH);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };

      window.addEventListener("resize", handleResize);

      // ----------------------------------------------------
      // 9. CLEANUP ON UNMOUNT
      // ----------------------------------------------------
      return () => {
        clearTimeout(refreshTimeout);
        window.removeEventListener("load", onWindowLoad);
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        if (st) st.kill();

        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });

        textTextureTop.dispose();
        textTextureBottom.dispose();
        faintTexture.dispose();
        renderer.dispose();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="experience-tunnel-section">
      <div ref={trackRef} className="experience-tunnel-scroll-track">
        <div className="experience-tunnel-viewport">
          <div
            ref={containerRef}
            className="experience-tunnel-canvas-container"
          />

          {/* Vignette & Depth Side Shading */}
          <div className="experience-tunnel-vignette" />
          <div className="experience-tunnel-side-shadows" />

          {/* Editorial HUD Overlay */}
          <div className="experience-tunnel-hud">
            <div className="experience-tunnel-hud-top">
              <div className="experience-tunnel-hud-tag">
                <span className="experience-tunnel-hud-dot" />
                <span>3D Stream // Mirror Corridor</span>
              </div>
              <div className="experience-tunnel-hud-coords">
                LAT: 40.7128° N // LON: 74.0060° W
              </div>
            </div>

            <div className="experience-tunnel-hud-bottom">
              <div className="experience-tunnel-hud-hint">
                <span>[ Scroll to Traverse ]</span>
              </div>
              <div
                ref={progressTextRef}
                className="experience-tunnel-hud-progress"
              >
                000%
              </div>
              <div className="experience-tunnel-hud-corner-logo">SURYA // EXP</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
