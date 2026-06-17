import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import styles from "./Focus.module.css";

export default function Focus({ awardXP }) {
  const FOCUS_MS = 25 * 60;
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MS);
  const [running, setRunning] = useState(false);
  const [task, setTask] = useState("");

  // New Penalty States
  const [pauseCountdown, setPauseCountdown] = useState(null);
  const [missionFailed, setMissionFailed] = useState(null);
  const [chromatic, setChromatic] = useState(false);

  const intervalRef = useRef(null);
  const pauseIntervalRef = useRef(null);
  const sliderControls = useAnimation();

  // --- 1. TAB SWITCH PENALTY (HULL BREACH) ---
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden && running) {
        setRunning(false);
        setPauseCountdown(null);
        awardXP(-10); // Deduct 10 XP
        setSecondsLeft(FOCUS_MS);
        sliderControls.start({ x: 0 });
        setMissionFailed("HULL BREACH DETECTED. MISSION ABORTED. -10 XP.");
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [running, awardXP, FOCUS_MS, sliderControls]);

  // --- 2. MAIN TIMER LOOP ---
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            awardXP(25); // Reward 25 XP
            setSecondsLeft(FOCUS_MS);
            sliderControls.start({ x: 0 });
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, awardXP, FOCUS_MS, sliderControls]);

  // --- 3. PAUSE PENALTY LOOP ---
  useEffect(() => {
    if (pauseCountdown !== null && !running) {
      pauseIntervalRef.current = setInterval(() => {
        setPauseCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(pauseIntervalRef.current);
            awardXP(-5); // Deduct 5 XP for taking too long
            setSecondsLeft(FOCUS_MS);
            sliderControls.start({ x: 0 });
            setMissionFailed("CRITICAL ENGINE COOLING. MISSION LOST. -5 XP.");
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(pauseIntervalRef.current);
    }
    return () => clearInterval(pauseIntervalRef.current);
  }, [pauseCountdown, running, awardXP, FOCUS_MS, sliderControls]);

  // --- CONTROLS ---
  const engage = () => {
    setMissionFailed(null);
    setPauseCountdown(null);
    setRunning(true);
    setChromatic(true);
    setTimeout(() => setChromatic(false), 200);
  };

  const pause = () => {
    setRunning(false);
    setPauseCountdown(60); // Start 60-second penalty clock
  };

  const resume = () => {
    setPauseCountdown(null);
    engage();
  };

  const reset = () => {
    setRunning(false);
    setPauseCountdown(null);
    setSecondsLeft(FOCUS_MS);
    sliderControls.start({ x: 0 });
  };

  const handleDragEnd = (event, info) => {
    const dragThreshold = 180;
    if (info.offset.x >= dragThreshold) {
      engage();
      sliderControls.start({ x: 220 });
    } else {
      sliderControls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
    }
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const isPristine =
    secondsLeft === FOCUS_MS && !running && pauseCountdown === null;

  return (
    <div className={styles.focusShell}>
      <motion.div
        className={`${styles.focusCard} ${chromatic ? styles.glitchEffect : ""}`}
        animate={chromatic ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.2 }}
      >
        {/* PENALTY OVERLAY */}
        <AnimatePresence>
          {missionFailed && (
            <motion.div
              className={styles.failureOverlay}
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0 }}
            >
              <h3 className={styles.failureText}>{missionFailed}</h3>
              <button
                className="launch-btn alt"
                onClick={() => setMissionFailed(null)}
              >
                Acknowledge
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className={styles.focusTitle}>Solo Hyperspace<br/>(POMODARO SESSION)</h2>
        <p className="panel-copy">
          Write Your Mission Here:
          <input
            className={styles.taskInput}
            placeholder="Eg. coding"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={running || pauseCountdown !== null}
          />
        </p>

        <div className={styles.timerFrame}>
          <div className={styles.timeDisplay}>
            <div style={{ display: "flex", overflow: "hidden" }}>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={mm}
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {mm}
                </motion.span>
              </AnimatePresence>
            </div>
            <span
              className={styles.colon}
              style={{ opacity: running ? 0.5 : 1 }}
            >
              :
            </span>
            <div style={{ display: "flex", overflow: "hidden" }}>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={ss}
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {ss}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          {running && <div className={styles.warpEffect} />}
        </div>

        {/* 60s PAUSE WARNING */}
        <AnimatePresence>
          {pauseCountdown !== null && (
            <motion.div
              className={styles.pauseWarning}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              ⚠ ENGINES STALLED. RESUME IN <span>{pauseCountdown}s</span> OR
              MISSION FAILS.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="timer-controls" style={{ marginTop: "24px" }}>
          {isPristine && (
            <div className={styles.sliderLine}>
              <motion.div
                className={styles.engageHandle}
                drag="x"
                dragConstraints={{ left: 0, right: 220 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                animate={sliderControls}
                whileTap={{ cursor: "grabbing" }}
              >
                ►
              </motion.div>
              <div className={styles.engageHint}>Drag to Engage</div>
            </div>
          )}

          {running && (
            <button className="launch-btn" type="button" onClick={pause}>
              Abort Jump (Pause)
            </button>
          )}

          {pauseCountdown !== null && (
            <>
              <button
                className="launch-btn"
                style={{ background: "#16a34a" }}
                type="button"
                onClick={resume}
              >
                Resume Jump
              </button>
              <button className="launch-btn alt" type="button" onClick={reset}>
                Surrender
              </button>
            </>
          )}
        </div>

        <p className="panel-copy small" style={{ marginTop: "16px" }}>
          Complete the session to earn +25 XP. Navigation breaches result in XP
          loss.
        </p>
      </motion.div>
    </div>
  );
}
