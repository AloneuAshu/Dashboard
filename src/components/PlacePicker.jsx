import { placeLabel } from "../lib/format.js";

export default function PlacePicker({ picked, assembly, mandals, mandalRow, onPick }) {
  const seatId = picked?.type === "seat" ? picked.id : mandalRow?.ac_id || "";
  const list = (seatId ? mandals.filter((item) => item.ac_id === seatId) : mandals)
    .slice()
    .sort((a, b) => a.label.localeCompare(b.label));
  const clusterOn = !picked || (picked.type === "district" && picked.name === "Mancherial");

  return (
    <div className="picker" role="group" aria-label="Place for the brief">
      <button type="button" aria-pressed={clusterOn} onClick={() => onPick(null)}>
        Peddapalle cluster
      </button>
      {assembly.map((seat) => {
        const parent = seatId === seat.id && picked?.type !== "seat";
        return (
          <button
            key={seat.id}
            type="button"
            className={parent ? "parent" : ""}
            aria-pressed={picked?.type === "seat" && picked.id === seat.id}
            onClick={() => onPick({ type: "seat", id: seat.id, name: placeLabel(seat.label) })}
          >
            {placeLabel(seat.label)}
          </button>
        );
      })}
      <div className="picker-mandals">
        {list.map((mandal) => (
          <button
            key={mandal.id}
            type="button"
            aria-pressed={picked?.type === "mandal" && picked.key === mandal.label.toUpperCase()}
            onClick={() => onPick({ type: "mandal", key: mandal.label.toUpperCase() })}
          >
            {placeLabel(mandal.label)}
          </button>
        ))}
      </div>
    </div>
  );
}
