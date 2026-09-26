export const TOPICS = {
  scheme: "Scheme",
  protest: "Protest",
  election: "Election",
  civic: "Civic work",
};

const PROMISE_TESTS = [
  ["promise:clis", /lift irrigation|chennur lift|\bclis\b/i],
  ["promise:bellampalli-junior-colleges", /junior college/i],
  ["promise:chennur-pushkaralu", /pushkaralu|pushkar ghat|\bpushkar\b/i],
  ["promise:mancherial-internal-roads", /road widening|underground drainage|internal road/i],
  ["promise:rythu-bharosa-mancherial", /rythu bharosa/i],
  ["promise:rythu-bandhu-rate", /rythu bandhu/i],
  ["promise:gmc-mancherial", /medical college/i],
  ["promise:mancherial-district", /revenue division|formation of mancherial district/i],
];

export function topicOf(text) {
  const value = (text || "").toLowerCase();
  if (/protest|dharna|agitat|irk|bandh/.test(value)) return "protest";
  if (/election|assembly poll|lok sabha|\bmla\b|candidate|\bcongress\b|\bbrs\b|\btrs\b|\bbjp\b|manifesto|bypoll/.test(value)) return "election";
  if (/scheme|rythu|irrigation|college|medical|pushkar|sanction|\bcrore\b|pension|housing|mission /.test(value)) return "scheme";
  return "civic";
}

function promiseTitleFor(text, promises) {
  const hit = PROMISE_TESTS.find(([, pattern]) => pattern.test(text || ""));
  if (!hit) return "";
  return promises.find((item) => item.id === hit[0])?.title || "";
}

export const STATUS = {
  done: "Delivered",
  in_progress: "Moving",
  partial: "Part way",
  pending: "Still open",
};

const TODAY = "2026-09-26";

export const ERAS = [
  { id: "past", title: "Past", line: "2016 to 2025. The record already written." },
  { id: "present", title: "Present", line: "This year, before the last few weeks." },
  { id: "current", title: "Current", line: "Since August 2026. What is live now." },
  { id: "future", title: "Future", line: "Still ahead, including the 2027 Pushkaralu." },
];

function eraOf(date) {
  if (!date || date < "2026-01-01") return "past";
  if (date > TODAY) return "future";
  if (date >= "2026-08-01") return "current";
  return "present";
}

export function buildEras(promises, news) {
  const dated = [
    ...promises.flatMap((item) => {
      const rows = [
        {
          date: item.source_date,
          title: item.title,
          detail: `Promised by ${item.promised_by}. ${item.promise_text}`,
          status: item.delivery.status,
          url: item.source_url,
          kind: "promise",
        },
      ];
      if (item.delivery.as_of && item.delivery.as_of !== item.source_date) {
        rows.push({
          date: item.delivery.as_of,
          title: item.title,
          detail: item.delivery.summary,
          status: item.delivery.status,
          url: item.delivery.source_url,
          kind: "promise",
        });
      }
      return rows;
    }),
    ...news.map((item) => {
      const text = `${item.title} ${item.summary || ""}`;
      return {
        date: item.published_at,
        title: item.title,
        detail: item.source,
        url: item.url,
        kind: "news",
        topic: topicOf(text),
        promiseTitle: promiseTitleFor(text, promises),
      };
    }),
  ];
  const ahead = promises
    .filter((item) => item.delivery.status !== "done" || /2027|pushkar/i.test(item.title))
    .map((item) => ({
      date: item.delivery.as_of,
      title: item.title,
      detail: item.delivery.summary,
      status: item.delivery.status,
      url: item.delivery.source_url,
      kind: "promise",
      horizon: /2027/.test(`${item.title} ${item.promise_text}`) ? "2027" : "Still open",
    }));
  return ERAS.map((era) => {
    const events = (era.id === "future" ? ahead : dated.filter((item) => eraOf(item.date) === era.id))
      .slice()
      .sort((a, b) =>
        era.id === "current"
          ? (b.date || "").localeCompare(a.date || "")
          : (a.date || "").localeCompare(b.date || "")
      );
    return { ...era, events };
  });
}
