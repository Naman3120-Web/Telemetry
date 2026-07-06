import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { motion } from "framer-motion";
import defaultAvatar from "/assets/default-avatar.avif";
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

export default function Profile({ user, setUser,setIsAuthenticated}) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.username);
  
  /**
   * EJECT PROTOCOL
   * Triggers the backend logout route to destroy the cookie,
   * wipes the local React state, and routes the user back to the airlock (login).
   */
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setIsAuthenticated(false);
      setUser({ username: "Pilot", xp: 0, level: 0 });
      navigate("/login");
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };
  /**
   * CALLSIGN UPDATE PROTOCOL
   * Syncs the new username with the MongoDB database before
   * updating the local React state to ensure data integrity.
   */
  const handleSaveName = async () => {
    const trimmedName = newName.trim();
    if (trimmedName.length > 0 && trimmedName !== user.username) {
      try {
        await api.put("/user/update-username", {
          username: trimmedName,
        });
        setUser((prev) => ({ ...prev, username: trimmedName }));
      } catch (err) {
        console.error("Failed to update callsign:", err);
        setNewName(user.username);
      }
    } else {
      setNewName(user.username);
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
        <div className={styles.leftColumn}>
          <motion.div
            variants={fadeUp}
            className={`premium-card ${styles.dossierCard}`}
          >
            <div className={styles.cardHeader}>
              <div className={styles.titleBlock}>
                <User className={styles.headerIcon} size={22} />
                <h2 className={styles.pageTitle}>Pilot Profile</h2>
              </div>
              <button onClick={handleLogout} className={styles.logout}>
                LOGOUT
              </button>
            </div>

            <div className={styles.avatarSection}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #334155",
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#0f172a",
                }}
              >
                <img
                  src={defaultAvatar}
                  alt="Pilot Avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
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

          <motion.div
            variants={fadeUp}
            className={`premium-card ${styles.badgesCard}`}
            style={{ overflow: "hidden" }} 
          >
             <Award className={styles.headerIcon} size={20} />
            <h2 className={styles.pageTitle}>Achievements</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                width: "100%",
                marginTop: "1rem",
                paddingBottom: "4px",
              }}
            >
              {/* BADGE 1: First Jump */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 4px", // Reduced side padding slightly
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid var(--success, #22c55e)",
                  borderRadius: "8px",
                  textAlign: "center",
                  minWidth: 0, // 🚨 THE FIX: Allows the flex container to shrink below text size
                }}
              >
                <CheckCircle2
                  size={20}
                  color="var(--success, #22c55e)"
                  style={{ marginBottom: "8px", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: "0.65rem", // Slightly smaller to ensure fit
                    color: "var(--success, #22c55e)",
                    fontWeight: "bold",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap", // 🚨 Prevents text from wrapping and breaking height
                    overflow: "hidden",
                    textOverflow: "ellipsis", // Adds "..." if it gets impossibly squished on tiny phones
                    width: "100%",
                  }}
                >
                  FIRST JUMP
                </span>
              </div>

              {/* BADGE 2: Veteran (Locked) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 4px",
                  background: "rgba(0,0,0,0.2)",
                  border: "1px dashed #334155",
                  borderRadius: "8px",
                  textAlign: "center",
                  opacity: 0.5,
                  minWidth: 0, // 🚨 THE FIX
                }}
              >
                <ShieldAlert
                  size={20}
                  color="#64748b"
                  style={{ marginBottom: "8px", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "#64748b",
                    fontWeight: "bold",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                  }}
                >
                  VETERAN
                </span>
              </div>

              {/* BADGE 3: Fleet Cmdr (Locked) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 4px",
                  background: "rgba(0,0,0,0.2)",
                  border: "1px dashed #334155",
                  borderRadius: "8px",
                  textAlign: "center",
                  opacity: 0.5,
                  minWidth: 0, // 🚨 THE FIX
                }}
              >
                <Terminal
                  size={20}
                  color="#64748b"
                  style={{ marginBottom: "8px", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "#64748b",
                    fontWeight: "bold",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                  }}
                >
                  FLEET CMDR
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN: THE RULEBOOK --- */}
        <div className={styles.rightColumn}>
          <motion.div
            variants={fadeUp}
            className={`premium-card ${styles.protocolCard}`}
          >
            <div className={styles.cardHeader}>
              <div className={styles.titleBlock}>
                <Terminal className={styles.headerIconAlt} size={22} />
                <h2 className={styles.pageTitle}>XP Rules</h2>
              </div>
              <span className={styles.loreTag}>Telemetry Protocols</span>
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
                    <strong>Focus Session Completion</strong>
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
                    <strong>Focus Breach</strong>
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
