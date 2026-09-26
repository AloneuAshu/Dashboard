import { num } from "../lib/format.js";
import Fold from "./Fold.jsx";

export default function SeatResult({ results }) {
  if (!results?.length) return null;
  return (
    <Fold icon="vote" title="Official results" meta="Constituency totals, not a booth count" count={results.length}>
      {results.map((result) => {
        const winner = result.candidates[0];
        const runner = result.candidates[1];
        const margin = winner && runner ? winner.votes - runner.votes : null;
        const summary = winner ? `${winner.party} ${num(winner.votes)}` : "";
        const marginText = margin != null ? `Margin ${num(margin)}` : "";
        return (
          <Fold
            key={result.id || result.ac_id}
            title={`${result.year} · ${result.name}`}
            meta={[summary, marginText, result.election].filter(Boolean).join(" · ")}
          >
            <ol className="result-list">
              {result.candidates.slice(0, 4).map((candidate) => (
                <li key={candidate.party + candidate.votes}>
                  <b>{candidate.party}</b>
                  <span>{candidate.name}</span>
                  <em>{num(candidate.votes)}</em>
                </li>
              ))}
            </ol>
          </Fold>
        );
      })}
    </Fold>
  );
}
