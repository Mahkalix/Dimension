import PlayerBar from "./components/PlayerBar";
import { useEffect, useRef, useState } from "react";
import tracks from "./data/afterhours.json";
import MusicVideoPlayer from "./components/MusicVideoPlayer";

import { MenuPage, menuPages, defaults } from "./MenuPage";
const art = ["/radiohead.jpg", "/chicago.jpg"];
const sections = ["Écouter", "Bibliothèque", "À suivre", "Recherche"];

export default function TheDen() {
  const [section, setSection] = useState("Écouter");
  const [libraryTab, setLibraryTab] = useState("Playlists");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(0);
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(0.65);
  const [queue, setQueue] = useState([0]);
  const [notice, setNotice] = useState("");
  const [command, setCommand] = useState(0);
  const [audible, setAudible] = useState(false);
  const [prefs, setPrefs] = useState(defaults);
  const tone = useRef(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("den-preferences"));
      if (saved) {
        setPrefs({ ...defaults, ...saved.prefs });
        if (typeof saved.volume === "number") setVolume(saved.volume);
      }
    } catch {}
  }, []);
  const go = (page) => {
    setSection(page);
    setQuery("");
    setNotice("");
    if (prefs["Sons de navigation"] === "Activés" && window.AudioContext) {
      const ctx = tone.current || (tone.current = new AudioContext());
      const osc = ctx.createOscillator(),
        gain = ctx.createGain();
      gain.gain.value = 0.025;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    }
  };
  const select = (key, value, i) => {
    const updated = { ...prefs, [key]: value };
    const level = key === "Volume" ? [0, 0.35, 0.65, 1][i] : volume;
    setPrefs(updated);
    setVolume(level);
    localStorage.setItem(
      "den-preferences",
      JSON.stringify({ prefs: updated, volume: level }),
    );
  };
  const start = (i) => {
    setPlaying(i);
    setPreview(i);
    setCommand((c) => c + 1);
    go("Lecture");
  };
  const advance = () => {
    const i = queue.length ? queue[0] : 1 - (playing ?? preview);
    setQueue((q) => q.slice(1));
    start(i);
  };
  const add = () => {
    setQueue((q) => [...q, preview]);
    dialog.current.close();
    go("À suivre");
    setNotice("Ajouté à la file");
  };
  const menu = menuPages.includes(section);
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
    start(preview);
    dialog.current.close();
  };
  const order = section === "À suivre" ? queue : [0, 1];
  const results = order.filter((i) =>
    (tracks[i].title + " " + tracks[i].artist)
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <div
      className="den"
      data-section={section}
      data-chrome={prefs["Intensité du chrome"]}
      data-light={prefs.Rétroéclairage}
    >
      <aside className="rail">
        <a href="/" aria-label="DIMENSION · Accueil">
          <img className="logo" src="/brand/the-den-wordmark.png" alt="The Den" />
        </a>
        <nav aria-label="Navigation principale">
          {sections.map((name, i) => (
            <button
              key={name}
              aria-current={section === name ? "page" : undefined}
              onClick={() => {
                go(name);
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
          <h1>
            {section === "Lecture"
              ? tracks[playing ?? preview].artist
              : section}
          </h1>
          <input
            aria-label="Rechercher un morceau"
            type="search"
            placeholder="Titre ou artiste"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </header>
        {section === "Bibliothèque" && (
          <div
            className="library-switch"
            role="group"
            aria-label="Parcourir la bibliothèque"
          >
            {["Playlists", "Artistes", "Morceaux"].map((tab) => (
              <button
                key={tab}
                aria-pressed={libraryTab === tab}
                onClick={() => {
                  setLibraryTab(tab);
                  setQuery("");
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
        {section === "Bibliothèque" && libraryTab === "Artistes" && !query && (
          <section className="artist-list" aria-label="Artistes">
            {tracks.map((item, i) => (
              <button key={item.id} onClick={() => setQuery(item.artist)}>
                <img src={"/den-track-" + i + ".png"} alt="" />
                <strong>{item.artist}</strong>
              </button>
            ))}
          </section>
        )}
        {(section === "Écouter" ||
          (section === "Bibliothèque" && libraryTab === "Playlists")) &&
          !query && (
            <section className="collections" aria-label="Collections">
              {(section === "Bibliothèque"
                ? ["Après le service"]
                : ["Après le service", "Chicago"]
              ).map((title, i) => (
                <button
                  key={title}
                  onClick={() => (i ? openTrack(i) : go("Après le service"))}
                >
                  <img src={"/den-" + i + ".svg"} alt="" />
                  <strong>{title}</strong>
                  <small>{i ? "Sufjan Stevens" : "2 morceaux"}</small>
                </button>
              ))}
            </section>
          )}
        {menu ? (
          <MenuPage
            page={section}
            go={go}
            prefs={prefs}
            volume={volume}
            select={select}
          />
        ) : section === "Lecture" ? (
          <section className="now-playing">
            <img src={"/den-track-" + (playing ?? preview) + ".png"} alt="" />
            <div>
              <h2>{tracks[playing ?? preview].title}</h2>
              <button onClick={() => setCommand((c) => c + 1)}>
                {audible ? "Pause" : "Reprendre"}
              </button>
              <button onClick={advance}>Suivant ›</button>
              <button onClick={() => go("Volume")}>Volume</button>
              <p>
                <button onClick={() => go("Écouter")}>‹ Écouter</button>
                <button onClick={() => go("À suivre")}>À suivre ›</button>
              </p>
            </div>
          </section>
        ) : (
          <section
            hidden={
              section === "Bibliothèque" && libraryTab !== "Morceaux" && !query
            }
            aria-label="Liste des morceaux"
          >
            {notice && <p role="status">{notice}</p>}
            <h2>{section === "À suivre" ? "File de lecture" : "Morceaux"}</h2>
            {results.map((i, position) => (
              <button
                className="track"
                key={position}
                onClick={() => openTrack(i)}
              >
                <img src={"/den-" + i + ".svg"} alt="" />
                <span>
                  <b>{tracks[i].title}</b>
                  <small>{tracks[i].artist}</small>
                </span>
                <span className="track-end">
                  {playing === i && audible ? (
                    "En lecture"
                  ) : (
                    <span aria-hidden="true">···</span>
                  )}
                </span>
              </button>
            ))}
            {!results.length && <p role="status">Aucun morceau trouvé.</p>}
          </section>
        )}
        <footer>
          <a href="/profil">Profil</a> ·{" "}
          <button onClick={() => go("Réglages")}>Réglages</button>
          <button onClick={() => go("Extras")}>Extras</button>
        </footer>
      </main>
      {playing === null ? (
        <PlayerBar
          track={track}
          index={preview}
          onToggle={() => start(preview)}
          onPrevious={next}
          onNext={next}
          onOpen={() => openTrack(preview)}
          onQueue={() => go("À suivre")}
          volume={volume}
          onVolumeChange={(e) => setVolume(Number(e.target.value))}
        />
      ) : (
        <MusicVideoPlayer
          key={playing}
          track={tracks[playing]}
          index={playing}
          onPrevious={() => start(1 - playing)}
          onNext={advance}
          onOpen={() => openTrack(playing)}
          onQueue={() => go("À suivre")}
          command={command}
          onPlayingChange={setAudible}
          volume={volume}
          onVolumeChange={(e) => setVolume(Number(e.target.value))}
          onClose={() => {
            setPlaying(null);
            go("Écouter");
          }}
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
            <picture>
              <source
                media="(min-width:701px)"
                srcSet={"/den-track-" + preview + ".png"}
              />
              <img src={art[preview]} alt="" />
            </picture>
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
          <button onClick={add}>Ajouter à la file</button>
          <button aria-label="Morceau suivant" onClick={next}>
            →
          </button>
        </div>
      </dialog>
    </div>
  );
}

