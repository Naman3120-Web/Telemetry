import React from "react";
import { motion } from "framer-motion";
import { Clock, Zap, Flame, Activity } from "lucide-react";
import styles from "./Home.module.css";

export default function Home({ user, onQuickLaunch }) {
  // Logic for the visual progress bar
  const currentLevelXp = user.xp % 1000;
  const progressPercentage = (currentLevelXp / 1000) * 100;

  // Staggered boot-up animation
  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      className={styles.homeShell}
      initial="hidden"
      animate="show"
      variants={{ show: { staggerChildren: 0.1 } }}
    >
      {/* --- LEFT COLUMN: USER OVERVIEW & DAILY STATS --- */}
      <div className={styles.leftColumn}>
        {/* The Main Identity Card */}
        <motion.div
          variants={fadeUp}
          className={`premium-card ${styles.heroCard}`}
        >
          <div className={styles.heroHeader}>
            <p className={styles.heroTitle}>Dashboard</p>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot} /> SYNCED
            </div>
          </div>

          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={styles.greeting}>Welcome back, {user.username}</p>
              <p className={styles.levelTag}>Level {user.level} Pilot</p>
            </div>
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.progressHeader}>
              <span>{user.xp.toLocaleString()} Total XP</span>
              <span className={styles.goldText}>
                {currentLevelXp} / 1000 to Rank Up
              </span>
            </div>
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <button
            className={`launch-btn ${styles.massiveBtn}`}
            onClick={onQuickLaunch}
          >
            Start Focus Session
          </button>
        </motion.div>

        {/* Daily Stats Grid */}
        <motion.div variants={fadeUp} className={styles.statsGrid}>
          <div className={`premium-card ${styles.statBox}`}>
            <Clock
              size={20}
              className={styles.statIcon}
              style={{ color: "var(--relax-cyan)" }}
            />
            <p className={styles.statVal}>2h 15m</p>
            <p className={styles.statLabel}>Focus Today</p>
          </div>
          <div className={`premium-card ${styles.statBox}`}>
            <Flame
              size={20}
              className={styles.statIcon}
              style={{ color: "var(--accent-red)" }}
            />
            <p className={styles.statVal}>4 Days</p>
            <p className={styles.statLabel}>Current Streak</p>
          </div>
        </motion.div>
      </div>

      {/* --- RIGHT COLUMN: ACTIVITY FEED --- */}
      <div className={styles.rightColumn}>
        <motion.div
          variants={fadeUp}
          className={`premium-card ${styles.activityCard}`}
        >
          <h3 className={styles.sectionTitle}>Recent Activity</h3>

          <div className={styles.activityLog}>
            {/* Success Entry */}
            <div className={styles.logEntry}>
              <div
                className={styles.logIcon}
                style={{
                  background: "var(--success-dim)",
                  color: "var(--success)",
                }}
              >
                <Zap size={16} />
              </div>
              <div className={styles.logDetails}>
                <p>Completed Focus Session</p>
                <span>Today, 10:42 AM</span>
              </div>
              <div className={styles.logXp}>+25 XP</div>
            </div>

            {/* Penalty Entry */}
            <div className={styles.logEntry}>
              <div
                className={styles.logIcon}
                style={{
                  background: "var(--accent-red-dim)",
                  color: "var(--accent-red)",
                }}
              >
                <Activity size={16} />
              </div>
              <div className={styles.logDetails}>
                <p>Focus Breach (Tab Switched)</p>
                <span>Yesterday, 2:15 PM</span>
              </div>
              <div className={styles.logXpNegative}>-10 XP</div>
            </div>

            {/* Recovery Entry */}
            <div className={styles.logEntry}>
              <div
                className={styles.logIcon}
                style={{
                  background: "rgba(59, 201, 255, 0.15)",
                  color: "var(--relax-cyan)",
                }}
              >
                <Clock size={16} />
              </div>
              <div className={styles.logDetails}>
                <p>Cryo-Chamber Recovery</p>
                <span>Yesterday, 1:00 PM</span>
              </div>
              <div className={styles.logXp}>+10 XP</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
