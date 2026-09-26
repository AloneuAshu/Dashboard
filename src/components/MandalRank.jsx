import { useState } from "react";
import { niceName, num, pct } from "../lib/format.js";
import Fold from "./Fold.jsx";

const COLUMNS = [
  { id: "label", label: "Mandal", numeric: false },
  { id: "electorate", label: "Roll", numeric: true },
  { id: "sex_ratio", label: "Women", numeric: true },
  { id: "age_60_share", label: "60+", numeric: true, pct: true },
  { id: "first_time_share", label: "18–19", numeric: true, pct: true },
];

export default function MandalRank({ mandals, onPick, startOpen = false }) {
  const [sort, setSort] = useState({ id: "electorate", dir: "desc" });
  const rows = mandals.slice().sort((a, b) => {
    const left = sort.id === "label" ? a.label : a[sort.id] || 0;
    const right = sort.id === "label" ? b.label : b[sort.id] || 0;
    if (left < right) return sort.dir === "asc" ? -1 : 1;
    if (left > right) return sort.dir === "asc" ? 1 : -1;
    return 0;
  });
  const oldest = mandals.reduce((best, item) => ((item.age_60_share || 0) > (best.age_60_share || 0) ? item : best), mandals[0]);
  const thinnest = mandals.reduce(
    (best, item) => ((item.first_time_share ?? 1) < (best.first_time_share ?? 1) ? item : best),
    mandals[0]
  );
  const youngest = mandals.reduce(
    (best, item) => ((item.mean_age ?? 99) < (best.mean_age ?? 99) ? item : best),
    mandals[0]
  );

  function choose(id) {
    setSort((current) =>
      current.id === id ? { id, dir: current.dir === "desc" ? "asc" : "desc" } : { id, dir: id === "label" ? "asc" : "desc" }
    );
  }

  return (
    <Fold
      icon="pin"
      title="How the mandals compare"
      meta={`Oldest ${niceName(oldest.label)}. Youngest ${niceName(youngest.label)}. Thinnest 18–19 ${niceName(thinnest.label)}.`}
      count={mandals.length}
      startOpen={startOpen}
    >
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
            {rows.map((item) => (
              <tr key={item.id}>
                <th scope="row">
                  <button type="button" onClick={() => onPick({ type: "mandal", key: item.label.toUpperCase() })}>
                    {niceName(item.label)}
                  </button>
                </th>
                <td>{num(item.electorate)}</td>
                <td>{item.sex_ratio ? num(item.sex_ratio) : "—"}</td>
                <td>{pct(item.age_60_share)}</td>
                <td>{pct(item.first_time_share)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fold>
  );
}
