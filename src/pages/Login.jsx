import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  /* Forgot Password */
  const [showModal, setShowModal] =
    useState(false);

  const [step, setStep] =
    useState(1);

  const [
    resetLoading,
    setResetLoading,
  ] = useState(false);

  const [
    resetMsg,
    setResetMsg,
  ] = useState("");

  const [
    resetMsgType,
    setResetMsgType,
  ] = useState("error");

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [resetData, setResetData] =
    useState({
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  /* =======================
     Input Handlers
  ======================= */

  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

    if (error)
      setError("");
  };

  const handleResetChange = (
    e
  ) => {
    setResetData({
      ...resetData,
      [e.target.name]:
        e.target.value,
    });

    if (resetMsg)
      setResetMsg("");
  };

  /* =======================
     Login
  ======================= */

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);
        setError("");

        const res =
          await fetch(
            `${API_BASE_URL}/login`,
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                form
              ),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          setError(
            data.message ||
              "Invalid login credentials."
          );
          return;
        }

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user
          )
        );

        if (
          data.user.role ===
          "admin"
        ) {
          navigate(
            "/dashboard"
          );
        } else {
          navigate("/");
        }

        window.location.reload();
      } catch {
        setError(
          "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

  /* =======================
     Forgot Password
  ======================= */

  const openModal = () => {
    setShowModal(true);
    setStep(1);
    setResetMsg("");
    setResetMsgType(
      "error"
    );

    setResetData({
      email: "",
      otp: "",
      newPassword:
        "",
      confirmPassword:
        "",
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setResetMsg("");
  };

  const sendOtp =
    async () => {
      if (
        !resetData.email
      ) {
        setResetMsg(
          "Please enter email."
        );
        return;
      }

      try {
        setResetLoading(
          true
        );

        const res =
          await fetch(
            `${API_BASE_URL}/forgot-password`,
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                {
                  email:
                    resetData.email,
                }
              ),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          setResetMsg(
            data.message ||
              "Unable to send OTP."
          );
          return;
        }

        setResetMsgType(
          "success"
        );

        setResetMsg(
          "OTP sent successfully."
        );

        setTimeout(
          () => {
            setStep(
              2
            );
            setResetMsg(
              ""
            );
          },
          1200
        );
      } catch {
        setResetMsg(
          "Something went wrong."
        );
      } finally {
        setResetLoading(
          false
        );
      }
    };

  const resetPassword =
    async () => {
      if (
        !resetData.otp
      ) {
        setResetMsg(
          "Enter OTP."
        );
        return;
      }

      if (
        resetData
          .newPassword
          .length < 6
      ) {
        setResetMsg(
          "Password must be at least 6 characters."
        );
        return;
      }

      if (
        resetData.newPassword !==
        resetData.confirmPassword
      ) {
        setResetMsg(
          "Passwords do not match."
        );
        return;
      }

      try {
        setResetLoading(
          true
        );

        const res =
          await fetch(
            `${API_BASE_URL}/reset-password`,
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                {
                  email:
                    resetData.email,
                  otp: resetData.otp,
                  newPassword:
                    resetData.newPassword,
                }
              ),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          setResetMsg(
            data.message ||
              "Reset failed."
          );
          return;
        }

        setResetMsgType(
          "success"
        );

        setResetMsg(
          "Password changed successfully."
        );

        setTimeout(
          () =>
            closeModal(),
          1800
        );
      } catch {
        setResetMsg(
          "Something went wrong."
        );
      } finally {
        setResetLoading(
          false
        );
      }
    };

  return (
    <div className="login-root">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* Card */}
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">
            💄
          </div>

          <span className="brand-name">
            Neha Beauty
            Parlour
          </span>
        </div>

        <h1 className="login-heading">
          Welcome Back
        </h1>

        <p className="login-subtext">
          Login to manage
          bookings &
          appointments
        </p>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form
          onSubmit={
            handleSubmit
          }
          className="login-form"
        >
          {/* Email */}
          <div className="field-group">
            <label>
              Email
              Address
            </label>

            <input
              type="email"
              name="email"
              required
              placeholder="Enter email"
              value={
                form.email
              }
              onChange={
                handleChange
              }
              className="login-input"
            />
          </div>

          {/* Password */}
          <div className="field-group">
            <div className="label-row">
              <label>
                Password
              </label>

              <button
                type="button"
                className="forgot-link-btn"
                onClick={
                  openModal
                }
              >
                Forgot
                Password?
              </button>
            </div>

            <div className="password-box">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                required
                placeholder="Enter password"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                className="login-input"
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={
              loading
            }
          >
            {loading ? (
              <span className="btn-spinner"></span>
            ) : (
              "Enter Parlour"
            )}
          </button>
        </form>

        <p className="signup-text">
          New here?{" "}
          <Link
            to="/signup"
            className="signup-link"
          >
            Create
            Account
          </Link>
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(
            e
          ) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="forgot-modal">
            <button
              className="close-btn"
              onClick={
                closeModal
              }
            >
              ✕
            </button>

            <div className="modal-brand-icon">
              🔑
            </div>

            <h2>
              Reset
              Password
            </h2>

            <div className="step-indicators">
              <div
                className={`step-dot ${
                  step >= 1
                    ? "active"
                    : ""
                }`}
              ></div>

              <div className="step-line"></div>

              <div
                className={`step-dot ${
                  step >= 2
                    ? "active"
                    : ""
                }`}
              ></div>
            </div>

            {step ===
            1 ? (
              <>
                <p>
                  Enter
                  your
                  email to
                  receive
                  OTP.
                </p>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={
                    resetData.email
                  }
                  onChange={
                    handleResetChange
                  }
                  className="login-input"
                />

                <button
                  className="submit-btn"
                  type="button"
                  onClick={
                    sendOtp
                  }
                  disabled={
                    resetLoading
                  }
                >
                  {resetLoading ? (
                    <span className="btn-spinner"></span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </>
            ) : (
              <>
                <p>
                  OTP sent
                  to{" "}
                  <strong>
                    {
                      resetData.email
                    }
                  </strong>
                </p>

                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  maxLength={
                    6
                  }
                  value={
                    resetData.otp
                  }
                  onChange={
                    handleResetChange
                  }
                  className="login-input"
                />

                <div className="password-box">
                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    placeholder="New Password"
                    value={
                      resetData.newPassword
                    }
                    onChange={
                      handleResetChange
                    }
                    className="login-input"
                  />

                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                  >
                    {showNewPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>

                <div className="password-box">
                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={
                      resetData.confirmPassword
                    }
                    onChange={
                      handleResetChange
                    }
                    className="login-input"
                  />

                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() =>
                      setStep(
                        1
                      )
                    }
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="submit-btn modal-submit"
                    onClick={
                      resetPassword
                    }
                    disabled={
                      resetLoading
                    }
                  >
                    {resetLoading ? (
                      <span className="btn-spinner"></span>
                    ) : (
                      "Reset"
                    )}
                  </button>
                </div>
              </>
            )}

            {resetMsg && (
              <p
                className={`reset-msg ${
                  resetMsgType ===
                  "success"
                    ? "reset-msg-success"
                    : ""
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