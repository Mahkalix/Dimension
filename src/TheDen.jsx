import { useEffect, useRef, useState } from "react";
import tracks from "./data/afterhours.json";
import MusicVideoPlayer from "./components/MusicVideoPlayer";

const art = ["/radiohead.jpg", "/chicago.jpg"];
const sections = ["Écouter", "Bibliothèque", "À suivre", "Recherche"];

export default function TheDen() {
  const [section, setSection] = useState("Écouter");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(0);
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(0.65);
  const dialog = useRef(null);
  const touch = useRef(null);
  const track = tracks[preview];
  const next = () => setPreview((i) => (i + 1) % tracks.length);
  const openTrack = (i) => {
    setPreview(i);
    dialog.current.showModal();
  };
  useEffect(() => {
    const pane = dialog.current;
    return () => pane?.close();
  }, []);
  const play = () => {
    setPlaying(preview);
    dialog.current.close();
  };
  const order =
    section === "À suivre" && playing !== null ? [(playing + 1) % 2] : [0, 1];
  const results = order.filter((i) =>
    (tracks[i].title + " " + tracks[i].artist)
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="den" data-section={section}>
      <aside className="rail">
        <a href="/" aria-label="DIMENSION · Accueil">
          <img className="logo" src="/den-2.svg" alt="The Den" />
        </a>
        <nav aria-label="Navigation principale">
          {sections.map((name, i) => (
            <button
              key={name}
              aria-current={section === name ? "page" : undefined}
              onClick={() => {
                setSection(name);
                setQuery("");
              }}
            >
              <img
                className="nav-icon"
                alt=""
                src={
                  "/" +
                  ["headphones-round", "library", "playlist", "library"][i] +
                  ".svg"
                }
              />
              {name}
            </button>
          ))}
        </nav>
      </aside>
      <main>
        <header>
          <h1>{section}</h1>
          <input
            aria-label="Rechercher un morceau"
            type="search"
            placeholder="Titre ou artiste"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </header>
        {section === "Écouter" && !query && (
          <section className="collections" aria-label="Collections">
            {["Après le service", "Chicago"].map((title, i) => (
              <button key={title} onClick={() => openTrack(i)}>
                <img src={"/den-" + i + ".svg"} alt="" />
                <strong>{title}</strong>
                <small>{i ? "Sufjan Stevens" : "2 morceaux"}</small>
              </button>
            ))}
          </section>
        )}
        <section aria-label="Liste des morceaux">
          <h2>{section === "À suivre" ? "File de lecture" : "Morceaux"}</h2>
          {results.map((i) => (
            <button className="track" key={i} onClick={() => openTrack(i)}>
              <img src={"/den-" + i + ".svg"} alt="" />
              <span>
                <b>{tracks[i].title}</b>
                <small>{tracks[i].artist}</small>
              </span>
              <span aria-hidden="true">›</span>
            </button>
          ))}
          {!results.length && <p role="status">Aucun morceau trouvé.</p>}
        </section>
        <footer>
          <a href="/profil">Profil</a> · <a href="/parametres">Paramètres</a>
        </footer>
      </main>
      {playing === null ? (
        <aside className="rest">
          <button aria-label="Morceau précédent" onClick={next}>
            ‹
          </button>
          <button className="dock-meta" onClick={() => openTrack(preview)}>
            <img src={"/den-" + preview + ".svg"} alt="" />
            <span>
              <b>{track.title}</b>
              <small>{track.artist}</small>
            </span>
          </button>
          <button aria-label="Morceau suivant" onClick={next}>
            ›
          </button>
          <button onClick={() => setPlaying(preview)}>▶ Lecture</button>
        </aside>
      ) : (
        <MusicVideoPlayer
          key={playing}
          track={tracks[playing]}
          volume={volume}
          onVolumeChange={(e) => setVolume(Number(e.target.value))}
          onClose={() => setPlaying(null)}
        />
      )}
      <dialog ref={dialog} aria-label="Fiche du morceau" className="record">
        <button className="return" onClick={() => dialog.current.close()}>
          ‹ Retour aux morceaux
        </button>
        <div
          className="stage"
          onTouchStart={(e) => {
            touch.current = [e.touches[0].clientX, e.touches[0].clientY];
          }}
          onTouchCancel={() => {
            touch.current = null;
          }}
          onTouchEnd={(e) => {
            if (!touch.current) return;
            const dx = e.changedTouches[0].clientX - touch.current[0],
              dy = e.changedTouches[0].clientY - touch.current[1];
            touch.current = null;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) next();
          }}
        >
          <img
            className={"neighbor side" + preview}
            src={art[1 - preview]}
            alt=""
          />
          <figure>
            <img src={art[preview]} alt="" />
            <figcaption aria-live="polite">
              <b>{track.title}</b>
              <small>{track.artist}</small>
            </figcaption>
          </figure>
        </div>
        <div className="transport">
          <button aria-label="Morceau précédent" onClick={next}>
            ←
          </button>
          <button onClick={play}>▶ Écouter</button>
          <button aria-label="Morceau suivant" onClick={next}>
            →
          </button>
        </div>
      </dialog>
    </div>
  );
}

