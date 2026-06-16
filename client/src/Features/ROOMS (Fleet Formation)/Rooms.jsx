import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Radio, MessageSquare, ShieldAlert } from "lucide-react";
import styles from "./Rooms.module.css";

export default function Rooms({ user }) {
  // Mock Data
  const [rooms] = useState([
    {
      id: "alpha",
      name: "Deep Work Alpha",
      host: "Commander Nova",
      participants: ["Nova", user.username, "Echo"],
      status: "waiting",
    },
    {
      id: "beta",
      name: "Focus Beta",
      host: "Captain Flux",
      participants: ["Flux"],
      status: "in-jump",
    },
    {
      id: "gamma",
      name: "Late Night Coders",
      host: "Cipher",
      participants: ["Cipher", "Ghost", "Spectre"],
      status: "waiting",
    },
  ]);

  const [current, setCurrent] = useState(null);
  const [roomTimer, setRoomTimer] = useState({
    running: false,
    seconds: 25 * 60,
  });
  const [chatInput, setChatInput] = useState("");

  const join = (r) => setCurrent(r);
  const leave = () => {
    setCurrent(null);
    setRoomTimer({ running: false, seconds: 25 * 60 });
  };
  const hostStart = () => setRoomTimer({ running: true, seconds: 25 * 60 });

  // Framer Motion Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className={styles.roomsShell}>
      <AnimatePresence mode="wait">
        {/* --- VIEW 1: FLEET RADAR (LOBBY LIST) --- */}
        {!current ? (
          <motion.div
            key="browser"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="exit"
            className={styles.radarContainer}
          >
            <div className={styles.radarHeader}>
              <Radio className={styles.radarIcon} size={24} />
              <h2>Active Fleet Radar</h2>
              <span className={styles.pulseDot} />
            </div>

            <div className={styles.roomGrid}>
              {rooms.map((r) => (
                <div key={r.id} className={styles.roomCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>{r.name}</div>
                    <div
                      className={
                        r.status === "in-jump"
                          ? styles.badgeActive
                          : styles.badgeWaiting
                      }
                    >
                      {r.status === "in-jump" ? "IN JUMP" : "AWAITING"}
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.hostLine}>
                      Host: <span>{r.host}</span>
                    </div>
                    <div className={styles.crewLine}>
                      <Users size={16} /> {r.participants.length} Pilots Docked
                    </div>
                  </div>

                  <button
                    className={`launch-btn small ${styles.joinBtn}`}
                    onClick={() => join(r)}
                  >
                    Request Docking
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* --- VIEW 2: ACTIVE BRIDGE (INSIDE ROOM) --- */
          <motion.div
            key="room"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="exit"
            className={styles.activeRoom}
          >
            {/* ROOM HEADER & MASTER TIMER */}
            <div className={styles.roomHeader}>
              <div>
                <h2 className={styles.roomTitle}>{current.name}</h2>
                <p className={styles.roomSubtitle}>Host: {current.host}</p>
              </div>
              <div className={styles.masterTimer}>
                {roomTimer.running
                  ? `${Math.floor(roomTimer.seconds / 60)}:${String(roomTimer.seconds % 60).padStart(2, "0")}`
                  : "00:00"}
              </div>
              <div className={styles.roomControls}>
                {!roomTimer.running && (
                  <button className="launch-btn small" onClick={hostStart}>
                    Initiate Sync
                  </button>
                )}
                <button className="launch-btn alt small" onClick={leave}>
                  Sever Link
                </button>
              </div>
            </div>

            <div className={styles.roomLayout}>
              {/* LEFT: PILOT GRID (WebRTC Placeholder) */}
              <div className={styles.pilotGrid}>
                {current.participants.map((p, i) => (
                  <div key={i} className={styles.pilotSeat}>
                    <div className={styles.avatarPlaceholder} />
                    <span className={styles.pilotName}>{p}</span>
                    <span className={styles.ping}>
                      PING: {Math.floor(Math.random() * 40 + 12)}ms
                    </span>
                  </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: 6 - current.participants.length }).map(
                  (_, i) => (
                    <div key={`empty-${i}`} className={styles.pilotSeatEmpty}>
                      Open Seat
                    </div>
                  ),
                )}
              </div>

              {/* RIGHT: COMMS LINK (Chat) */}
              <div className={styles.commsPanel}>
                <div className={styles.commsHeader}>
                  <MessageSquare size={16} /> Comms Link
                </div>

                <div className={styles.chatHistory}>
                  <div className={styles.sysMessage}>
                    Connection established with Fleet server.
                  </div>
                  <div className={styles.chatMessage}>
                    <b>{current.host}:</b> Ready for the next jump?
                  </div>
                </div>

                <div className={styles.chatInputArea}>
                  {roomTimer.running ? (
                    <div className={styles.commsDisabled}>
                      <ShieldAlert size={16} /> COMMS OFFLINE DURING HYPERSPACE
                    </div>
                  ) : (
                    <input
                      type="text"
                      className={styles.chatInput}
                      placeholder="Transmit message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
