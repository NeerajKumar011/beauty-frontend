import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import "../styles/Signup.css";

function Signup() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      confirm: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  /* ======================
     Password Strength
  ====================== */
  const getStrength =
    (pw) => {
      let score = 0;

      if (
        pw.length >= 8
      )
        score++;

      if (
        /[A-Z]/.test(
          pw
        )
      )
        score++;

      if (
        /[0-9]/.test(
          pw
        )
      )
        score++;

      if (
        /[^A-Za-z0-9]/.test(
          pw
        )
      )
        score++;

      return score;
    };

  const labels = [
    "",
    "Weak",
    "Fair",
    "Good",
    "Strong",
  ];

  const strength =
    useMemo(
      () =>
        getStrength(
          form.password
        ),
      [form.password]
    );

  /* ======================
     Input
  ====================== */
  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

    setError("");
    setSuccess("");
  };

  /* ======================
     Signup
  ====================== */
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");
      setSuccess("");

      if (
        form.password !==
        form.confirm
      ) {
        setError(
          "Passwords do not match."
        );
        return;
      }

      if (
        strength < 2
      ) {
        setError(
          "Please choose a stronger password."
        );
        return;
      }

      try {
        setLoading(true);

        /* Create */
        const res =
          await fetch(
            `${API_BASE_URL}/signup`,
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                {
                  name:
                    form.name.trim(),
                  email:
                    form.email.trim(),
                  password:
                    form.password,
                }
              ),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          setError(
            data.message ||
              "Signup failed."
          );
          return;
        }

        /* Auto Login */
        const loginRes =
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
                {
                  email:
                    form.email.trim(),
                  password:
                    form.password,
                }
              ),
            }
          );

        const loginData =
          await loginRes.json();

        if (
          !loginRes.ok
        ) {
          setSuccess(
            "Account created. Please login."
          );

          setTimeout(
            () =>
              navigate(
                "/login"
              ),
            1500
          );

          return;
        }

        localStorage.setItem(
          "token",
          loginData.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            loginData.user
          )
        );

        navigate("/");
        window.location.reload();
      } catch {
        setError(
          "Unable to connect. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  const passwordsMatch =
    form.confirm &&
    form.password ===
      form.confirm;

  return (
    <div className="signup-root">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="signup-card">
        {/* Brand */}
        <div className="brand">
          <div className="brand-icon">
            💄
          </div>

          <span className="brand-name">
            Neha Beauty
            Parlour
          </span>
        </div>

        {/* Heading */}
        <h1 className="signup-heading">
          Create Your
          Account
        </h1>

        <p className="signup-subtext">
          Join us to book
          appointments
          and enjoy a
          premium beauty
          experience.
        </p>

        {/* Alerts */}
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {success && (
          <div className="success-banner">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={
            handleSubmit
          }
          className="signup-form"
        >
          {/* Name */}
          <div className="field-group">
            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              required
              placeholder="Enter full name"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              className="signup-input"
            />
          </div>

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
              className="signup-input"
            />
          </div>

          {/* Password */}
          <div className="field-group">
            <label>
              Password
            </label>

            <div className="password-box">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                required
                placeholder="Minimum 8 characters"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                className="signup-input"
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

            {form.password && (
              <p
                className={`strength-text strength-${strength}`}
              >
                Strength:{" "}
                {
                  labels[
                    strength
                  ]
                }
              </p>
            )}
          </div>

          {/* Confirm */}
          <div className="field-group">
            <label>
              Confirm
              Password
            </label>

            <div className="password-box">
              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                name="confirm"
                required
                placeholder="Repeat password"
                value={
                  form.confirm
                }
                onChange={
                  handleChange
                }
                className={`signup-input ${
                  passwordsMatch
                    ? "input-match"
                    : ""
                }`}
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowConfirm(
                    !showConfirm
                  )
                }
              >
                {showConfirm
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="terms-row">
            <label>
              <input
                type="checkbox"
                required
              />{" "}
              I agree to
              Terms &
              Privacy
              Policy
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="submit-btn"
            disabled={
              loading
            }
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Bottom */}
        <p className="login-text">
          Already have an
          account?{" "}
          <Link
            to="/login"
            className="login-link"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;