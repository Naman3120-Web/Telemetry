import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Snowflake, Wind } from "lucide-react";
import styles from "./Relax.module.css";

export default function Relax() {
  const INITIAL_TIME = 5 * 60;
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_TIME);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("AWAITING SYNC");

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          setPhase("CYCLE COMPLETE");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // --- BREATHING PHASE CALCULATOR ---
  useEffect(() => {
    if (!running) {
      if (secondsLeft === INITIAL_TIME) setPhase("AWAITING SYNC");
      return;
    }

    const cycleTime = secondsLeft % 16;
    if (cycleTime >= 12) setPhase("INHALE...");
    else if (cycleTime >= 8) setPhase("HOLD...");
    else if (cycleTime >= 4) setPhase("EXHALE...");
    else setPhase("HOLD...");
  }, [secondsLeft, running, INITIAL_TIME]);

  const toggleTimer = () => setRunning(!running);
  const resetTimer = () => {
    setRunning(false);
    setSecondsLeft(INITIAL_TIME);
    setPhase("AWAITING SYNC");
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className={styles.relaxShell}>
      <motion.div
        className={`premium-card ${styles.relaxCard}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* 70% Functional / 30% Lore Typography */}
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <Snowflake className={styles.headerIcon} size={24} />
            <h2 className={styles.pageTitle}>Guided Breathing</h2>
          </div>
          <span className={styles.loreTag}>Protocol: Cryo-Chamber</span>
        </div>

        <p className={styles.subtitle}>
          Lower your heart rate. Sync your breathing to the visual core to
          restore focus.
        </p>

        {/* --- BREATHING CORE VISUAL --- */}
        <div className={styles.coreContainer}>
          {/* Inner pulsating core */}
          <motion.div
            className={styles.coreRing}
            animate={
              running
                ? {
                    scale: [1, 1.8, 1.8, 1, 1], // Inhale, Hold, Exhale, Hold
                    opacity: [0.3, 0.8, 0.8, 0.3, 0.3],
                  }
                : { scale: 1, opacity: 0.3 }
            }
            transition={
              running
                ? {
                    duration: 16,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.25, 0.5, 0.75, 1], // Matches the 16s breathing phases
                  }
                : {}
            }
          />

          {/* Static outer containment ring */}
          <div className={styles.outerRing} />

          {/* Dynamic phase text in the center */}
          <div className={styles.phaseReadout}>
            <AnimatePresence mode="wait">
              <motion.span
                key={phase}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {phase}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* --- TIMER & CONTROLS --- */}
        <div className={styles.timerFrame}>
          <div className={styles.timeDisplay}>
            {mm}
            <span className={styles.colon}>:</span>
            {ss}
          </div>
        </div>

        <div className={styles.controls}>
          <button
            className={`launch-btn ${running ? styles.activeBtn : ""}`}
            style={
              !running
                ? {
                    background: "rgba(59, 201, 255, 0.1)",
                    borderColor: "var(--relax-cyan)",
                    color: "var(--relax-cyan)",
                  }
                : {}
            }
            onClick={toggleTimer}
          >
            <Wind size={18} />
            {running ? "Pause Session" : "Start Session"}
          </button>

          {!running && secondsLeft !== INITIAL_TIME && (
            <button className="launch-btn alt" onClick={resetTimer}>
              Reset
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
