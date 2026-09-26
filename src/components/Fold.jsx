import { useState } from "react";
import Icon from "./Icon.jsx";

export default function Fold({ title, meta, count, icon, children, startOpen = false }) {
  const [open, setOpen] = useState(startOpen);
  return (
    <div className="fold">
      <button type="button" className="fold-toggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {icon ? <Icon name={icon} /> : null}
        <span>
          {title}
          {meta ? <small>{meta}</small> : null}
        </span>
        {count != null && count !== "" ? <b>{count}</b> : null}
        <Icon name="chevron" className={open ? "icon chevron open" : "icon chevron"} />
      </button>
      {open ? <div className="fold-body">{children}</div> : null}
    </div>
  );
}
