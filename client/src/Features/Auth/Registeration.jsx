import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  ShieldCheck,
  Mail,
  Lock,
  User as UserIcon,
  AlertCircle,
  CheckCircle,
  Calendar,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    DOB: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * REGISTRATION SEQUENCE
   * Transmits new pilot credentials to the Express backend.
   * On success (201 Created), transitions the UI to the confirmation screen.
   * On failure, captures the backend error message for user display.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        DOB: formData.DOB,
      });

      if (response.status === 201) {
        setIsSuccess(true);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Try again.";
      setError(errorMessage);
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
        {/* --- PHASE 1: REGISTRATION FORM --- */}
        {!isSuccess ? (
          <>
            <div
              style={{
                textAlign: "center",
                marginBottom: "2rem",
                color: "var(--accent-red)",
              }}
            >
              <ShieldCheck size={48} style={{ margin: "0 auto" }} />
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  marginTop: "1rem",
                }}
              >
                Pilot Registration
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                Establish your secure telemetry link.
              </p>
            </div>

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

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              <div style={{ position: "relative" }}>
                <UserIcon
                  size={18}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "12px",
                    color: "#64748b",
                  }}
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Callsign (Username)"
                  value={formData.username}
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
                <Calendar
                  size={18}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "12px",
                    color: "#64748b",
                  }}
                />
                <input
                  type="date"
                  name="DOB"
                  value={formData.DOB}
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
                  minLength={6}
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
                  background: isLoading
                    ? "#334155"
                    : "var(--accent-red, #e11d48)",
                  color: "white",
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
                {isLoading
                  ? "Establishing Link..."
                  : "Initialize Pilot Sequence"}
              </button>
            </form>
          </>
        ) : (
          /* --- PHASE 2: SUCCESS CONFIRMATION --- */
          <div
            style={{
              textAlign: "center",
              padding: "2rem 0",
              color: "var(--success, #22c55e)",
            }}
          >
            <CheckCircle
              size={72}
              style={{ margin: "0 auto", marginBottom: "1.5rem" }}
            />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                textTransform: "uppercase",
                color: "white",
                marginBottom: "0.5rem",
              }}
            >
              Successfully Registered
            </h2>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.95rem",
                marginBottom: "2rem",
              }}
            >
              Your telemetry link is established and secure.
            </p>

            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "14px 24px",
                background: "transparent",
                color: "var(--success, #22c55e)",
                border: "1px solid var(--success, #22c55e)",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: "bold",
                transition: "0.2s ease",
              }}
            >
              Proceed to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
