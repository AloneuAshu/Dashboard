import { placeLabel } from "../lib/format.js";
import {
  contextLine,
  focusFrom,
  heatOf,
  historyBeats,
  isCongress,
  longDate,
  resultsForFocus,
  sourceLabel,
  stageRows,
} from "../lib/stage.js";
import Fold from "./Fold.jsx";
import Icon from "./Icon.jsx";
import PlacePicker from "./PlacePicker.jsx";

function SourceLink({ url, date }) {
  if (!url) return null;
  return (
    <a className="icon-link" href={url} target="_blank" rel="noreferrer">
      <Icon name="external" />
      {sourceLabel(url, date)}
    </a>
  );
}

export default function StageBrief({ picked, assembly, mandals, mandalRow, booth, promises, results, onPick }) {
  const focus = focusFrom(picked, mandalRow);
  const placeName = picked?.type === "seat" ? picked.name : placeLabel(focus.label);
  const rows = stageRows(promises, focus);
  const scopedResults = resultsForFocus(results, focus);
  const beats = historyBeats(scopedResults, rows);
  const open = rows.filter((row) => row.item.delivery?.status !== "done");
  const finished = rows.filter((row) => row.item.delivery?.status === "done");
  const congress = rows.filter((row) => isCongress(row.item));
  const congressDone = congress.filter((row) => row.item.delivery?.status === "done").length;

  return (
    <section className="brief">
      <PlacePicker picked={picked} assembly={assembly} mandals={mandals} mandalRow={mandalRow} onPick={onPick} />
      <p className="lede">{contextLine(scopedResults)}</p>
      {booth && (
        <p className="quiet">
          Part {booth.part_no}{booth.station ? `, ${booth.station}` : ""}. The lines below are for {placeName} mandal.
        </p>
      )}
      <div className="score" aria-label="Congress rows in the register">
        <span>Congress rows {congress.length}</span>
        <span>Finished in the register {congressDone}</span>
        <span>Still open {open.length}</span>
      </div>
      <h2 className="brief-title">
        <Icon name="flame" /> Mancherial Updates
      </h2>
      {open.length === 0 && <p>This place has no open row in the register.</p>}
      <div className="say">
        {open.map(({ item, tie }) => {
          const heat = heatOf(item);
          return (
            <article key={item.id} className={`say-card ${heat.id}`}>
              <header>
                <em className={heat.id}>{heat.label}</em>
                <h3>{item.title}</h3>
                <p>
                  {item.promised_by || "Record"}
                  {item.party ? ` · ${item.party}` : " · no party on the row"}
                  {item.year ? ` · ${item.year}` : ""}
                </p>
                {tie === "seat" && <p className="quiet">Listed on the Assembly seat.</p>}
              </header>
              <div className="compare">
                <div>
                  <h4>Promised</h4>
                  <p>{item.promise_text}</p>
                  <SourceLink url={item.source_url} date={item.source_date} />
                </div>
                <div>
                  <h4>Last report · {longDate(item.delivery.as_of)} · {heat.label}</h4>
                  <p>{item.delivery.summary}</p>
                  <SourceLink url={item.delivery.source_url} date={item.delivery.as_of} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <Fold
        icon="past"
        title={`History of ${placeName}`}
        meta={beats.map((beat) => beat.when).filter((when, index, list) => list.indexOf(when) === index).slice(0, 4).join(" · ")}
        count={beats.length}
        startOpen
      >
        <div className="beats">
          {beats.map((beat) => (
            <article key={beat.title} className="beat">
              <time>{beat.when}</time>
              <div>
                <h3>{beat.title}</h3>
                <p>{beat.text}</p>
                {beat.href && (
                  <a className="icon-link" href={beat.href} target="_blank" rel="noreferrer">
                    <Icon name="external" />
                    {beat.source}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </Fold>
      <Fold
        icon="scale"
        title="Finished in the register"
        meta="Previous government"
        count={finished.length}
      >
        {finished.map(({ item }) => (
          <Fold key={item.id} title={item.title} meta={`${item.party || "Record"} · ${longDate(item.delivery.as_of)}`}>
            <p>{item.delivery.summary}</p>
            <SourceLink url={item.delivery.source_url} date={item.delivery.as_of} />
          </Fold>
        ))}
      </Fold>
    </section>
  );
}
