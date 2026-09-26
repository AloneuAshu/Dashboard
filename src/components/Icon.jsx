export default function Icon({ name, className = "icon" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {name === "chevron" && <path d="M6 9l6 6 6-6" />}
      {name === "refresh" && (
        <>
          <path d="M21 12a9 9 0 1 1-2.6-6.3" />
          <path d="M21 4v6h-6" />
        </>
      )}
      {name === "expand" && (
        <>
          <path d="M8 4H4v4" />
          <path d="M16 4h4v4" />
          <path d="M8 20H4v-4" />
          <path d="M16 20h4v-4" />
        </>
      )}
      {name === "collapse" && (
        <>
          <path d="M9 4v4H5" />
          <path d="M15 4v4h4" />
          <path d="M9 20v-4H5" />
          <path d="M15 20v-4h4" />
        </>
      )}
      {name === "people" && (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="3" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.8" />
          <path d="M16 4.1a3 3 0 0 1 0 5.8" />
        </>
      )}
      {name === "women" && (
        <>
          <circle cx="12" cy="7" r="3" />
          <path d="M12 10v8" />
          <path d="M9 14h6" />
          <path d="M9 21l3-3 3 3" />
        </>
      )}
      {name === "clock" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5l3 2" />
        </>
      )}
      {name === "sprout" && (
        <>
          <path d="M12 21V11" />
          <path d="M12 11c0-4 3-7 8-7-1 5-4 7-8 7z" />
          <path d="M12 13c0-3-2.5-6-7-6 1 4 3.5 6 7 6z" />
        </>
      )}
      {name === "booth" && (
        <>
          <path d="M4 10l8-6 8 6" />
          <path d="M6 10v9h12v-9" />
          <path d="M10 19v-5h4v5" />
        </>
      )}
      {name === "pin" && (
        <>
          <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.2" />
        </>
      )}
      {name === "vote" && (
        <>
          <path d="M4 10h16v9H4z" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <path d="M12 13v3" />
        </>
      )}
      {name === "scale" && (
        <>
          <path d="M12 3v18" />
          <path d="M5 7h14" />
          <path d="M7 7l-3 6h6z" />
          <path d="M17 7l-3 6h6z" />
        </>
      )}
      {name === "bars" && (
        <>
          <path d="M5 20V10" />
          <path d="M12 20V4" />
          <path d="M19 20v-7" />
        </>
      )}
      {name === "past" && (
        <>
          <path d="M4 12a8 8 0 1 0 2.3-5.6" />
          <path d="M4 4v5h5" />
          <path d="M12 8v5l3 2" />
        </>
      )}
      {name === "sun" && (
        <>
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
        </>
      )}
      {name === "pulse" && (
        <>
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </>
      )}
      {name === "forward" && (
        <>
          <path d="M5 12h12" />
          <path d="M13 6l6 6-6 6" />
        </>
      )}
      {name === "external" && (
        <>
          <path d="M14 5h5v5" />
          <path d="M19 5l-9 9" />
          <path d="M10 5H6v13h13v-4" />
        </>
      )}
      {name === "mic" && (
        <>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M6 11a6 6 0 0 0 12 0" />
          <path d="M12 17v4M8 21h8" />
        </>
      )}
      {name === "flame" && (
        <path d="M12 3c2 3 2 4 2 6a2 2 0 0 1-4 0c0-1 .4-2 1-3-2 2-3 4-3 6a4 4 0 0 0 8 0c0-4-2-6-4-9z" />
      )}
    </svg>
  );
}
