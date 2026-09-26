import { num } from "./format.js";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const HOSTS = {
  "telanganatoday.com": "Telangana Today",
  "thehindu.com": "The Hindu",
  "hindustantimes.com": "Hindustan Times",
  "thenewsminute.com": "The News Minute",
  "telanganaslbc.com": "Government order",
};

const HEAT = {
  burning: { id: "burning", label: "Burning", rank: 0 },
  inherited: { id: "inherited", label: "Inherited, still open", rank: 1 },
  hot: { id: "hot", label: "Hot", rank: 2 },
  started: { id: "started", label: "Started, not finished", rank: 3 },
  delivered: { id: "delivered", label: "Finished", rank: 9 },
};

export function longDate(iso) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  if (!month || !day) return iso;
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
}

export function sourceLabel(url, date) {
  let host = "Source";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    host = "Source";
  }
  return date ? `${HOSTS[host] || host}, ${longDate(date)}` : (HOSTS[host] || host);
}

export function focusFrom(picked, mandalRow) {
  if (picked?.type === "seat") return { acId: picked.id, mandalId: null, label: picked.name };
  if ((picked?.type === "mandal" || picked?.type === "booth") && mandalRow) {
    return { acId: mandalRow.ac_id, mandalId: mandalRow.id, label: mandalRow.label };
  }
  return { acId: null, mandalId: null, label: "Peddapalle cluster" };
}

function acCode(acId) {
  return acId?.startsWith("ac:") ? acId.slice(3) : "";
}

export function tieOf(promise, focus) {
  const places = promise.places || [];
  if (!focus.acId && !focus.mandalId) return "here";
  if (focus.mandalId && places.includes(focus.mandalId)) return "here";
  const code = acCode(focus.acId);
  const onSeat = places.some((id) => id === focus.acId || (code && id.startsWith(`mandal:${code}:`)));
  if (!onSeat) return "";
  return focus.mandalId ? "seat" : "here";
}

export function heatOf(item) {
  const status = item.delivery?.status;
  if (status === "done") return HEAT.delivered;
  if (item.party === "BRS" || item.party === "TRS") return HEAT.inherited;
  if (status === "pending") return HEAT.burning;
  if (status === "partial") return HEAT.hot;
  return HEAT.started;
}

export function isCongress(item) {
  return item.party === "Congress" || item.party === "INC";
}

export function stageRows(promises, focus) {
  return (promises || [])
    .map((item) => ({ item, tie: tieOf(item, focus) }))
    .filter((row) => row.tie)
    .sort((a, b) => {
      const byHeat = heatOf(a.item).rank - heatOf(b.item).rank;
      if (byHeat) return byHeat;
      if (a.tie !== b.tie) return a.tie === "here" ? -1 : 1;
      return (b.item.delivery?.as_of || "").localeCompare(a.item.delivery?.as_of || "");
    });
}

export function resultsForFocus(results, focus) {
  if (!results?.length) return [];
  if (!focus.acId) return results;
  return results.filter((item) => item.ac_id === focus.acId || item.pc_id);
}

function winnerLine(result) {
  const winner = result.candidates?.[0];
  const runner = result.candidates?.[1];
  const third = result.candidates?.[2];
  if (!winner || !runner) return "";
  const thirdText = third ? ` Third, ${third.name} (${third.party}) ${num(third.votes)}.` : "";
  return `${winner.name} (${winner.party}) ${num(winner.votes)}. Runner-up ${runner.name} (${runner.party}) ${num(runner.votes)}. Margin ${num(winner.votes - runner.votes)}.${thirdText}`;
}

export function historyBeats(results, rows) {
  const beats = [];
  const byId = new Map(rows.map((row) => [row.item.id, row.item]));
  const district = byId.get("promise:mancherial-district");
  if (district?.delivery) {
    beats.push({
      when: longDate(district.delivery.as_of),
      title: "Mancherial district is notified",
      text: district.delivery.summary,
      href: district.delivery.source_url,
      source: sourceLabel(district.delivery.source_url, district.delivery.as_of),
    });
  }
  const college = byId.get("promise:gmc-mancherial");
  if (college?.delivery) {
    beats.push({
      when: longDate(college.delivery.as_of),
      title: "Government medical college, classes begun",
      text: college.delivery.summary,
      href: college.delivery.source_url,
      source: sourceLabel(college.delivery.source_url, college.delivery.as_of),
    });
  }
  for (const result of results.filter((item) => item.year === 2023)) {
    beats.push({
      when: "December 2023",
      title: result.name,
      text: `${winnerLine(result)} Whole Assembly seat, from the Election Commission detailed results.`,
    });
  }
  const pc = results.find((item) => item.pc_id);
  if (pc) {
    beats.push({
      when: "2024",
      title: `${pc.name} Lok Sabha`,
      text: `${winnerLine(pc)} Electors ${num(pc.electors)}. Votes polled ${num(pc.votes_polled)}. Whole Peddapalle parliamentary seat. The draft roll in this app is the three Mancherial Assembly seats.`,
    });
  }
  return beats;
}

export function contextLine(results) {
  const assembly = (results || []).filter((item) => item.year === 2023 && item.candidates?.[0]);
  const pc = (results || []).find((item) => item.pc_id && item.candidates?.[0]);
  const bits = [];
  if (assembly.length === 1) {
    const winner = assembly[0].candidates[0];
    bits.push(`${winner.party} leads ${assembly[0].name} in the 2023 Assembly total.`);
  } else if (assembly.length > 1) {
    const party = assembly[0].candidates[0].party;
    const same = assembly.every((item) => item.candidates[0].party === party);
    bits.push(same
      ? `${party} leads all ${assembly.length} Assembly totals in this view, from the 2023 results.`
      : "The 2023 Assembly totals in this view are below.");
  }
  if (pc) bits.push(`${pc.candidates[0].party} leads ${pc.name} in the 2024 Lok Sabha total.`);
  bits.push("Register rows marked Congress belong to that party. Rows marked BRS or TRS belong to the previous government.");
  return bits.join(" ");
}
