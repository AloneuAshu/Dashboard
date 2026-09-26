import { num, pct } from "../lib/format.js";
import AgeBar from "./AgeBar.jsx";
import Icon from "./Icon.jsx";
import MandalRank from "./MandalRank.jsx";
import PlacePicker from "./PlacePicker.jsx";

export default function RollBrief({ picked, place, assembly, mandals, mandalRow, rankMandals, onPick }) {
  return (
    <section className="brief">
      <PlacePicker picked={picked} assembly={assembly} mandals={mandals} mandalRow={mandalRow} onPick={onPick} />
      <h2>{place.label}</h2>
      <p className="quiet">2026 SIR draft. Age as on 1 October 2026. These figures stay off the stage page.</p>
      <div className="stats wide">
        <div className="stat" title="People on the draft roll"><Icon name="people" /><div><b>{num(place.electorate)}</b><span>On the roll</span></div></div>
        <div className="stat" title="Women per 1,000 men"><Icon name="women" /><div><b>{place.sex_ratio ? num(place.sex_ratio) : "—"}</b><span>Women / 1,000</span></div></div>
        <div className="stat" title="Mean age"><Icon name="clock" /><div><b>{place.mean_age ?? "—"}</b><span>Mean age</span></div></div>
        <div className="stat" title="Aged 18 to 19"><Icon name="sprout" /><div><b>{num(place.first_time_18_19)}</b><span>Aged 18–19</span></div></div>
        <div className="stat" title="Share aged 60 or above"><Icon name="bars" /><div><b>{pct(place.age_60_share)}</b><span>Aged 60+</span></div></div>
        {place.parts ? (
          <div className="stat" title="Polling parts"><Icon name="booth" /><div><b>{num(place.parts)}</b><span>Parts</span></div></div>
        ) : null}
      </div>
      {(place.house_missing_rate != null || place.photo_rate != null) && (
        <p className="quiet">
          {place.house_missing_rate != null ? `House number missing ${pct(place.house_missing_rate)}` : ""}
          {place.house_missing_rate != null && place.photo_rate != null ? " · " : ""}
          {place.photo_rate != null ? `Photo marked ${pct(place.photo_rate)}` : ""}
        </p>
      )}
      <AgeBar bands={place.age_bands} startOpen />
      {rankMandals?.length > 1 && <MandalRank mandals={rankMandals} onPick={onPick} startOpen />}
    </section>
  );
}
