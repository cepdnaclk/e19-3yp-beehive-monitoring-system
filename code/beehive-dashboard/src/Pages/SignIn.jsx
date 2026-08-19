import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureHalf,
  faDroplet,
  faCloud,
  faWeightHanging,
} from "@fortawesome/free-solid-svg-icons";

import BeeBanner from "../Assets/Bee w.jpg";
import Logo from "../Assets/Logo.png";
import LoginForm from "../Components/LoginForm";
import RegisterForm from "../Components/RegisterForm";
import HoneycombPattern from "../Components/HoneycombPattern";

import "../Styles/Pages/SignIn.scss";

const METRICS = [
  { icon: faTemperatureHalf, label: "Temperature" },
  { icon: faDroplet, label: "Humidity" },
  { icon: faCloud, label: "CO₂" },
  { icon: faWeightHanging, label: "Weight" },
];

function SignIn() {
  const [mode, setMode] = useState("login");
  const isLogin = mode === "login";

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <img
          src={BeeBanner}
          alt="A honeybee approaching willow blossom"
          className="auth-visual__photo"
        />
        <div className="auth-visual__scrim" />
        <HoneycombPattern id="auth-visual-comb" className="auth-visual__comb" />

        <div className="auth-visual__content">
          <span className="auth-visual__eyebrow">Beehive monitoring</span>
          <h1 className="auth-visual__title">
            Every hive, <em>in sight.</em>
          </h1>
          <p className="auth-visual__lede">
            Live readings from each hive in your apiary, streamed straight from
            the sensors and charted the moment they land.
          </p>

          <ul className="auth-visual__metrics">
            {METRICS.map(({ icon, label }) => (
              <li key={label}>
                <FontAwesomeIcon icon={icon} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="auth-panel">
        <HoneycombPattern id="auth-panel-comb" className="auth-panel__comb" />

        <div className="auth-card">
          <Link to="/" className="auth-card__logo">
            <img src={Logo} alt="BeeZee" />
          </Link>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <p className="auth-card__switch">
            {isLogin ? "New to BeeZee?" : "Already have an account?"}
            <button type="button" onClick={() => setMode(isLogin ? "register" : "login")}>
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}

export default SignIn;
