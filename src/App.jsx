import { useEffect, useMemo, useState } from "react";
import HistoryFeed from "./components/HistoryFeed.jsx";
import Icon from "./components/Icon.jsx";
import PlacePanel from "./components/PlacePanel.jsx";
import RollBrief from "./components/RollBrief.jsx";
import StageBrief from "./components/StageBrief.jsx";
import TelanganaMap from "./components/TelanganaMap.jsx";
import { buildEras } from "./lib/feed.js";
import { placeLabel } from "./lib/format.js";
import { scopeIdsFor, sumPlaces } from "./lib/places.js";

const TABS = [
  { id: "stage", label: "On the stage", icon: "mic" },
  { id: "roll", label: "The roll", icon: "people" },
  { id: "map", label: "Map and news", icon: "pin" },
];

const HEADS = {
  stage: {
    eyebrow: "Stage brief · Peddapalle cluster",
    title: "Citizens for Accountable Governance (CAG)",
    lede: "The history of this place, what the Congress rows promised, and what the last dated report says was delivered.",
  },
  roll: {
    eyebrow: "Draft roll · age as on 1 October 2026",
    title: "Age and the roll",
    lede: "Who is on the 2026 SIR draft. Open a seat or a mandal to narrow it.",
  },
  map: {
    eyebrow: "Telangana · one district open",
    title: "Map, booths and the news",
    lede: "Mancherial is lit because that is the extract we have. Get latest sits on Current and Future.",
  },
};

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [picked, setPicked] = useState(null);
  const [hover, setHover] = useState("");
  const [tab, setTab] = useState("stage");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshNote, setRefreshNote] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}dashboard.json`)
      .then((response) => {
        if (!response.ok) throw new Error("The dashboard file did not load.");
        return response.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const booth = picked?.type === "booth" ? data?.parts?.find((item) => item.id === picked.id) : null;
  const mandalKey = picked?.type === "mandal" ? picked.key : booth?.mandal_key || "";
  const zoomName = !picked
    ? ""
    : picked.type === "mandal" || picked.type === "booth" || picked.type === "seat"
      ? "Mancherial"
      : picked.name || "";
  const ready = zoomName === "Mancherial";
  const outside = Boolean(picked) && !ready;

  const mandalRow = useMemo(() => {
    if (!data || !mandalKey) return null;
    return data.mandals.find((item) => item.label.toUpperCase() === mandalKey) || null;
  }, [data, mandalKey]);

  const seatRow = picked?.type === "seat" ? data?.assembly.find((item) => item.id === picked.id) : null;

  const placePromises = useMemo(() => {
    if (!data || outside) return [];
    const scope = new Set(scopeIdsFor(data, picked, mandalRow, zoomName));
    return data.promises.filter((item) => item.places.some((id) => scope.has(id)));
  }, [data, picked, outside, mandalRow, zoomName]);

  const eras = useMemo(() => {
    if (!data || outside) return [];
    const scope = new Set(scopeIdsFor(data, picked, mandalRow, zoomName));
    const promiseUrls = new Set(placePromises.flatMap((item) => [item.source_url, item.delivery.source_url]));
    const news = data.news.filter(
      (item) => item.places.some((id) => scope.has(id)) && !promiseUrls.has(item.url)
    );
    return buildEras(placePromises, news);
  }, [data, picked, outside, mandalRow, zoomName, placePromises]);

  async function refreshNews() {
    setRefreshing(true);
    setRefreshNote("");
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/refresh-news`, { method: "POST" });
      if (!response.ok) throw new Error("The feeds did not refresh.");
      const fresh = await fetch(`${import.meta.env.BASE_URL}dashboard.json?t=${Date.now()}`, { cache: "no-store" });
      if (!fresh.ok) throw new Error("The dashboard file did not reload.");
      setData(await fresh.json());
      setRefreshNote("Current and future are using the latest pull.");
      return true;
    } catch (err) {
      setRefreshNote(err.message);
      return false;
    } finally {
      setRefreshing(false);
    }
  }

  if (error) return <div className="app"><p>{error}</p></div>;
  if (!data) return <div className="app"><p>Drawing Telangana…</p></div>;

  const place = booth
    ? { ...booth, label: `Part ${booth.part_no}` }
    : mandalRow
      ? { ...mandalRow, label: `${placeLabel(mandalRow.label)} mandal` }
      : seatRow
        ? { ...seatRow, label: placeLabel(seatRow.label) }
        : ready
          ? sumPlaces(data.mandals, "Mancherial district")
          : null;
  const rollPlace = place || (!outside ? sumPlaces(data.mandals, "Mancherial district") : null);
  const seat = mandalRow && data.assembly.find((item) => item.id === mandalRow.ac_id);
  const rankMandals = seatRow
    ? data.mandals.filter((item) => item.ac_id === seatRow.id)
    : mandalRow
      ? data.mandals.filter((item) => item.ac_id === mandalRow.ac_id)
      : data.mandals;
  const results = !data.results
    ? []
    : picked?.type === "seat"
      ? data.results.filter((item) => item.ac_id === picked.id || item.pc_id)
      : mandalRow
        ? data.results.filter((item) => item.ac_id === mandalRow.ac_id || item.pc_id)
        : ready
          ? data.results
          : [];
  const head = HEADS[tab];
  const chipMandals = picked?.type === "seat" ? data.mandals.filter((item) => item.ac_id === picked.id) : null;

  return (
    <div className="app">
      <header>
        <p className="eyebrow">{head.eyebrow}</p>
        <h1>{head.title}</h1>
        <p className="lede">{head.lede}</p>
      </header>
      <nav className="tabs" role="tablist" aria-label="Dashboard sections">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            <Icon name={item.icon} />
            {item.label}
          </button>
        ))}
      </nav>
      {tab === "stage" && (
        outside ? (
          <section className="panel">
            <h2>{picked.name}</h2>
            <p>This district is on the map. The stage brief covers the Mancherial extract inside Peddapalle.</p>
            <button type="button" className="open" onClick={() => setPicked(null)}>Open the Peddapalle brief</button>
          </section>
        ) : (
          <StageBrief
            picked={picked}
            assembly={data.assembly}
            mandals={data.mandals}
            mandalRow={mandalRow}
            booth={booth}
            promises={data.promises}
            results={data.results}
            onPick={setPicked}
          />
        )
      )}
      {tab === "roll" && (
        rollPlace ? (
          <RollBrief
            picked={picked}
            place={rollPlace}
            assembly={data.assembly}
            mandals={data.mandals}
            mandalRow={mandalRow}
            rankMandals={booth ? [] : rankMandals}
            onPick={setPicked}
          />
        ) : (
          <section className="panel">
            <h2>{picked.name}</h2>
            <p>This district is on the map. Its roll is not in this extract yet.</p>
            <button type="button" className="open" onClick={() => setPicked(null)}>Open the Mancherial roll</button>
          </section>
        )
      )}
      {tab === "map" && (
        <>
          <div className="stage">
            <TelanganaMap
              picked={picked}
              zoomName={zoomName}
              ready={ready}
              hover={hover}
              onHover={setHover}
              onPick={setPicked}
            />
            <PlacePanel
              picked={picked}
              ready={ready}
              place={place}
              seat={seat}
              promises={placePromises}
              booth={booth}
              booths={mandalRow ? (data.parts || []).filter((item) => item.mandal_id === mandalRow.id) : []}
              mandalKey={mandalKey}
              chipMandals={chipMandals}
              results={results}
              onPick={setPicked}
            />
          </div>
          <HistoryFeed eras={eras} showFeed={!outside} refreshing={refreshing} onRefresh={refreshNews} />
          {refreshNote && <p className="note">{refreshNote}</p>}
          <p className="note">{data.note} District shapes are the 2016–2019 boundaries. Mandal dots are headquarters, not ward lines.</p>
        </>
      )}
    </div>
  );
}
