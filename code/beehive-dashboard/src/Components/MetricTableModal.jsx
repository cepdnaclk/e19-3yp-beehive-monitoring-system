import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

import Table from "./Table";
import { timeTo12Hour } from "../Utilities/DateTime";

const WINDOWS = {
  hour: 3600000,
  day: 86400000,
  week: 604800000,
  month: 2629800000,
};

const RANGES = [
  { value: "hour", label: "Hour" },
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

// A week of readings is a few thousand rows. Rendering all of them makes the
// dialog crawl for no benefit, so the newest slice is shown and the count is
// stated underneath.
const MAX_ROWS = 200;

const MetricTableModal = ({ metric, data, hiveName, onClose }) => {
  const [duration, setDuration] = useState("day");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const { rows, stats, total } = useMemo(() => {
    const cutoff = Date.now() - WINDOWS[duration];
    const windowed = data
      .filter((reading) => new Date(reading.createdAt).getTime() >= cutoff)
      .map((reading) => ({
        id: reading.createdAt,
        at: new Date(reading.createdAt),
        value: Number(reading[metric.key]),
      }))
      .filter((row) => Number.isFinite(row.value))
      .sort((a, b) => b.at - a.at);

    const values = windowed.map((row) => row.value);
    const summary = values.length
      ? {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((sum, n) => sum + n, 0) / values.length,
        }
      : null;

    return {
      rows: windowed.slice(0, MAX_ROWS),
      stats: summary,
      total: windowed.length,
    };
  }, [data, duration, metric.key]);

  const show = (value) => `${value.toFixed(metric.digits)}${metric.unit}`;

  const columns = [
    {
      key: "time",
      label: "Time",
      render: (row) => (
        <>
          <b>{timeTo12Hour(row.at)}</b>
          <span>{format(row.at, "MMM d")}</span>
        </>
      ),
    },
    {
      key: "value",
      label: metric.label,
      align: "right",
      render: (row) => show(row.value),
    },
  ];

  return (
    <div
      className="graphs-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${metric.label} readings`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="graphs-modal__panel">
        <header className="graphs-modal__head">
          <div>
            <h2>{metric.label} readings</h2>
            <p>{hiveName}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </header>

        <div className="graphs-modal__controls">
          <div className="graphs-modal__ranges" role="group" aria-label="Time range">
            {RANGES.map((range) => (
              <button
                key={range.value}
                type="button"
                className={duration === range.value ? "is-active" : undefined}
                onClick={() => setDuration(range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>

          {stats && (
            <dl className="graphs-modal__stats">
              <div>
                <dt>Min</dt>
                <dd>{show(stats.min)}</dd>
              </div>
              <div>
                <dt>Average</dt>
                <dd style={{ color: metric.color }}>{show(stats.avg)}</dd>
              </div>
              <div>
                <dt>Max</dt>
                <dd>{show(stats.max)}</dd>
              </div>
              <div>
                <dt>Readings</dt>
                <dd>{total}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className="graphs-modal__body">
          {rows.length === 0 ? (
            <p className="graphs-modal__empty">
              No readings in this range.
            </p>
          ) : (
            <Table rows={rows} columns={columns} />
          )}
        </div>

        {total > rows.length && (
          <footer className="graphs-modal__foot">
            Showing the latest {rows.length} of {total} readings in this range.
          </footer>
        )}
      </div>
    </div>
  );
};

export default MetricTableModal;
