import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Navbar.module.css";

const navItems = ["home", "focus", "rooms", "relax", "profile"];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection =
    location.pathname === "/" ? "home" : location.pathname.slice(1);

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item}>
            <button
              type="button"
              className={`${styles.navButton} ${activeSection === item ? styles.active : ""}`}
              onClick={() => navigate(item === "home" ? "/" : `/${item}`)}
            >
              {item.toUpperCase()}

              {/* Premium UI: Animated glowing underline */}
              {activeSection === item && (
                <motion.div
                  layoutId="activeIndicator"
                  className={styles.activeIndicator}
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
