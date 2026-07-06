import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

export default function Login({ setUser,setIsAuthenticated }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 4. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate("/");
        localStorage.setItem("telemetry_known_user", "true");
      }
    } catch (err) {
      let errorMessage = err.response?.data?.message;
      if (!errorMessage && typeof err.response?.data === "string") {
        errorMessage = err.response.data;
      }
      setError(errorMessage || "Server connection failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        padding: "2rem",
      }}
    >
      <div
        className="premium-card objectiveCard"
        style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "var(--relax-cyan, #06b6d4)",
          }}
        >
          <LogIn size={48} style={{ margin: "0 auto" }} />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              textTransform: "uppercase",
              marginTop: "1rem",
            }}
          >
            Pilot Login
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Authenticate your telemetry link.
          </p>
        </div>

        {/* --- ERROR DISPLAY --- */}
        {error && (
          <div
            style={{
              background: "rgba(255, 0, 0, 0.1)",
              color: "#ff4444",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={18} />
            <span style={{ fontSize: "0.85rem" }}>{error}</span>
          </div>
        )}

        {/* --- LOGIN FORM --- */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
        >
          <div style={{ position: "relative" }}>
            <Mail
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "12px",
                color: "#64748b",
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Transmission Address (Email)"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "white",
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Lock
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "12px",
                color: "#64748b",
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Security Key (Password)"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "white",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "14px",
              marginTop: "1rem",
              background: isLoading ? "#334155" : "var(--relax-cyan, #06b6d4)",
              color: isLoading ? "#94a3b8" : "black",
              border: "none",
              borderRadius: "8px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "var(--font-display)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: "bold",
              transition: "0.2s ease",
            }}
          >
            {isLoading ? "Authenticating..." : "Establish Link"}
          </button>
        </form>

        {/* Navigation link back to registration */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
            No telemetry link established?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "var(--relax-cyan, #06b6d4)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
