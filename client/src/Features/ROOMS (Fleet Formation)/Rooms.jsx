import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Radio, Plus, Lock, Clock } from "lucide-react";
import styles from "./Rooms.module.css";

// Realistic Mock Data with varied states
const initialRooms = [
  {
    id: "r1",
    name: "Deep Work Alpha",
    theme: "Engineering",
    host: "Nova",
    capacity: 5,
    members: ["N", "X", "P"], // Initials for avatars
    status: "open",
  },
  {
    id: "r2",
    name: "Midnight Coders",
    theme: "Development",
    host: "Cipher",
    capacity: 8,
    members: ["C", "M"],
    status: "active",
    timeLeft: "14:20",
  },
  {
    id: "r3",
    name: "Finals Grind",
    theme: "Study",
    host: "Flux",
    capacity: 4,
    members: ["F", "A", "R", "L"],
    status: "full",
  },
];

export default function Rooms({ user }) {
  const [rooms] = useState(initialRooms);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className={styles.roomsShell}>
      {/* 70% Functional Header */}
      <div className={styles.headerRow}>
        <div>
          <div className={styles.titleBlock}>
            <Radio className={styles.headerIcon} size={24} />
            <h2 className={styles.pageTitle}>Co-op Focus Rooms</h2>
          </div>
          <span className={styles.loreTag}>Active Fleet Radar</span>
        </div>

        <button className={`launch-btn ${styles.createBtn}`}>
          <Plus size={18} /> Create Fleet
        </button>
      </div>

      <motion.div
        className={styles.roomsGrid}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            variants={fadeUp}
            className={`premium-card ${styles.roomCard}`}
          >
            {/* Room Header & Badges */}
            <div className={styles.cardHeader}>
              <h3 className={styles.roomName}>{room.name}</h3>
              {room.status === "open" && (
                <span className={`${styles.statusBadge} ${styles.open}`}>
                  Awaiting
                </span>
              )}
              {room.status === "active" && (
                <span className={`${styles.statusBadge} ${styles.active}`}>
                  In Session
                </span>
              )}
              {room.status === "full" && (
                <span className={`${styles.statusBadge} ${styles.full}`}>
                  Full
                </span>
              )}
            </div>

            <div className={styles.themeTag}>{room.theme}</div>

            {/* Social Proof: Overlapping Avatars */}
            <div className={styles.socialRow}>
              <div className={styles.avatarGroup}>
                {room.members.map((initial, i) => (
                  <div
                    key={i}
                    className={styles.miniAvatar}
                    style={{ zIndex: 10 - i }}
                  >
                    {initial}
                  </div>
                ))}
                {room.capacity > room.members.length && (
                  <div className={styles.emptySlot}>
                    +{room.capacity - room.members.length}
                  </div>
                )}
              </div>

              <div className={styles.hostInfo}>
                Host: <strong>{room.host}</strong>
              </div>
            </div>

            {/* Contextual Action Button */}
            <div className={styles.cardFooter}>
              {room.status === "open" && (
                <button className={`launch-btn ${styles.joinBtn}`}>
                  Join Room
                </button>
              )}
              {room.status === "active" && (
                <button className={`launch-btn alt ${styles.joinBtn}`} disabled>
                  <Clock size={16} /> {room.timeLeft}
                </button>
              )}
              {room.status === "full" && (
                <button
                  className={`launch-btn alt ${styles.joinBtn}`}
                  disabled
                  style={{ opacity: 0.5 }}
                >
                  <Lock size={16} /> Capacity Reached
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
