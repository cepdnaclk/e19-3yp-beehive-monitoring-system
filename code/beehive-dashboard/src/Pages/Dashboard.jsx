import { useState, useEffect, useContext, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faCubes,
  faTemperatureHalf,
  faDroplet,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import Navbar from "../Components/NavbarBlack";
import BeehiveCard from "../Components/BeehiveCard";
import HoneycombPattern from "../Components/HoneycombPattern";
import { BeehiveContext } from "../Context/BeehiveContext";
import "../Styles/Pages/Dashboard.scss";

const LOW_BATTERY = 20;

// Values arrive as strings on the Beehive document, and a hive that has never
// reported has none at all, so average only over the ones that parse.
const average = (values) => {
  const numbers = values.map(Number).filter((n) => Number.isFinite(n));
  if (numbers.length === 0) return null;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
};

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { beehives, fetchBeehives } = useContext(BeehiveContext);

  useEffect(() => {
    fetchBeehives().finally(() => setIsLoading(false));
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await fetchBeehives();
    } finally {
      setIsSyncing(false);
    }
  };

  const stats = useMemo(() => {
    const temperature = average(beehives.map((b) => b.Temperature));
    const humidity = average(beehives.map((b) => b.Humidity));
    const lowBattery = beehives.filter(
      (b) => Number(b.Battery_level) < LOW_BATTERY
    ).length;

    return [
      {
        icon: faCubes,
        tone: "amber",
        label: "Hives",
        value: String(beehives.length),
      },
      {
        icon: faTemperatureHalf,
        tone: "red",
        label: "Avg temperature",
        value: temperature === null ? "—" : `${temperature.toFixed(1)}°C`,
      },
      {
        icon: faDroplet,
        tone: "blue",
        label: "Avg humidity",
        value: humidity === null ? "—" : `${humidity.toFixed(1)}%`,
      },
      {
        icon: faTriangleExclamation,
        tone: lowBattery > 0 ? "red" : "green",
        label: "Low battery",
        value: String(lowBattery),
      },
    ];
  }, [beehives]);

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        <header className="dashboard-hero">
          <HoneycombPattern id="dash-comb" className="dashboard-hero__comb" />

          <div className="dashboard-hero__top">
            <div>
              <span className="dashboard-hero__eyebrow">Apiary overview</span>
              <h1>Your hives</h1>
              <p>
                {isLoading
                  ? "Fetching the latest readings…"
                  : `${beehives.length} hive${
                      beehives.length === 1 ? "" : "s"
                    } reporting. Select one to see its history.`}
              </p>
            </div>

            <button
              type="button"
              className="dashboard-sync"
              onClick={handleSync}
              disabled={isSyncing || isLoading}
            >
              <FontAwesomeIcon
                icon={faArrowsRotate}
                className={isSyncing ? "is-spinning" : ""}
              />
              {isSyncing ? "Syncing…" : "Sync"}
            </button>
          </div>

          <ul className="dashboard-stats">
            {stats.map(({ icon, tone, label, value }) => (
              <li key={label} className={`dashboard-stat tone-${tone}`}>
                <span className="dashboard-stat__icon">
                  <FontAwesomeIcon icon={icon} />
                </span>
                <span className="dashboard-stat__text">
                  <strong>{value}</strong>
                  <small>{label}</small>
                </span>
              </li>
            ))}
          </ul>
        </header>

        {isLoading ? (
          // Skeletons in the real grid keep the layout from jumping once the
          // data lands.
          <div className="hive-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="hive-skeleton" />
            ))}
          </div>
        ) : beehives.length === 0 ? (
          <div className="dashboard-empty">
            <h2>No hives yet</h2>
            <p>
              Once a hive publishes its first reading it will appear here
              automatically.
            </p>
          </div>
        ) : (
          <div className="hive-grid">
            {beehives.map((data) => (
              <BeehiveCard key={data._id} beehiveData={data} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
