import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../Context/AuthContext";
import "../Styles/Pages/SignIn.scss";

// Mirrors the policy enforced in the backend's registerUser controller, so the
// rule is visible before submitting rather than coming back as a 400.
const PASSWORD_RULE =
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const passwordsMatch =
    !formData.confirmPassword || formData.password === formData.confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!PASSWORD_RULE.test(formData.password)) {
      setError(
        "Password needs 8+ characters with an uppercase, a lowercase, a number and a special character."
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("The two passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      // register resolves to false when the API rejects the details; the old
      // version tested the promise itself, which is always truthy, so it
      // navigated to the dashboard even on failure.
      const success = await register(
        formData.username,
        formData.email,
        formData.password
      );
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Could not create that account. The email may already be in use.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <header className="auth-form__header">
        <h2>Create your account</h2>
        <p>Start monitoring your apiary in minutes.</p>
      </header>

      <div className="auth-field">
        <label htmlFor="username">Username</label>
        <div className="auth-input">
          <FontAwesomeIcon icon={faUser} className="auth-input__icon" />
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Letters and numbers only"
            autoComplete="username"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="email">Email</label>
        <div className="auth-input">
          <FontAwesomeIcon icon={faEnvelope} className="auth-input__icon" />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="password">Password</label>
        <div className="auth-input">
          <FontAwesomeIcon icon={faLock} className="auth-input__icon" />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="auth-input__toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="confirmPassword">Confirm password</label>
        <div className={`auth-input${passwordsMatch ? "" : " auth-input--invalid"}`}>
          <FontAwesomeIcon icon={faLock} className="auth-input__icon" />
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Retype your password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        {!passwordsMatch && (
          <span className="auth-field__hint">Passwords do not match.</span>
        )}
      </div>

      {error && (
        <p className="auth-error" role="alert">
          <FontAwesomeIcon icon={faCircleExclamation} />
          {error}
        </p>
      )}

      <button type="submit" className="auth-submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

export default RegisterForm;
