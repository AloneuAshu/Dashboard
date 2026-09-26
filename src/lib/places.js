export function sumPlaces(list, label) {
  const bands = {};
  let cards = 0;
  let weight = 0;
  let male = 0;
  let female = 0;
  let electors = 0;
  let parts = 0;
  let young = 0;
  for (const place of list) {
    electors += place.electorate || 0;
    parts += place.parts || 0;
    male += place.male || 0;
    female += place.female || 0;
    young += place.first_time_18_19 || 0;
    const read = Object.values(place.age_bands || {}).reduce((sum, count) => sum + count, 0);
    if (place.mean_age && read) {
      weight += place.mean_age * read;
      cards += read;
    }
    for (const [key, count] of Object.entries(place.age_bands || {})) {
      bands[key] = (bands[key] || 0) + count;
    }
  }
  const aged = cards || Object.values(bands).reduce((sum, count) => sum + count, 0);
  return {
    label,
    electorate: electors,
    parts,
    sex_ratio: male ? Math.round((1000 * female) / male) : null,
    mean_age: cards ? Math.round((weight / cards) * 10) / 10 : null,
    first_time_18_19: young,
    age_60_share: aged ? ((bands["60-69"] || 0) + (bands["70+"] || 0)) / aged : null,
    age_bands: bands,
  };
}

export function scopeIdsFor(data, picked, mandalRow, zoomName) {
  if (!data) return [];
  if ((picked?.type === "mandal" || picked?.type === "booth") && mandalRow) return [mandalRow.id, mandalRow.ac_id];
  if (picked?.type === "seat") {
    return [picked.id, ...data.mandals.filter((item) => item.ac_id === picked.id).map((item) => item.id)];
  }
  if (zoomName === "Mancherial") {
    return data.mandals.map((item) => item.id).concat(data.assembly.map((item) => item.id));
  }
  return data.mandals.map((item) => item.id).concat(data.assembly.map((item) => item.id), [data.pc.id]);
}
