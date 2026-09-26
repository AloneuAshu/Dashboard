import Fold from "./Fold.jsx";

const ROWS = [
  { id: "promised", label: "Promised", color: "#f2c14e", match: () => true },
  { id: "delivered", label: "Delivered", color: "#8fd19a", match: (item) => item.delivery.status === "done" },
  { id: "pending", label: "Pending", color: "#9fd4e4", match: (item) => item.delivery.status !== "done" },
];

export default function PromiseGraph({ promises }) {
  const total = promises.length;
  if (!total) return null;
  const delivered = promises.filter((item) => item.delivery.status === "done").length;
  const pending = total - delivered;

  return (
    <Fold icon="scale" title="Promised, delivered, and pending" meta={`${delivered} delivered · ${pending} pending`} count={total}>
      {ROWS.map((row) => {
        const count = promises.filter(row.match).length;
        return (
          <div key={row.id} className="graph-row">
            <div className="graph-label">
              <span>{row.label}</span>
              <b>{count}</b>
            </div>
            <div className="graph-track" role="img" aria-label={`${row.label}: ${count} of ${total}`}>
              <i style={{ width: `${(count / total) * 100}%`, background: row.color }} />
            </div>
          </div>
        );
      })}
      <p className="graph-note">Pending means the last report does not call the work finished. That includes work already started.</p>
      <Fold title="Each promise" count={total}>
        <ul className="graph-list">
          {promises.map((item) => {
            const done = item.delivery.status === "done";
            return (
              <li key={item.id}>
                <em className={done ? "done" : "pending"}>{done ? "Delivered" : "Pending"}</em>
                <a href={item.delivery.source_url} target="_blank" rel="noreferrer">{item.title}</a>
              </li>
            );
          })}
        </ul>
      </Fold>
    </Fold>
  );
}
