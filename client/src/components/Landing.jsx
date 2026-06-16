import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Landing.module.css";

export default function Landing({ onLaunch }) {
  const [progress, setProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef(null);
  const startRef = useRef(0);
  const holdMs = 1500;

  function handleMouseMove(e) {
    setIsHovering(true);
    // Bind exact screen coordinates to global CSS variables for the mask
    document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
    document.documentElement.style.setProperty("--my", `${e.clientY}px`);
  }

  function handleMouseLeave() {
    setIsHovering(false);
  }

  // --- IGNITION LOGIC ---
  const onPointerDown = () => {
    startRef.current = performance.now();
    timerRef.current = requestAnimationFrame(function tick(now) {
      const elapsed = now - startRef.current;
      const p = Math.min(100, (elapsed / holdMs) * 100);
      setProgress(p);
      if (p >= 100) {
        setProgress(100);
        onLaunch();
        return;
      }
      timerRef.current = requestAnimationFrame(tick);
    });
  };

  const onPointerUp = () => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    setProgress(0);
  };

  return (
    <section
      className={styles.landing}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Syncs the global Starfield fade-in to the hover state */}
      <style>{`
        .intro-mode .starfield {
          opacity: ${isHovering ? 1 : 0};
          transition: opacity 0.8s ease;
        }
      `}</style>

      {/* Global Red Flashlight Glow (Background Layer) */}
      <div
        className={styles.flashlightBg}
        style={{ opacity: isHovering ? 1 : 0 }}
      />

      {/* The Radar Hint (Disappears completely when mouse moves) */}
      <div className={styles.hintText} >
        [ FIND THE ACCESS COMMAND TO ENTER THE SYSTEM ]
      </div>

      {/* 
        THE EXACT REVEAL LAYER
        This entire container is masked. You will only see the contents
        when the radial mask (tied to your mouse) sweeps over them.
      */}
      <div
        className={styles.maskedContent}
        style={{ opacity: isHovering ? 1 : 0 }}
      >
        <div className={styles.landingCopy}>
          <p className={styles.badge}>THE AIRLOCK</p>
          <h1 className={styles.title}>ENTER COMMAND PROTOCOL</h1>
          <p className={styles.subtitle}>
            Hold the ignition switch. The starfield will reveal the dark beyond.
          </p>
        </div>

        <motion.button
          className={styles.launchButton}
          whileTap={{ scale: 0.98 }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <span className={styles.launchLabel}>ACCESS COMMAND</span>
          <span className={styles.progress} style={{ width: `${progress}%` }} />

          {progress > 0 && (
            <div
              className={styles.progressGlow}
              style={{ left: `${progress}%` }}
            />
          )}
        </motion.button>
      </div>
    </section>
  );
}
