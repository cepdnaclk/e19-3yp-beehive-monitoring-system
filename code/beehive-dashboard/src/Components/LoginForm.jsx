import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../Context/AuthContext";
import "../Styles/Pages/SignIn.scss";

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  // Local rather than the context's isLoading, which starts true and would
  // leave the button disabled before anyone has even submitted.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clearing on edit stops a stale failure sitting under a corrected form.
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("That email and password did not match. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <header className="auth-form__header">
        <h2>Welcome back</h2>
        <p>Sign in to check on your hives.</p>
      </header>

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
            placeholder="Your password"
            autoComplete="current-password"
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

      {error && (
        <p className="auth-error" role="alert">
          <FontAwesomeIcon icon={faCircleExclamation} />
          {error}
        </p>
      )}

      <button type="submit" className="auth-submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default LoginForm;
