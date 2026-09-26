import { pct } from "../lib/format.js";
import Fold from "./Fold.jsx";

const BANDS = [
  ["18-19", "#f2c14e"],
  ["20-29", "#e09a3e"],
  ["30-39", "#d4c4a8"],
  ["40-49", "#8fd0c6"],
  ["50-59", "#6eaec4"],
  ["60-69", "#8fd19a"],
  ["70+", "#5ea87a"],
];

export default function AgeBar({ bands, startOpen = false }) {
  if (!bands) return null;
  const total = BANDS.reduce((sum, [key]) => sum + (bands[key] || 0), 0);
  if (!total) return null;
  const older = ((bands["60-69"] || 0) + (bands["70+"] || 0)) / total;
  return (
    <Fold icon="bars" title="Age bands" meta={`60 or above ${pct(older)} · 18–19 ${pct((bands["18-19"] || 0) / total)}`} startOpen={startOpen}>
      <div className="bar" aria-hidden="true">
        {BANDS.map(([key, color]) => (
          <i key={key} style={{ width: `${((bands[key] || 0) / total) * 100}%`, background: color }} />
        ))}
      </div>
      <div className="legend">
        {BANDS.map(([key]) => (
          <span key={key}>
            {key} <b>{pct((bands[key] || 0) / total)}</b>
          </span>
        ))}
      </div>
    </Fold>
  );
}
