import React from "react";
import { motion } from "framer-motion";
import styles from "./Home.module.css";

export default function Home({ user, onQuickLaunch }) {
  // Calculate progress to next level (1 Level = 1000 XP)
  const currentLevelXp = user.xp % 1000;
  const progressPercentage = (currentLevelXp / 1000) * 100;

  // Framer Motion variants for a staggered "boot up" effect
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      className={styles.homeShell}
      variants={containerVars}
      initial="hidden"
      animate="show"
    >
      {/* LEFT COLUMN: PILOT PROFILE */}
      <div className={styles.leftColumn}>
        <motion.div variants={itemVars} className={styles.heroCard}>
          <div className={styles.heroHeader}>
            <p className={styles.heroTitle}>Bridge Access Ready</p>
            <div className={styles.statusDot} />
          </div>
          <p className={styles.heroNote}>
            Welcome back,{" "}
            <span className={styles.highlight}>{user.username}</span>. Your
            fleet is standing by with new missions, progression, and cross-ship
            accountability.
          </p>

          <div className={styles.pilotStatus}>
            <div className={styles.statBlock}>
              <p className={styles.statLabel}>Pilot Level</p>
              <p className={styles.statValue}>
                {String(user.level).padStart(2, "0")}
              </p>
            </div>
            <div className={styles.statBlock}>
              <p className={styles.statLabel}>Total XP</p>
              <p className={styles.statValue}>{user.xp.toLocaleString()}</p>
            </div>
          </div>

          {/* New Visual XP Progress Bar */}
          <div className={styles.progressContainer}>
            <div className={styles.progressHeader}>
              <span>Next Rank (Lvl {user.level + 1})</span>
              <span>{currentLevelXp} / 1000 XP</span>
            </div>
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </div>

          <button
            className={`launch-btn ${styles.massiveBtn}`}
            type="button"
            onClick={onQuickLaunch}
          >
            ► Engage Hyperspace
          </button>
        </motion.div>
      </div>

      {/* RIGHT COLUMN: TACTICAL DATA */}
      <div className={styles.rightColumn}>
        <motion.div variants={itemVars} className={styles.statsCard}>
          <p className={styles.statsTitle}>Mission Control</p>
          <div className={styles.logItem}>
            <span>Next Reward:</span>
            <span className={styles.rewardTag}>+25 XP</span>
          </div>
          <div className={styles.logItem}>
            <span>System Status:</span>
            <span className={styles.statusTag}>NOMINAL</span>
          </div>
          <div className={styles.logItem}>
            <span>Cooldown:</span>
            <span className={styles.infoTag}>Relax Mode Ready</span>
          </div>
        </motion.div>

        <motion.div variants={itemVars} className={styles.leaderboardCard}>
          <p className={styles.leaderTitle}>Fleet Leaderboard</p>
          <div className={styles.leaderItem}>
            <span className={styles.rankBadge}>1</span>
            <span className={styles.pilotName}>Commander Nova</span>
            <span className={styles.pilotXp}>12,400 XP</span>
          </div>
          <div className={styles.leaderItem}>
            <span
              className={styles.rankBadge}
              style={{ color: "#9ca3af", borderColor: "#9ca3af" }}
            >
              2
            </span>
            <span className={styles.pilotName}>Captain Flux</span>
            <span className={styles.pilotXp}>11,800 XP</span>
          </div>
          <div className={`${styles.leaderItem} ${styles.currentUser}`}>
            <span
              className={styles.rankBadge}
              style={{ color: "#dc2626", borderColor: "#dc2626" }}
            >
              —
            </span>
            <span className={styles.pilotName}>{user.username} (You)</span>
            <span className={styles.pilotXp}>{user.xp} XP</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
