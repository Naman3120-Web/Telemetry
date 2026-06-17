import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Hexagon,
  Info,
  Crosshair,
  Users,
  Wind,
  ShieldCheck,
} from "lucide-react";
import "./App.css";

// Components
import Landing from "./components/Landing.jsx";
import Navbar from "./components/Navbar.jsx";
import Starfield from "./components/Starfield.jsx";
import CursorTrail from "./components/CustomCursor.jsx";

// Features
import Home from "./Features/HOME (Command Center)/Home.jsx";
import Focus from "./Features/FOCUS (Solo Hyperspace)/Focus.jsx";
import Rooms from "./Features/ROOMS (Fleet Formation)/Rooms.jsx";
import Relax from "./Features/RELAX (Cryo-Chamber)/Relax.jsx";
import Profile from "./Features/PROFILE (Pilot Log)/Profile.jsx";

// --- DYNAMIC SIDEBAR DATA ---
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
};

function App() {
  const [isBoarded, setIsBoarded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Gets the current route

  // Determine which sidebar data to show based on URL path
  const currentSidebarInfo =
    SIDEBAR_CONTENT[location.pathname] || SIDEBAR_CONTENT["/"];
  const SidebarIcon = currentSidebarInfo.icon;

  // --- LOCAL STORAGE STATE ---
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("telemetry_user");
      return raw
        ? JSON.parse(raw)
        : { username: "Pilot", xp: 0, level: 0, badges: [] };
    } catch (e) {
      return { username: "Pilot", xp: 0, level: 0, badges: [] };
    }
  });

  // Calculate Level & Sync to Local Storage
  useEffect(() => {
    const lv = Math.floor((user.xp || 0) / 1000);
    if (lv !== user.level) setUser((u) => ({ ...u, level: lv }));
    localStorage.setItem("telemetry_user", JSON.stringify(user));
  }, [user]);

  // Safe XP Awarding Function
  const awardXP = (amount) => {
    setUser((u) => ({ ...u, xp: Math.max(0, (u.xp || 0) + amount) }));
  };

  return (
    <main className={`appWrapper ${isBoarded ? "ship-mode" : "intro-mode"}`}>
      {/* Background Layers */}
      <Starfield />
      <div className="nebulaLayer" />
      <CursorTrail />

      {!isBoarded ? (
        <Landing onLaunch={() => setIsBoarded(true)} />
      ) : (
        <>
          {/* Tiny HUD Details */}
          <div className="hudCoordinates">
            SECTOR 07
            <br />
            X: 2041 Y: 811
          </div>

          {/* --- TOP NAVIGATION BAR --- */}
          <header className="topNav">
            <div className="brand">
              <Hexagon className="brandIcon" size={24} />
              <span>Telemetry</span>
            </div>

            <Navbar />

            {/* Top-Right User Widget */}
            <div className="userWidget" onClick={() => navigate("/profile")}>
              <div className="userStats">
                <span className="userLevel">LEVEL {user.level}</span>
                <span className="userXp">{user.xp.toLocaleString()} XP</span>
              </div>
              <div className="userAvatar">
                {user?.username?.charAt(0).toUpperCase() || "P"}
              </div>
            </div>
          </header>

          {/* --- MAIN DASHBOARD LAYOUT --- */}
          <div className="mainLayout">
            {/* Left Sidebar: DYNAMIC SECTION INFO */}
            <aside className="leftSidebar">
              <div className="premium-card objectiveCard">
                <h3 className="sidebarTitle">Current Objective</h3>

                {/* Dynamic Title based on section */}
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

            {/* Right Panel: Active React Router Component */}
            <section className="contentArea">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      user={user}
                      onQuickLaunch={() => navigate("/focus")}
                    />
                  }
                />
                <Route path="/focus" element={<Focus awardXP={awardXP} />} />
                <Route path="/rooms" element={<Rooms user={user} />} />
                <Route path="/relax" element={<Relax />} />
                <Route
                  path="/profile"
                  element={<Profile user={user} setUser={setUser} />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </section>
          </div>
        </>
      )}
    </main>
  );
}

export default App;
