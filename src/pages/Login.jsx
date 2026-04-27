import API_BASE_URL from "../utils/api";
import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot Password Modal States
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const navigate =
  useNavigate();
  const [resetData, setResetData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetMsg, setResetMsg] = useState("");
  const [resetMsgType, setResetMsgType] = useState("error"); // "error" | "success"
  const [resetLoading, setResetLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ---------------- Helpers ----------------
  const openModal = () => {
    setShowModal(true);
    setStep(1);
    setResetMsg("");
    setResetMsgType("error");
    setResetData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setResetMsg("");
    setResetMsgType("error");
    setResetData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  };

  const handleResetChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
    if (resetMsg) setResetMsg("");
  };

  // ---------------- Login ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password.");
      } else {
           localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "admin") {
              navigate("/dashboard");
            } else {
              navigate("/");
            }

            window.location.reload();
      }
    } catch (error) {
  console.log(error);
  setError(
    "Something went wrong."
  );
}
  };

  // ---------------- Forgot Password — Step 1: Send OTP ----------------
  const sendOtp = async () => {
    if (!resetData.email) {
      setResetMsg("Please enter your email address.");
      setResetMsgType("error");
      return;
    }

    setResetLoading(true);
    setResetMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResetMsg(data.message || "Failed to send OTP.");
        setResetMsgType("error");
      } else {
        setResetMsg("OTP sent! Check your inbox.");
        setResetMsgType("success");
        setTimeout(() => {
          setResetMsg("");
          setStep(2);
        }, 1200);
      }
    } catch {
      setResetMsg("Something went wrong. Try again.");
      setResetMsgType("error");
    } finally {
      setResetLoading(false);
    }
  };

  // ---------------- Forgot Password — Step 2: Reset Password ----------------
  const resetPassword = async () => {
    if (!resetData.otp) {
      setResetMsg("Please enter the OTP.");
      setResetMsgType("error");
      return;
    }

    if (!resetData.newPassword || resetData.newPassword.length < 6) {
      setResetMsg("Password must be at least 6 characters.");
      setResetMsgType("error");
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      setResetMsg("Passwords do not match.");
      setResetMsgType("error");
      return;
    }

    setResetLoading(true);
    setResetMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetData.email,
          otp: resetData.otp,
          newPassword: resetData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResetMsg(data.message || "Reset failed. Check your OTP.");
        setResetMsgType("error");
      } else {
        setResetMsg("Password changed successfully! ✓");
        setResetMsgType("success");
        setTimeout(() => closeModal(), 2000);
      }
    } catch {
      setResetMsg("Something went wrong. Try again.");
      setResetMsgType("error");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* ── Login Card ── */}
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">💄</div>
          <span className="brand-name">Neha Beauty Parlour</span>
        </div>

        <h1 className="login-heading">Welcome Back</h1>
        <p className="login-subtext">Sign in to manage your bookings &amp; appointments</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email */}
          <div className="field-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="Enter email"
              required
              value={form.email}
              onChange={handleChange}
              className="login-input"
            />
          </div>

          {/* Password */}
          <div className="field-group">
            <div className="label-row">
              <label htmlFor="login-password">Password</label>
              <button
                type="button"
                className="forgot-link-btn"
                onClick={openModal}
              >
                Forgot Password?
              </button>
            </div>

            <div className="password-box">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                required
                value={form.password}
                onChange={handleChange}
                className="login-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : "Enter Parlour"}
          </button>
        </form>

        <p className="signup-text">
          New here?{" "}
          <Link to="/signup" className="signup-link">
            Create Account
          </Link>
        </p>
      </div>

      {/* ── Forgot Password Modal ── */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="forgot-modal">
            <button
              className="close-btn"
              type="button"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ✖
            </button>

            <div className="modal-brand-icon">🔑</div>
            <h2>Reset Password</h2>

            {/* Step indicators */}
            <div className="step-indicators">
              <div className={`step-dot ${step >= 1 ? "active" : ""}`} />
              <div className="step-line" />
              <div className={`step-dot ${step >= 2 ? "active" : ""}`} />
            </div>

            {step === 1 ? (
              <>
                <p>Enter your registered email and we&apos;ll send you an OTP.</p>

                <div className="field-group">
                  <label htmlFor="reset-email">Email Address</label>
                  <input
                    id="reset-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={resetData.email}
                    onChange={handleResetChange}
                    className="login-input"
                  />
                </div>

                <button
                  type="button"
                  className="submit-btn"
                  onClick={sendOtp}
                  disabled={resetLoading}
                >
                  {resetLoading ? <span className="btn-spinner" /> : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <p>
                  OTP sent to <strong>{resetData.email}</strong>
                </p>

                {/* OTP */}
                <div className="field-group">
                  <label htmlFor="reset-otp">OTP Code</label>
                  <input
                    id="reset-otp"
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={resetData.otp}
                    onChange={handleResetChange}
                    className="login-input otp-input"
                    maxLength={6}
                    inputMode="numeric"
                  />
                </div>

                {/* New Password */}
                <div className="field-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="password-box">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="Min. 6 characters"
                      value={resetData.newPassword}
                      onChange={handleResetChange}
                      className="login-input"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="field-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="password-box">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Repeat new password"
                      value={resetData.confirmPassword}
                      onChange={handleResetChange}
                      className={`login-input${
                        resetData.confirmPassword &&
                        resetData.confirmPassword !== resetData.newPassword
                          ? " input-mismatch"
                          : ""
                      }${
                        resetData.confirmPassword &&
                        resetData.confirmPassword === resetData.newPassword
                          ? " input-match"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => {
                      setStep(1);
                      setResetMsg("");
                    }}
                    disabled={resetLoading}
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="submit-btn modal-submit"
                    onClick={resetPassword}
                    disabled={resetLoading}
                  >
                    {resetLoading ? <span className="btn-spinner" /> : "Reset Password"}
                  </button>
                </div>
              </>
            )}

            {resetMsg && (
              <p
                className={`reset-msg${
                  resetMsgType === "success" ? " reset-msg-success" : ""
                }`}
              >
                {resetMsg}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;