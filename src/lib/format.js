export function num(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-IN").format(value);
}

export function pct(value) {
  if (value == null) return "—";
  return `${(value * 100).toFixed(1)}%`;
}

export function niceName(key) {
  if (!key) return "";
  return key[0] + key.slice(1).toLowerCase();
}

export function placeLabel(label) {
  if (!label) return "";
  const reservation = String(label).match(/\((SC|ST|GENERAL)\)/i);
  const name = String(label).replace(/\s*\((SC|ST|GENERAL)\)/i, "");
  const pretty = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return reservation ? `${pretty} (${reservation[1].toUpperCase()})` : pretty;
}
