import mapData from "../data/districts.json";
import { niceName } from "../lib/format.js";

function viewBoxFor(name) {
  const full = `0 0 ${mapData.width} ${mapData.height}`;
  if (!name) return full;
  const district = mapData.districts.find((item) => item.name === name);
  if (!district) return full;
  const [x0, y0, x1, y1] = district.bbox;
  const pad = 42;
  return `${x0 - pad} ${y0 - pad} ${x1 - x0 + pad * 2} ${y1 - y0 + pad * 2}`;
}

export default function TelanganaMap({ picked, zoomName, ready, hover, onHover, onPick }) {
  return (
    <section className="map-card">
      <div className="map-bar">
        <button type="button" className={picked ? "" : "here"} onClick={() => onPick(null)}>
          Telangana
        </button>
        {zoomName && (
          <>
            <span>/</span>
            <button
              type="button"
              className={picked?.type === "district" ? "here" : ""}
              onClick={() => onPick({ type: "district", name: zoomName })}
            >
              {zoomName}
            </button>
          </>
        )}
        {picked?.type === "seat" && (
          <>
            <span>/</span>
            <button type="button" className="here">{picked.name}</button>
          </>
        )}
        {(picked?.type === "mandal" || picked?.type === "booth") && (
          <>
            <span>/</span>
            <button
              type="button"
              className={picked.type === "mandal" ? "here" : ""}
              onClick={() => onPick({ type: "mandal", key: picked.type === "mandal" ? picked.key : picked.mandalKey })}
            >
              {niceName(picked.type === "mandal" ? picked.key : picked.mandalKey)}
            </button>
          </>
        )}
        {picked?.type === "booth" && (
          <>
            <span>/</span>
            <button type="button" className="here">Part {picked.partNo}</button>
          </>
        )}
        <strong className="hover-name">{hover || (zoomName ? "" : "Choose a district")}</strong>
      </div>
      <svg viewBox={viewBoxFor(zoomName)} role="img" aria-label="Map of Telangana districts">
        {mapData.districts.map((district) => (
          <path
            key={district.name}
            d={district.d}
            className={
              "district" +
              (district.ready ? " ready" : "") +
              (zoomName === district.name ? " on" : "") +
              (zoomName && zoomName !== district.name ? " dim" : "")
            }
            tabIndex={0}
            role="button"
            aria-label={district.name}
            onMouseEnter={() => onHover(district.name)}
            onMouseLeave={() => onHover("")}
            onClick={() => onPick({ type: "district", name: district.name })}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onPick({ type: "district", name: district.name });
              }
            }}
          >
            <title>{district.name}{district.ready ? " · open" : ""}</title>
          </path>
        ))}
        {!zoomName &&
          mapData.districts.filter((district) => district.ready).map((district) => (
            <text key={district.name} className="ready-label" x={district.label[0]} y={district.label[1]}>
              {district.name}
            </text>
          ))}
        {ready &&
          mapData.mandals.map((mandal) => {
            const nice = niceName(mandal.key);
            const active = picked?.key === mandal.key || hover === nice;
            return (
              <g
                key={mandal.key}
                className={"mandal" + (picked?.key === mandal.key ? " on" : "")}
                transform={`translate(${mandal.x} ${mandal.y})`}
                tabIndex={0}
                role="button"
                aria-label={nice}
                onClick={(event) => {
                  event.stopPropagation();
                  onPick({ type: "mandal", key: mandal.key });
                }}
                onMouseEnter={() => onHover(nice)}
                onMouseLeave={() => onHover("")}
              >
                <circle r={active ? 7 : 4.5} />
                {active && <text y={-9}>{nice}</text>}
              </g>
            );
          })}
      </svg>
    </section>
  );
}
