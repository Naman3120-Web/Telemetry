import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorTrail() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false); // NEW: Track button hovers

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.1 };
  const trailConfig = { damping: 20, stiffness: 300, mass: 0.5 };

  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // NEW: Detect if we are hovering over a clickable element
      // e.target.closest looks up the DOM tree to see if the element is inside a button/link
      const isClickable = e.target.closest("button, a, input, [role='button']");
      setIsHovering(!!isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* THE TRAILING DOT */}
      <motion.div
        animate={{
          // Shrink the dot to 0 when hovering a button to make it look cleaner
          scale: isHovering ? 0 : 1,
        }}
        style={{
          x: trailX,
          y: trailY,
          position: "absolute",
          top: -4,
          left: -4,
          width: "8px",
          height: "8px",
          backgroundColor: "rgba(220, 38, 38, 0.6)",
          borderRadius: "50%",
          filter: "blur(2px)",
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* THE MAIN CROSSHAIR */}
      <motion.div
        animate={{
          // Rotate 45 degrees and scale up slightly when hovering a button
          rotate: isHovering ? 45 : 0,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          x: cursorX,
          y: cursorY,
          position: "absolute",
          top: -12,
          left: -12,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="#dc2626" strokeWidth="1.5">
            <line x1="0" y1="12" x2="24" y2="12" />
            <line x1="12" y1="0" x2="12" y2="24" />
            <circle cx="12" cy="12" r="2" fill="#dc2626" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
