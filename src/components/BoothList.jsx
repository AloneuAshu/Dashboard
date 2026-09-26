import { useState } from "react";
import { num } from "../lib/format.js";
import Fold from "./Fold.jsx";

const COLUMNS = [
  { id: "part_no", label: "Part" },
  { id: "station", label: "Station" },
  { id: "electorate", label: "Roll" },
  { id: "sex_ratio", label: "Women" },
  { id: "mean_age", label: "Age" },
  { id: "first_time_18_19", label: "18–19" },
];

export default function BoothList({ booths, onPick, mandalKey }) {
  const [sort, setSort] = useState({ id: "part_no", dir: "asc" });
  if (!booths?.length) return null;
  const rows = booths.slice().sort((a, b) => {
    const left = a[sort.id] ?? "";
    const right = b[sort.id] ?? "";
    if (left < right) return sort.dir === "asc" ? -1 : 1;
    if (left > right) return sort.dir === "asc" ? 1 : -1;
    return 0;
  });

  function choose(id) {
    setSort((current) =>
      current.id === id ? { id, dir: current.dir === "asc" ? "desc" : "asc" } : { id, dir: id === "station" ? "asc" : "desc" }
    );
  }

  return (
    <Fold icon="booth" title="Booths" meta="Roll brief. Not the 2023 vote." count={booths.length}>
      <div className="rank-scroll">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.id}>
                  <button type="button" onClick={() => choose(column.id)} aria-pressed={sort.id === column.id}>
                    {column.label}{sort.id === column.id ? (sort.dir === "desc" ? " ↓" : " ↑") : ""}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((booth) => (
              <tr key={booth.id}>
                <th scope="row">
                  <button
                    type="button"
                    onClick={() => onPick({ type: "booth", id: booth.id, mandalKey, partNo: booth.part_no })}
                  >
                    {booth.part_no}
                  </button>
                </th>
                <td className="station">{booth.station || "—"}</td>
                <td>{num(booth.electorate)}</td>
                <td>{booth.sex_ratio ? num(booth.sex_ratio) : "—"}</td>
                <td>{booth.mean_age ?? "—"}</td>
                <td>{num(booth.first_time_18_19)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fold>
  );
}
