import tracks from "./data/library";
import playlists from "./data/playlists.json";

export const options = {
  Volume: ["Muted", "35 %", "65 %", "100 %"],
  "Navigation sounds": ["On", "Off"],
  "Chrome intensity": ["Matte", "Standard", "Polished"],
  Backlight: ["Low", "Medium", "High"],
};
export const defaults = {
  "Navigation sounds": "Off",
  "Chrome intensity": "Standard",
  Backlight: "Medium",
};
export const menuPages = [
  "Extras",
  "Credits",
  "Source",
  "Settings",
  ...Object.keys(options),
];

export function MenuPage({ page, go, prefs, volume, select }) {
  const row = (label, detail, action, selected) => (
    <button
      className="menu-row"
      key={label}
      onClick={action}
      aria-pressed={selected}
    >
      <b>{label}</b>
      <span>{selected ? "✓" : detail}</span>
    </button>
  );
  let rows;
  if (page === "Extras")
    rows = ["Credits", "Source"].map((n) =>
      row(n, n === "Source" ? "Audio ›" : "›", () => go(n)),
    );
  else if (page === "Settings")
    rows = Object.keys(options).map((n) => row(n, "›", () => go(n)));
  else if (page === "Credits")
    rows = (
      <>
        {tracks.map((t) => (
          <div className="menu-row" key={t.id}>
            <b>{t.title}</b>
            <span>
              {t.artist} ·{" "}
              <a href={t.sourceUrl} target="_blank" rel="noreferrer">
                {t.sourceName}
              </a>{" "}
              ·{" "}
              <a href={t.licenseUrl} target="_blank" rel="noreferrer">
                {t.license}
              </a>
            </span>
          </div>
        ))}
        <h2>Playlist photos</h2>
        {playlists.map((p) => (
          <div className="menu-row" key={p.id}>
            <b>{p.title}</b>
            <span>
              {p.credit}
              {p.sourceUrl && (
                <>
                  <br />
                  <a href={p.sourceUrl} target="_blank" rel="noreferrer">
                    Source
                  </a>
                </>
              )}
            </span>
          </div>
        ))}{" "}
      </>
    );
  else if (page === "Source")
    rows = <>{row("Creative Commons library", "", () => go("Listen"), true)}</>;
  else
    rows = options[page].map((n, i) =>
      row(
        n,
        "",
        () => select(page, n, i),
        page === "Volume"
          ? volume === [0, 0.35, 0.65, 1][i]
          : prefs[page] === n,
      ),
    );
  return (
    <section className="menu-list">
      {rows}
      <button
        className="back-link"
        onClick={() =>
          go(
            options[page]
              ? "Settings"
              : ["Credits", "Source"].includes(page)
                ? "Extras"
                : "Listen",
          )
        }
      >
        ‹ Back
      </button>
    </section>
  );
}
