import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFileCsv,
  faTemperatureHalf,
  faDroplet,
  faCloud,
  faWeightHanging,
  faLocationDot,
  faTableList,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

import Navbar from "../Components/NavbarBlack";
import MetricTableModal from "../Components/MetricTableModal";
import ImageCarousel from "../Components/Carousel";
import BatteryIndicator from "../Components/BatteryIndicator";
import { MyChartHandler } from "../Components/MyChartHandler";
import { getCameraRecordByBeehiveId } from "../Services/cameraRecordService";
import {
  getBeehiveMetricsByBeehiveId,
  downloadBeehiveMetricsCsv,
} from "../Services/beehiveMetricsService";
import "../Styles/Pages/Graphs.scss";

const DURATIONS = [
  { value: "hour", label: "Last hour" },
  { value: "day", label: "Last day" },
  { value: "week", label: "Last week" },
  { value: "month", label: "Last month" },
];

const CHARTS = [
  { key: "temperature", label: "Temperature", unit: "°C", icon: faTemperatureHalf, color: "#e0603a", digits: 1 },
  { key: "humidity", label: "Humidity", unit: "%", icon: faDroplet, color: "#3b8fd4", digits: 1 },
  { key: "CO2", label: "CO₂", unit: " ppm", icon: faCloud, color: "#5b9e5b", digits: 0 },
  { key: "weight", label: "Weight", unit: " kg", icon: faWeightHanging, color: "#9a6b3f", digits: 2 },
];

