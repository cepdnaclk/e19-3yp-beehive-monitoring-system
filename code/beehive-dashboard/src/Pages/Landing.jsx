import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureHalf,
  faDroplet,
  faCloud,
  faWeightHanging,
  faMicrochip,
  faTowerBroadcast,
  faChartLine,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import Navbar from "../Components/Navbar";
import Banner from "../Assets/Banner.png";
import HiveBox from "../Assets/Beehive_box.png";
import Logo from "../Assets/Logo.png";
import HoneycombPattern from "../Components/HoneycombPattern";
import "../Styles/Pages/Landing.scss";

const METRICS = [
  {
    key: "temperature",
    icon: faTemperatureHalf,
    title: "Temperature",
    copy: "The brood nest has to stay within a narrow band. A drift either way is the earliest sign something is wrong.",
  },
  {
    key: "humidity",
    icon: faDroplet,
    title: "Humidity",
    copy: "Too damp invites mould, too dry stresses the brood. Watch how the colony holds it through the day.",
  },
  {
    key: "co2",
    icon: faCloud,
    title: "CO₂",
    copy: "Rises overnight as the colony clusters and respires. A useful read on activity and ventilation.",
  },
  {
    key: "weight",
    icon: faWeightHanging,
    title: "Weight",
    copy: "Dips as foragers leave and climbs as they return with nectar. The clearest measure of a honey flow.",
  },
];

const STEPS = [
  {
    icon: faMicrochip,
    title: "Sensors on the hive",
    copy: "A Raspberry Pi reads temperature, humidity, CO₂ and load cells under the hive, then packages each reading.",
  },
  {
    icon: faTowerBroadcast,
    title: "Readings stream in",
    copy: "Every reading is published over MQTT and stored the moment it arrives, no manual collection needed.",
  },
  {
    icon: faChartLine,
    title: "Watch it live",
    copy: "Your dashboard charts the history hive by hive and raises an alert when a battery starts running flat.",
  },
];

function Landing() {
  return (
    <div className="landing-page">
      <Navbar />

      <section className="landing-hero">
        <img src={Banner} alt="" className="landing-hero__photo" />
        <div className="landing-hero__scrim" />

        <div className="landing-hero__inner">
          <div className="landing-hero__copy">
            <span className="landing-hero__eyebrow">Beehive monitoring system</span>
            <h1>
              Monitoring hives,
              <br />
              <em>nurturing lives.</em>
            </h1>
            <p>
              Insights from the heartbeat of the colony. Live readings from every
              hive in your apiary, so you know how they are doing without opening
              a single lid.
            </p>

            <div className="landing-hero__actions">
              <Link to="/signin" className="landing-btn landing-btn--primary">
                Sign in
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
              <a href="#metrics" className="landing-btn landing-btn--ghost">
                What it tracks
              </a>
            </div>

            <ul className="landing-hero__chips">
              {METRICS.map(({ key, icon, title }) => (
                <li key={key}>
                  <FontAwesomeIcon icon={icon} />
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="landing-section" id="metrics">
        <HoneycombPattern id="landing-comb" className="landing-section__comb" />

        <header className="landing-section__head">
          <span className="landing-section__eyebrow">What every hive reports</span>
          <h2>Four readings, once a second</h2>
          <p>
            Each hive sends the same four measurements. Together they describe
            the colony's health, its activity and its stores.
          </p>
        </header>

        <ul className="landing-metrics">
          {METRICS.map(({ key, icon, title, copy }) => (
            <li key={key} className={`landing-metric landing-metric--${key}`}>
              <span className="landing-metric__icon">
                <FontAwesomeIcon icon={icon} />
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="landing-steps-section">
        <div className="landing-steps-section__inner">
          <div className="landing-steps-section__aside">
            <img src={HiveBox} alt="A Langstroth beehive" />
          </div>

          <div className="landing-steps-section__body">
            <span className="landing-section__eyebrow">How it works</span>
            <h2>From the hive to your screen</h2>

            <ol className="landing-steps">
              {STEPS.map(({ icon, title, copy }, index) => (
                <li key={title}>
                  <span className="landing-step__icon">
                    <FontAwesomeIcon icon={icon} />
                  </span>
                  <div>
                    <h3>
                      <b>{String(index + 1).padStart(2, "0")}</b>
                      {title}
                    </h3>
                    <p>{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <HoneycombPattern id="landing-cta-comb" className="landing-cta__comb" />
        <div className="landing-cta__inner">
          <h2>Ready to look inside the hive?</h2>
          <p>Sign in to see every hive in your apiary reporting live.</p>
          <Link to="/signin" className="landing-btn landing-btn--primary">
            Sign in
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <img src={Logo} alt="BeeZee" />
        <p>Beehive Monitoring System</p>
      </footer>
    </div>
  );
}

export default Landing;
