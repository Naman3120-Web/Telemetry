import { useState } from "react";
import "./App.css";

const stars = [
  { x: 4, y: 8, size: 4 },
  { x: 13, y: 15, size: 3 },
  { x: 24, y: 6, size: 3 },
  { x: 33, y: 20, size: 4 },
  { x: 45, y: 10, size: 3 },
  { x: 58, y: 18, size: 4 },
  { x: 70, y: 7, size: 3 },
  { x: 82, y: 16, size: 4 },
  { x: 92, y: 9, size: 3 },
  { x: 8, y: 42, size: 3 },
  { x: 19, y: 34, size: 4 },
  { x: 30, y: 48, size: 3 },
  { x: 39, y: 37, size: 3 },
  { x: 51, y: 43, size: 4 },
  { x: 62, y: 31, size: 3 },
  { x: 74, y: 45, size: 4 },
  { x: 85, y: 38, size: 3 },
  { x: 95, y: 44, size: 4 },
  { x: 6, y: 73, size: 3 },
  { x: 16, y: 64, size: 4 },
  { x: 28, y: 81, size: 3 },
  { x: 41, y: 70, size: 4 },
  { x: 53, y: 78, size: 3 },
  { x: 66, y: 67, size: 4 },
  { x: 77, y: 83, size: 3 },
  { x: 89, y: 72, size: 4 },
  { x: 96, y: 84, size: 3 },
];

const platformSections = [
  {
    key: "home",
    name: "HOME",
    features: ["Welcome page", "Registration", "Leaderboard"],
  },
  {
    key: "focus",
    name: "Focus Session",
    features: [
      "Avg focus span",
      "Pomodoro solo session",
      "Lo-fi / white-noise",
    ],
  },
  {
    key: "room",
    name: "Room",
    features: [
      "Most active rooms",
      "Join room",
      "Live video communication (RTC)",
    ],
  },
  {
    key: "relax",
    name: "Relax",
    features: ["Mind games website link", "Meditation activities"],
  },
];

function App() {
  const [isBoarded, setIsBoarded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const currentSection = platformSections.find((s) => s.key === activeSection);

  return (
    <main className={`retro-space ${isBoarded ? "ship-mode" : "intro-mode"}`}>
      <div className="starfield" aria-hidden="true">
        {stars.map((star, index) => (
          <span
            key={`${star.x}-${star.y}-${index}`}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>

      {!isBoarded ? (
        <section className="intro-console" aria-label="Platform introduction">
          <div className="intro-left">
            <p className="console-label">01 GETTING STARTED</p>
            <h1>TELEMETRY</h1>
            <p className="tagline">
              Train like a fleet. Focus like a captain. Discover new sectors
              every session.
            </p>

            <p className="instruction-copy">
              This platform runs shared Pomodoro missions for social
              accountability. Start by boarding the ship.
            </p>

            <button
              type="button"
              className="launch-btn"
              aria-label="Jump in the spaceship"
              onClick={() => setIsBoarded(true)}
            >
              JUMP IN SPACESHIP →
            </button>
          </div>

          <div className="intro-right">
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-card-value">90%</div>
                <div className="stat-card-label">Success Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value">⚡</div>
                <div className="stat-card-label">AI Controlled</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value">🔗</div>
                <div className="stat-card-label">Real Time Communication</div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bridge-console" aria-label="In-ship dashboard">
          <button
            type="button"
            className="back-btn"
            aria-label="Return to instruction page"
            onClick={() => setIsBoarded(false)}
          >
            ← BACK
          </button>

          <div className="bridge-content">
            <div className="bridge-header">
              <p className="console-label">INSIDE THE BRIDGE</p>
              <h1>HYPERFOCUS FLEET</h1>
              <p className="tagline">
                Charge your engines. Focus together. Explore the galaxy.
              </p>
            </div>

            <nav className="fleet-nav" aria-label="Platform navigation">
              {platformSections.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`nav-btn ${activeSection === item.key ? "active" : ""}`}
                  onClick={() => setActiveSection(item.key)}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="content-wrapper">
              <aside className="sidebar" aria-label="Section features">
                <h3>FEATURES</h3>
                <ul className="feature-list">
                  {currentSection?.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </aside>

              <main className="main-panel" aria-label="Section details">
                <h2>{currentSection?.name}</h2>
                <p className="panel-copy">
                  Explore the galaxy. Build your crew. Master focus.
                </p>
              </main>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
