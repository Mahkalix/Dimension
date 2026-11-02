import tracks from "./data/selection.json";
import playlists from "./data/playlists.json";

export const options = {
  Volume: ["Silence", "35 %", "65 %", "100 %"],
  "Sons de navigation": ["Activés", "Désactivés"],
  "Intensité du chrome": ["Mat", "Standard", "Poli"],
  Rétroéclairage: ["Bas", "Moyen", "Haut"],
};
export const defaults = {
  "Sons de navigation": "Désactivés",
  "Intensité du chrome": "Standard",
  Rétroéclairage: "Moyen",
};
export const menuPages = [
  "Extras",
  "Crédits",
  "Source",
  "Réglages",
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
    rows = ["Crédits", "Source"].map((n) =>
      row(n, n === "Source" ? "Audio ›" : "›", () => go(n)),
    );
  else if (page === "Réglages")
    rows = Object.keys(options).map((n) => row(n, "›", () => go(n)));
  else if (page === "Crédits")
    rows = (
      <>
        {tracks.map((t) => (
          <div className="menu-row" key={t.id}>
            <b>{t.title}</b>
            <span>
              {t.artist} ·{" "}
              <a href={t.sourceUrl} target="_blank" rel="noreferrer">
                Incompetech
              </a>{" "}
              ·{" "}
              <a href={t.licenseUrl} target="_blank" rel="noreferrer">
                {t.license}
              </a>
            </span>
          </div>
        ))}
        <h2>Photos des playlists</h2>
        {playlists.map((p) => (
          <a
            className="menu-row"
            href={p.sourceUrl}
            target="_blank"
            rel="noreferrer"
            key={p.id}
          >
            <b>{p.title}</b>
            <span>{p.credit}</span>
          </a>
        ))}
      </>
    );
  else if (page === "Source")
    rows = (
      <>
        {row("Audio libre", "", () => go("Écouter"), true)}
        <a className="menu-row" href="/profil">
          Spotify <span>Compte ›</span>
        </a>
      </>
    );
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
              ? "Réglages"
              : ["Crédits", "Source"].includes(page)
                ? "Extras"
                : "Écouter",
          )
        }
      >
        ‹ Retour
      </button>
    </section>
  );
}
