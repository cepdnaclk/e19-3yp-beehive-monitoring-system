import "../Styles/Components/BatteryIndicator.scss";

/*
A battery drawn as a battery: a cell with a terminal that fills proportionally
and changes colour as it drains. Reads at a glance without having to parse a
number, which a plain progress bar does not.

The earlier version blinked its whole fill on and off at 1 Hz when low. That is
hard to read and a problem for anyone sensitive to flashing, so the low state is
carried by colour and a bolt mark on the cell instead.
*/

const THRESHOLDS = [
  { limit: 20, tone: "low", label: "Low" },
  { limit: 60, tone: "medium", label: "Fair" },
  { limit: Infinity, tone: "good", label: "Good" },
];

const BatteryIndicator = ({ level, showLabel = false }) => {
  const value = Number(level);
  const hasReading = Number.isFinite(value);
  const percent = hasReading ? Math.max(0, Math.min(100, value)) : 0;
  const { tone, label } = hasReading
    ? THRESHOLDS.find((t) => percent < t.limit)
    : { tone: "unknown", label: "No data" };

  // Cell interior runs from x=2 to x=24, so the fill can be at most 22 wide.
  const fillWidth = (22 * percent) / 100;

  return (
    <div className={`battery battery--${tone}`}>
      <svg
        className="battery__cell"
        viewBox="0 0 30 14"
        role="img"
        aria-label={
          hasReading ? `Battery ${percent.toFixed(0)} percent` : "Battery level unknown"
        }
      >
        <rect
          className="battery__shell"
          x="0.6"
          y="0.6"
          width="24.8"
          height="12.8"
          rx="3"
        />
        <rect className="battery__terminal" x="26.4" y="4.4" width="3" height="5.2" rx="1.2" />
        {percent > 0 && (
          <rect
            className="battery__fill"
            x="2"
            y="2"
            width={fillWidth}
            height="10"
            rx="1.5"
          />
        )}
        {tone === "low" && (
          // Bolt on the cell, so a flat battery is obvious even in greyscale
          // or to someone who cannot separate the red from the green.
          <path
            className="battery__bolt"
            d="M14.6 3.2 L10.2 7.9 L13.1 7.9 L11.9 10.8 L16.3 6.1 L13.4 6.1 Z"
          />
        )}
      </svg>

      <span className="battery__value">
        {hasReading ? `${percent.toFixed(0)}%` : "—"}
      </span>

      {showLabel && <span className="battery__status">{label}</span>}
    </div>
  );
};

export default BatteryIndicator;
