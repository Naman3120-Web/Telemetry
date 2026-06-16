import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Landing from "./components/Landing.jsx";
import Navbar from "./components/Navbar.jsx";
import Starfield from "./components/Starfield.jsx";
import CursorTrail from "./components/CustomCursor.jsx";
import Home from "./Features/HOME (Command Center)/Home.jsx";
import Focus from "./Features/FOCUS (Solo Hyperspace)/Focus.jsx";
import Rooms from "./Features/ROOMS (Fleet Formation)/Rooms.jsx";
import Relax from "./Features/RELAX (Cryo-Chamber)/Relax.jsx";
import Profile from "./Features/PROFILE (Pilot Log)/Profile.jsx";

const platformSections = [
  {
    key: "home",
    name: "HOME",
    features: ["Welcome page", "Registration", "Leaderboard"],
  },
  {
    key: "focus",
    name: "FOCUS",
    features: ["Pomodoro solo session", "Lo-fi / white-noise", "XP rewards"],
  },
  {
    key: "rooms",
    name: "ROOMS",
    features: ["Public fleets", "Join/Host rooms", "Timer sync (Socket)"],
  },
  {
    key: "relax",
    name: "RELAX",
    features: ["5-min breathing", "Guided cooldown"],
  },
  { key: "profile", name: "PROFILE", features: ["Badges", "Account settings"] },
];

function App() {
  const [isBoarded, setIsBoarded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection =
    location.pathname === "/" ? "home" : location.pathname.slice(1);

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

  useEffect(() => {
    const lv = Math.floor((user.xp || 0) / 1000);
    if (lv !== user.level) setUser((u) => ({ ...u, level: lv }));
    localStorage.setItem("telemetry_user", JSON.stringify(user));
  }, [user]);

  const currentSection =
    platformSections.find((s) => s.key === activeSection) ??
    platformSections[0];

  const awardXP = (amount) => {
    setUser((u) => ({ ...u, xp: (u.xp || 0) + amount }));
  };

  return (
    <main className={`root ${isBoarded ? "ship-mode" : "intro-mode"}`}>
      <Starfield />
      <CursorTrail />

      {!isBoarded ? (
        <Landing onLaunch={() => setIsBoarded(true)} />
      ) : (
        <>
          <div className="topBar">
            {activeSection !== "home" && (
              <button
                type="button"
                className="backButton"
                onClick={() => navigate("/")}
              >
                ← COMMAND CENTRE
              </button>
            )}
            <Navbar />
          </div>

          <div className="dashboard">
            <div className="shipLayout">
              <aside className="sidebar" aria-label="Section features">
                <p className="sidebarHeading">CURRENT MISSION</p>
                <ul className="featureList">
                  {currentSection?.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </aside>

              <section className="sectionPanel" aria-label="Section details">
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
          </div>
        </>
      )}
    </main>
  );
}

export default App;
