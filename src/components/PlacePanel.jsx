import mapData from "../data/districts.json";
import { niceName, num } from "../lib/format.js";
import BoothList from "./BoothList.jsx";
import Fold from "./Fold.jsx";
import Icon from "./Icon.jsx";
import PromiseGraph from "./PromiseGraph.jsx";
import SeatResult from "./SeatResult.jsx";

export default function PlacePanel({ picked, ready, place, seat, booth, booths, mandalKey, promises, results, chipMandals, onPick }) {
  const showChips = picked?.type === "district" || picked?.type === "seat";
  const showBooths = picked?.type === "mandal";
  const chips = chipMandals?.length
    ? chipMandals.map((item) => ({ key: item.label.toUpperCase(), label: item.label[0] + item.label.slice(1).toLowerCase() }))
    : mapData.mandals.map((mandal) => ({ key: mandal.key, label: niceName(mandal.key) }));

  return (
    <aside className="panel">
      {!picked && (
        <>
          <h2>Start with the lit district</h2>
          <p>Mancherial holds Chennur, Bellampalli and the Mancherial seat. The rest of the state is drawn so the next extract has a place to land.</p>
          <button type="button" className="open" onClick={() => onPick({ type: "district", name: "Mancherial" })}>
            Open Mancherial
          </button>
          <PromiseGraph promises={promises} />
        </>
      )}
      {picked && !ready && (
        <>
          <h2>{picked.name}</h2>
          <p>This district is on the map. Its roll, news history and promise record are not in this extract yet.</p>
          <button type="button" className="open" onClick={() => onPick({ type: "district", name: "Mancherial" })}>
            Go to Mancherial
          </button>
        </>
      )}
      {place && (
        <>
          <h2>{place.label}</h2>
          {seat && <p className="seat">{seat.label}</p>}
          {booth && (
            <p className="quiet">
              {booth.station || "Polling station not read"}
              {booth.address ? ` · ${booth.address}` : ""}
              {booth.town ? ` · ${booth.town}` : ""}
              {booth.sections?.length ? ` · ${booth.sections.join(", ")}` : ""}
            </p>
          )}
          <div className="stats">
            <div className="stat" title="People on the draft roll"><Icon name="people" /><div><b>{num(place.electorate)}</b><span>On the roll</span></div></div>
            {place.parts ? (
              <div className="stat" title="Polling parts"><Icon name="booth" /><div><b>{num(place.parts)}</b><span>Parts</span></div></div>
            ) : null}
          </div>
          {showBooths && <BoothList booths={booths} mandalKey={mandalKey} onPick={onPick} />}
          <SeatResult results={results} />
          <PromiseGraph promises={promises} />
          {showChips && (
            <Fold icon="pin" title="Mandals" count={chips.length}>
              <div className="chips">
                {chips.map((mandal) => (
                  <button key={mandal.key} type="button" onClick={() => onPick({ type: "mandal", key: mandal.key })}>
                    {mandal.label}
                  </button>
                ))}
              </div>
            </Fold>
          )}
        </>
      )}
    </aside>
  );
}
