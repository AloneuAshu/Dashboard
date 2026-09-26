import { useState } from "react";
import { STATUS, TOPICS } from "../lib/feed.js";
import Icon from "./Icon.jsx";

const ERA_ICON = { past: "past", present: "sun", current: "pulse", future: "forward" };

const START_OPEN = { past: false, present: false, current: false, future: false };

function Story({ eraId, event }) {
  const [open, setOpen] = useState(false);
  const extra = Boolean(event.detail || event.promiseTitle || event.topic || event.status);
  return (
    <li className={event.kind}>
      <button type="button" className="story-toggle" aria-expanded={open} disabled={!extra} onClick={() => extra && setOpen((value) => !value)}>
        <time>{event.horizon || event.date}</time>
        <span>{event.title}</span>
        {extra ? <Icon name="chevron" className={open ? "icon chevron open" : "icon chevron"} /> : null}
      </button>
      {open && (
        <div className="story-body" id={`${eraId}-${event.date}-${event.title}`}>
          {event.topic && <em className="topic">{TOPICS[event.topic]}</em>}
          {event.status && <em className={event.status}>{STATUS[event.status] || event.status}</em>}
          <a className="icon-link" href={event.url} target="_blank" rel="noreferrer">
            <Icon name="external" /> Report
          </a>
          {event.promiseTitle && <small>Tied to: {event.promiseTitle}</small>}
          {event.detail && <small>{event.detail}</small>}
        </div>
      )}
    </li>
  );
}

export default function HistoryFeed({ eras, showFeed, refreshing, onRefresh }) {
  const [open, setOpen] = useState(START_OPEN);

  function setAll(value) {
    setOpen(Object.fromEntries(eras.map((era) => [era.id, value])));
  }

  async function pullLatest() {
    const ok = await onRefresh();
    if (ok) setOpen((state) => ({ ...state, current: true, future: true }));
  }

  return (
    <section className="history">
      <div className="history-head">
        <h2>Past, present, current, and what is ahead</h2>
        {showFeed && (
          <div className="history-actions">
            <button type="button" aria-label="Open all" title="Open all" onClick={() => setAll(true)}><Icon name="expand" /></button>
            <button type="button" aria-label="Close all" title="Close all" onClick={() => setAll(false)}><Icon name="collapse" /></button>
          </div>
        )}
      </div>
      {!showFeed && <p className="quiet">Open Mancherial to read the full feed for a place that has an extract.</p>}
      {showFeed &&
        eras.map((era) => {
          const expanded = Boolean(open[era.id]);
          return (
            <article key={era.id} className={`era ${era.id}`}>
              <div className="era-row">
                <button
                  type="button"
                  className="era-toggle"
                  aria-expanded={expanded}
                  aria-controls={`era-panel-${era.id}`}
                  onClick={() => setOpen((state) => ({ ...state, [era.id]: !state[era.id] }))}
                >
                  <Icon name={ERA_ICON[era.id]} />
                  <span>
                    {era.title}
                    <small>{era.line}</small>
                  </span>
                  <b>{era.events.length}</b>
                  <Icon name="chevron" className={expanded ? "icon chevron open" : "icon chevron"} />
                </button>
                {(era.id === "current" || era.id === "future") && (
                  <button type="button" className="latest" disabled={refreshing} onClick={pullLatest}>
                    <Icon name="refresh" className={refreshing ? "icon spin" : "icon"} />
                    {refreshing ? "Pulling" : "Latest"}
                  </button>
                )}
              </div>
              {expanded && (
                <div id={`era-panel-${era.id}`}>
                  {era.events.length === 0 && <p className="quiet">Nothing in this window for the place on the map.</p>}
                  <ol>
                    {era.events.map((event) => (
                      <Story key={`${era.id}-${event.date}-${event.title}`} eraId={era.id} event={event} />
                    ))}
                  </ol>
                </div>
              )}
            </article>
          );
        })}
    </section>
  );
}
