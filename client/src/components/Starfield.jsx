import React from "react";
import styles from "./Starfield.module.css";

const stars = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 3,
}));

export default function Starfield() {
  return (
    <div className={`${styles.starfield} starfield`} aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className={`${styles.star} star`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
