import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import api from "./api/axios";
import {
  Info,
  Crosshair,
  Users,
  Wind,
  ShieldCheck,
} from "lucide-react";
import "./App.css";
import defaultAvatar from "/assets/default-avatar.avif";
import Landing from "./components/Landing.jsx";
import Navbar from "./components/Navbar.jsx";
import Starfield from "./components/Starfield.jsx";
import CursorTrail from "./components/CustomCursor.jsx";

import Home from "./Features/HOME (Command Center)/Home.jsx";
import Focus from "./Features/FOCUS (Solo Hyperspace)/Focus.jsx";
import Rooms from "./Features/ROOMS (Fleet Formation)/Rooms.jsx";
import Relax from "./Features/RELAX (Cryo-Chamber)/Relax.jsx";
import Profile from "./Features/PROFILE (Pilot Log)/Profile.jsx";
import Register from "./Features/Auth/Registeration.jsx";
import Login from "./Features/Auth/Login.jsx";

const SIDEBAR_CONTENT = {
  "/": {
    title: "Command Center",
    icon: Info,
    color: "var(--relax-cyan)",
    tasks: [
      "Review daily telemetry and focus hours.",
      "Check recent activity logs for XP changes.",
      "Initiate next focus sequence when ready.",
    ],
  },
  "/focus": {
    title: "Focus Protocol",
    icon: Crosshair,
    color: "var(--accent-red)",
    tasks: [
      "Define a clear, actionable objective.",
      "Engage slider to lock in session.",
      "WARNING: Tab switching causes Hull Breach (-10 XP).",
    ],
  },
  "/rooms": {
    title: "Fleet Formation",
    icon: Users,
    color: "var(--success)",
    tasks: [
      "Find a fleet matching your current objective.",
      "Dock to sync timers with active crew.",
      "Maintain formation to earn Co-op XP bonuses.",
    ],
  },
  "/relax": {
    title: "Cryo-Recovery",
    icon: Wind,
    color: "var(--relax-cyan)",
    tasks: [
      "Follow the visual core expansion.",
      "Sync inhales and exhales to the cycle.",
      "Lower heart rate to baseline (+10 XP).",
    ],
  },
  "/profile": {
    title: "Pilot Dossier",
    icon: ShieldCheck,
    color: "var(--xp-gold)",
    tasks: [
      "Review earned service badges.",
      "Monitor distance to next rank promotion.",
      "Study XP positive/negative protocols.",
    ],
  },
  "/register": {
    title: "Pilot Registration",
    icon: ShieldCheck,
    color: "var(--accent-red)",
    tasks: [
      "Enter secure credentials to establish identity.",
      "Verify connection to Telemetry database.",
      "Prepare for initial sequence launch.",
    ],
  },
  "/login": {
    title: "Pilot Authentication",
    icon: ShieldCheck,
    color: "var(--relax-cyan)",
    tasks: [
      "Provide secure credentials to re-establish identity.",
      "Verify connection to Telemetry database.",
      "Awaiting access clearance.",
    ],
  },
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isBoarded, setIsBoarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [user, setUser] = useState({ username: "Pilot", xp: 0, level: 0 });

  const currentSidebarInfo =
    SIDEBAR_CONTENT[location.pathname] || SIDEBAR_CONTENT["/"];
  const SidebarIcon = currentSidebarInfo.icon;

  /**
   * SESSION HYDRATION PROTOCOL
   * On mount, polls the backend to verify the presence of a valid JWT cookie.
   * If a valid session exists, it populates the pilot's exact stats from the database
   * and bypasses the landing/login sequences automatically.
   */
  useEffect(() => {
    const verifySecureLink = async () => {
      try {
        const response = await api.get("/auth/verify");

        if (response.status === 200) {
          const dbUser = response.data.user;
          const currentXp = dbUser?.xp || 0;

          setIsAuthenticated(true);
          setIsBoarded(true); // Automatically skip landing page
          setUser({
            username: dbUser?.username || "Pilot",
            xp: currentXp,
            level: Math.floor(currentXp / 1000),
          });
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifySecureLink();
  }, []);

  /**
   * LEVEL CALCULATION ENGINE
   * Continuously monitors XP state and cleanly derives the current Level.
   * This ensures the UI remains consistent whenever XP is mutated.
   */
  useEffect(() => {
    const calculatedLevel = Math.floor((user.xp || 0) / 1000);
    if (calculatedLevel !== user.level) {
      setUser((prevUser) => ({ ...prevUser, level: calculatedLevel }));
    }
  }, [user.xp]);

  const awardXP = (amount) => {
    setUser((u) => ({ ...u, xp: Math.max(0, (u.xp || 0) + amount) }));
  };

  // ==========================================
  // STAGE 0: LOADING (Awaiting Backend Response)
  // ==========================================
  if (isCheckingAuth) {
    return (
      <main
        className="appWrapper intro-mode"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Starfield />
        <h2
          style={{
            color: "var(--relax-cyan)",
            fontFamily: "var(--font-display)",
          }}
        >
          Establishing Secure Connection...
        </h2>
      </main>
    );
  }

  // ==========================================
  // STAGE 1: INAUGURAL DEPLOYMENT (Landing Page)
  // ==========================================
  if (!isBoarded) {
    return (
      <main className="appWrapper intro-mode">
        <Starfield />
        <div className="nebulaLayer" />
        <CursorTrail />
        <Landing
          onLaunch={() => {
            setIsBoarded(true);
            navigate("/login"); // Immediately direct to Login per design rules
          }}
        />
      </main>
    );
  }

  // ==========================================
  // STAGE 2: AUTHENTICATION OUTPOST (Not Logged In)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <main className="appWrapper ship-mode">
        <Starfield />
        <div className="nebulaLayer" />
        <CursorTrail />

        <header className="topNav">
          <div className="brand">
            <img
              src="/assets/icon.png"
              alt="Telemetry Icon"
              className="brandIcon"
              style={{
                width: "80px",
                height: "80px",
                filter: "invert(1)", 
                opacity: 0.9, 
              }}
            />
            <span>Telemetry</span>
          </div>
        </header>

        <div className="mainLayout">
          <aside className="leftSidebar">
            <div className="premium-card objectiveCard">
              <h3 className="sidebarTitle">Current Objective</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                  color: currentSidebarInfo.color,
                }}
              >
                <SidebarIcon size={20} />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {currentSidebarInfo.title}
                </span>
              </div>
              <ul className="objectiveList">
                {currentSidebarInfo.tasks.map((task, index) => (
                  <li key={index} className="objectiveItem">
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: currentSidebarInfo.color,
                        marginTop: "8px",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        lineHeight: "1.5",
                        color: "#94a3b8",
                      }}
                    >
                      {task}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="contentArea">
            <Routes>
              {/* Both routes are freely accessible before login */}
              <Route
                path="/login"
                element={
                  <Login
                    setUser={setUser}
                    setIsAuthenticated={setIsAuthenticated}
                  />
                }
              />
              <Route path="/register" element={<Register />} />

              {/* Fallback to login if URL is unrecognizable */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </section>
        </div>
      </main>
    );
  }

  // ==========================================
  // STAGE 3: THE COMMAND CENTER (Logged In)
  // ==========================================
  return (
    <main className="appWrapper ship-mode">
      <Starfield />
      <div className="nebulaLayer" />
      <CursorTrail />

      <header className="topNav">
        <div className="brand">
          <img
            src="/assets/icon.png"
            alt="Telemetry Icon"
            className="brandIcon"
            style={{
              width: "80px",
              height: "80px",
              filter: "invert(1)",
              opacity: 0.9,
            }}
          />
          <span>Telemetry</span>
        </div>
        <Navbar />
        <div className="userWidget" onClick={() => navigate("/profile")}>
          <div className="userStats">
            <span className="userLevel">LEVEL {user.level}</span>
            <span className="userXp">{user.xp.toLocaleString()} XP</span>
          </div>
          <div
            className="userAvatar"
            style={{
              padding: 0,
              overflow: "hidden",
              border: "2px solid #334155",
            }}
          >
            <img
              src={defaultAvatar}
              alt="Pilot Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </header>

      <div className="mainLayout">
        <aside className="leftSidebar">
          <div className="premium-card objectiveCard">
            <h3 className="sidebarTitle">Current Objective</h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
                color: currentSidebarInfo.color,
              }}
            >
              <SidebarIcon size={20} />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {currentSidebarInfo.title}
              </span>
            </div>
            <ul className="objectiveList">
              {currentSidebarInfo.tasks.map((task, index) => (
                <li key={index} className="objectiveItem">
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: currentSidebarInfo.color,
                      marginTop: "8px",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      lineHeight: "1.5",
                      color: "#94a3b8",
                    }}
                  >
                    {task}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="contentArea">
          <Routes>
            <Route
              path="/"
              element={
                <Home user={user} onQuickLaunch={() => navigate("/focus")} />
              }
            />
            <Route path="/focus" element={<Focus awardXP={awardXP} />} />
            <Route path="/rooms" element={<Rooms user={user} />} />
            <Route path="/relax" element={<Relax />} />
            <Route
              path="/profile"
              element={
                <Profile
                  user={user}
                  setUser={setUser}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />

            {/* Secures against invalid internal URLs */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </section>
      </div>
    </main>
  );
}