const Graphs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const beehiveData = location.state?.beehiveData;

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraRecords, setCameraRecords] = useState([]);
  const [selectedCameraRecord, setSelectedCameraRecord] = useState(null);
  const [tableConfig, setTableConfig] = useState(null);
  const [durations, setDurations] = useState({
    temperature: "day",
    humidity: "day",
    CO2: "day",
    weight: "day",
  });

  useEffect(() => {
    if (!beehiveData) return undefined;

    let cancelled = false;

    const load = async () => {
      // The two requests are independent. Camera records answer 404 for a hive
      // that has none, and that rejection used to skip setIsLoading(false) and
      // strand the whole page on "Loading..." forever.
      const [metrics, camera] = await Promise.allSettled([
        getBeehiveMetricsByBeehiveId(beehiveData._id),
        getCameraRecordByBeehiveId(beehiveData._id),
      ]);

      if (cancelled) return;

      if (metrics.status === "fulfilled") {
        // A null from a failed sensor read would crash the .toFixed() calls in
        // the summary tiles, so incomplete readings are dropped here.
        setData(
          metrics.value.filter(
            (m) =>
              m.temperature != null &&
              m.humidity != null &&
              m.CO2 != null &&
              m.weight != null
          )
        );
      }

      if (camera.status === "fulfilled") {
        const records = camera.value.cameraRecords ?? [];
        setCameraRecords(records);
        setSelectedCameraRecord(records[0] ?? null);
      }

      setIsLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [beehiveData]);

  // Reached by typing /graph directly, where there is no hive in router state.
  if (!beehiveData) {
    return <Navigate to="/dashboard" replace />;
  }

  const latest = data[data.length - 1];

  const handleDownloadCsv = async () => {
    try {
      const response = await downloadBeehiveMetricsCsv(beehiveData._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `beehive-metrics-${beehiveData._id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CSV file:", error);
    }
  };

  return (
    <div className="graphs-page">
      <Navbar />

      <main className="graphs-main">
        <header className="graphs-head">
          <button
            type="button"
            className="graphs-back"
            onClick={() => navigate("/dashboard")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Dashboard
          </button>

          <div className="graphs-head__title">
            <h1>{beehiveData.name}</h1>
            {beehiveData.location && (
              <p>
                <FontAwesomeIcon icon={faLocationDot} />
                {beehiveData.location}
              </p>
            )}
          </div>

          <button type="button" className="graphs-export" onClick={handleDownloadCsv}>
            <FontAwesomeIcon icon={faFileCsv} />
            Export CSV
          </button>
        </header>

        <section className="graphs-summary">
          {CHARTS.map(({ key, label, unit, icon, digits }) => (
            <div key={key} className={`graphs-stat graphs-stat--${key}`}>
              <span className="graphs-stat__icon">
                <FontAwesomeIcon icon={icon} />
              </span>
              <span className="graphs-stat__text">
                <small>{label}</small>
                <strong>
                  {latest && Number.isFinite(Number(latest[key]))
                    ? `${Number(latest[key]).toFixed(digits)}${unit}`
                    : "—"}
                </strong>
              </span>
            </div>
          ))}

          <div className="graphs-stat graphs-stat--battery">
            <span className="graphs-stat__text">
              <small>Battery</small>
              <BatteryIndicator
                level={Number(beehiveData.Battery_level)}
                showLabel
              />
            </span>
          </div>
        </section>

        {isLoading ? (
          <div className="graphs-grid">
            {CHARTS.map(({ key }) => (
              <div key={key} className="graphs-skeleton" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="graphs-empty">
            <h2>No readings yet</h2>
            <p>This hive has not reported any measurements so far.</p>
          </div>
        ) : (
          <div className="graphs-grid">
            {CHARTS.map(({ key, label, unit, color, digits }) => (
              <article key={key} className="graph-card">
                <header className="graph-card__head">
                  <div>
                    <h2>{label}</h2>
                    <strong style={{ color }}>
                      {latest && Number.isFinite(Number(latest[key]))
                        ? `${Number(latest[key]).toFixed(digits)}${unit}`
                        : "—"}
                    </strong>
                  </div>

                  <div className="graph-card__controls">
                    <select
                      value={durations[key]}
                      aria-label={`${label} time range`}
                      onChange={(e) =>
                        setDurations({ ...durations, [key]: e.target.value })
                      }
                    >
                      {DURATIONS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      aria-label={`Show ${label} readings as a table`}
                      onClick={() =>
                        setTableConfig({ key, label, unit, color, digits })
                      }
                    >
                      <FontAwesomeIcon icon={faTableList} />
                    </button>
                  </div>
                </header>

                <MyChartHandler
                  data={data}
                  dataKeys={[key]}
                  colors={[color]}
                  unit={unit}
                  type="area"
                  duration={durations[key]}
                />
              </article>
            ))}
          </div>
        )}

        <section className="graphs-camera">
          <header>
            <h2>
              <FontAwesomeIcon icon={faVideo} />
              Camera records
            </h2>
            {cameraRecords.length > 0 && (
              <select
                aria-label="Select a camera record"
                onChange={(e) =>
                  setSelectedCameraRecord(
                    cameraRecords.find((r) => r._id === e.target.value) ?? null
                  )
                }
              >
                {cameraRecords.map((record) => (
                  <option value={record._id} key={record._id}>
                    {record.createdAtLocal?.slice(0, 20) ?? "Recording"}
                  </option>
                ))}
              </select>
            )}
          </header>

          {selectedCameraRecord?.sample_image_urls?.length ? (
            <div className="graphs-camera__body">
              <ImageCarousel imageUrls={selectedCameraRecord.sample_image_urls} />
              <dl className="graphs-camera__meta">
                <div>
                  <dt>Folder size</dt>
                  <dd>
                    {(
                      Number(selectedCameraRecord.folder_size.split(" ")[0]) /
                      1048576
                    ).toFixed(2)}{" "}
                    MB
                  </dd>
                </div>
                <div>
                  <dt>Duration</dt>
                  <dd>10 min</dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="graphs-camera__empty">
              No camera records for this hive.
            </p>
          )}
        </section>
      </main>

      {tableConfig && (
        <MetricTableModal
          metric={tableConfig}
          data={data}
          hiveName={beehiveData.name}
          onClose={() => setTableConfig(null)}
        />
      )}
    </div>
  );
};

export default Graphs;
