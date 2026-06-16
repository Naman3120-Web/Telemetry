import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Award,
  ShieldAlert,
  Terminal,
  CheckCircle2,
  Edit2,
} from "lucide-react";
import styles from "./Profile.module.css";

// Ranking Utility Function
export function getPilotRank(xp) {
  const level = Math.max(0, Math.floor(xp / 1000));
  let title = "Cadet";

  if (level >= 50) title = "Admiral of the Void";
  else if (level >= 35) title = "Fleet Commander";
  else if (level >= 20) title = "Captain";
  else if (level >= 10) title = "Vanguard";
  else if (level >= 5) title = "Telemetry Pilot";

  return { level, title };
}

export default function Profile({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.username);

  const handleSaveName = () => {
    if (newName.trim().length > 0) {
      setUser((prev) => ({ ...prev, username: newName.trim() }));
    } else {
      setNewName(user.username); // Revert if empty
    }
    setIsEditing(false);
  };

  const rankInfo = getPilotRank(user.xp);
  const currentLevelXp = user.xp % 1000;
  const progress = (currentLevelXp / 1000) * 100;

  // Framer Motion initial animation
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className={styles.profileShell}>
      <motion.div
        className={styles.profileLayout}
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        {/* --- LEFT COLUMN: DOSSIER --- */}
        <div className={styles.leftColumn}>
          <motion.div variants={fadeUp} className={styles.dossierCard}>
            <div className={styles.cardHeader}>
              <User className={styles.headerIcon} size={20} />
              <h2>Pilot Dossier</h2>
            </div>

            <div className={styles.avatarSection}>
              <div className={styles.avatarNode}>
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div className={styles.nameBlock}>
                {isEditing ? (
                  <div className={styles.editRow}>
                    <input
                      type="text"
                      className={styles.nameInput}
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      maxLength={16}
                      autoFocus
                    />
                    <button className={styles.saveBtn} onClick={handleSaveName}>
                      Save
                    </button>
                  </div>
                ) : (
                  <div className={styles.displayRow}>
                    <h3 className={styles.callsign}>{user.username}</h3>
                    <button
                      className={styles.editBtn}
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
                {/* Dynamic Rank Display */}
                <p className={styles.rankTitle}>
                  {rankInfo.title} — Rank {rankInfo.level}
                </p>
              </div>
            </div>

            <div className={styles.xpReadout}>
              <div className={styles.xpStats}>
                <span>Total Experience</span>
                <span className={styles.xpNumber}>
                  {user.xp.toLocaleString()} XP
                </span>
              </div>
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className={styles.xpHint}>
                {1000 - currentLevelXp} XP to next rank.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className={styles.badgesCard}>
            <div className={styles.cardHeader}>
              <Award className={styles.headerIcon} size={20} />
              <h2>Service Badges</h2>
            </div>
            <div className={styles.badgeGrid}>
              <div className={`${styles.badge} ${styles.earned}`}>
                <CheckCircle2 size={24} />
                <span>First Jump</span>
              </div>
              <div
                className={`${styles.badge} ${rankInfo.level >= 5 ? styles.earned : styles.locked}`}
              >
                <ShieldAlert size={24} />
                <span>Veteran</span>
              </div>
              <div
                className={`${styles.badge} ${rankInfo.level >= 35 ? styles.earned : styles.locked}`}
              >
                <Terminal size={24} />
                <span>Fleet Cmdr</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN: THE RULEBOOK --- */}
        <div className={styles.rightColumn}>
          <motion.div variants={fadeUp} className={styles.protocolCard}>
            <div className={styles.cardHeader}>
              <Terminal className={styles.headerIconAlt} size={20} />
              <h2>Telemetry XP Protocols</h2>
            </div>
            <p className={styles.protocolIntro}>
              Advancement through the fleet requires absolute focus. Your neural
              link is monitored during all hyperspace jumps. Adhere to the
              following directives to climb the ranks.
            </p>

            <div className={styles.ruleSection}>
              <h3 className={styles.ruleHeading}>
                Positive Reinforcement (Gains)
              </h3>
              <ul className={styles.ruleList}>
                <li>
                  <span className={styles.gainTag}>+25 XP</span>
                  <div className={styles.ruleText}>
                    <strong>Solo Hyperspace Completion</strong>
                    <span>
                      Successfully maintaining focus for a standard 25-minute
                      orbital cycle.
                    </span>
                  </div>
                </li>
                <li>
                  <span className={styles.gainTag}>+30 XP</span>
                  <div className={styles.ruleText}>
                    <strong>Fleet Formation Sync</strong>
                    <span>
                      Completing a focus session while successfully docked with
                      a multiplayer fleet room. (+5 XP Co-op Bonus).
                    </span>
                  </div>
                </li>
                <li>
                  <span className={styles.gainTag}>+10 XP</span>
                  <div className={styles.ruleText}>
                    <strong>Cryo-Chamber Cooldown</strong>
                    <span>
                      Completing a full 5-minute guided breathing cycle to
                      restore neural baseline.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.ruleSection}>
              <h3 className={styles.ruleHeading}>
                Tactical Penalties (Deductions)
              </h3>
              <ul className={styles.ruleList}>
                <li>
                  <span className={styles.lossTag}>-10 XP</span>
                  <div className={styles.ruleText}>
                    <strong>Hull Breach</strong>
                    <span>
                      Navigating away from the dashboard or minimizing the app
                      during an active focus jump. Immediate mission failure.
                    </span>
                  </div>
                </li>
                <li>
                  <span className={styles.lossTag}>-5 XP</span>
                  <div className={styles.ruleText}>
                    <strong>Engine Stall</strong>
                    <span>
                      Leaving the jump sequence paused for longer than 60
                      seconds without resuming.
                    </span>
                  </div>
                </li>
                <li>
                  <span className={styles.lossTag}>-15 XP</span>
                  <div className={styles.ruleText}>
                    <strong>Fleet Desync</strong>
                    <span>
                      Abandoning a multiplayer Fleet Formation room before the
                      shared timer reaches zero.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
