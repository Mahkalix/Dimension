"use client";
import SolarIcon from "./components/SolarIcon";

import PlayerBar from "./components/PlayerBar";
import { useEffect, useRef, useState } from "react";
import tracks from "./data/selection.json";

import { MenuPage, menuPages, defaults } from "./MenuPage";
const art = tracks.map((t) => t.art);
const sections = ["Écouter", "Bibliothèque", "À suivre", "Recherche"];

export default function TheDen({ account }) {
  const [section, setSection] = useState("Écouter");
  const [libraryTab, setLibraryTab] = useState("Playlists");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewTrigger = useRef(null),
    previewClose = useRef(null);
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(0.65);
  const [queue, setQueue] = useState([1]);
  const [notice, setNotice] = useState("");
  const audio = useRef(null),
    request = useRef(0);
  const [time, setTime] = useState({ position: 0, duration: 0 });
  const [audioError, setAudioError] = useState("");
  const toggle = () => {
    if (audible) {
      request.current++;
      audio.current.pause();
    } else start(playing ?? preview, false);
  };
  useEffect(() => {
    audio.current.volume = volume;
  }, [volume]);
  const [audible, setAudible] = useState(false);
  const [prefs, setPrefs] = useState(defaults);
  const tone = useRef(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("den-preferences"));
      if (saved) {
        setPrefs({ ...defaults, ...saved.prefs });
        if (
          Number.isFinite(saved.volume) &&
          saved.volume >= 0 &&
          saved.volume <= 1
        )
          setVolume(saved.volume);
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
  const start = async (i, open = true) => {
    const id = ++request.current;
    setAudioError("");
    setPlaying(i);
    setPreview(i);
    if (audio.current.getAttribute("src") !== tracks[i].url) {
      audio.current.src = tracks[i].url;
      setTime({ position: 0, duration: 0 });
    }
    if (open) go("Lecture");
    try {
      await audio.current.play();
    } catch (error) {
      if (id === request.current && error.name !== "AbortError") {
        setAudible(false);
        setAudioError(
          "Lecture impossible. Réessayer ou choisir un autre morceau.",
        );
      }
    }
  };
  const advance = () => {
    const i = queue.length ? queue[0] : 1 - (playing ?? preview);
    setQueue((q) => q.slice(1));
    start(i, !previewOpen);
  };
  const add = () => {
    setQueue((q) => [...q, preview]);
    dialog.current.close();
    if (!previewOpen) go("À suivre");
    setNotice("Ajouté à la file");
  };
  const menu = menuPages.includes(section);
  const dialog = useRef(null);
  const touch = useRef(null);
  const track = tracks[preview];
  const next = () => setPreview((i) => (i + 1) % tracks.length);
  const openTrack = (i) => {
    setPreview(i);
    previewTrigger.current = document.activeElement;
    if (window.matchMedia("(max-width:700px)").matches)
      dialog.current.showModal();
    else setPreviewOpen(true);
  };
  useEffect(() => {
    const pane = dialog.current;
    return () => pane?.close();
  }, []);
  const play = () => {
    start(preview, !previewOpen);
    dialog.current.close();
  };
  const order = section === "À suivre" ? queue : [0, 1];
  const results = order.filter((i) =>
    (tracks[i].title + " " + tracks[i].artist)
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const closePreview = () => {
    dialog.current.close();
    setPreviewOpen(false);
    previewTrigger.current?.focus();
  };
  useEffect(() => {
    if (previewOpen) previewClose.current?.focus();
  }, [previewOpen]);
  useEffect(() => {
    const media = window.matchMedia("(max-width:700px)");
    const adapt = () => {
      if (media.matches && previewOpen) {
        dialog.current.showModal();
        setPreviewOpen(false);
      } else if (!media.matches && dialog.current.open) {
        dialog.current.close();
        setPreviewOpen(true);
      }
    };
    media.addEventListener("change", adapt);
    return () => media.removeEventListener("change", adapt);
  }, [previewOpen]);
  const previewContent = (
    <>
      <button className="return" ref={previewClose} onClick={closePreview}>
        <SolarIcon name="close-circle" />
        <span>Retour aux morceaux</span>
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
          <SolarIcon name="skip-previous" />
        </button>
        <button onClick={play}>
          <SolarIcon name="play" /> Écouter
        </button>
        <button onClick={add}>Ajouter à la file</button>
        <button aria-label="Morceau suivant" onClick={next}>
          <SolarIcon name="skip-next" />
        </button>
      </div>
    </>
  );
  return (
    <div
      className="den"
      data-section={section}
      data-preview={previewOpen}
      data-chrome={prefs["Intensité du chrome"]}
      data-light={prefs.Rétroéclairage}
    >
      <audio
        ref={audio}
        preload="metadata"
        onPlay={() => setAudible(true)}
        onPause={() => setAudible(false)}
        onLoadedMetadata={() =>
          setTime((t) => ({
            ...t,
            duration: Number.isFinite(audio.current.duration)
              ? audio.current.duration
              : 0,
          }))
        }
        onTimeUpdate={() =>
          setTime((t) => ({ ...t, position: audio.current.currentTime }))
        }
        onEnded={advance}
        onError={() => {
          setAudible(false);
          setAudioError(
            "Ce morceau est indisponible. Réessayer ou choisir un autre titre.",
          );
        }}
      />
      <aside className="rail">
        <a href="/" aria-label="DIMENSION · Accueil">
          <img
            className="logo"
            src="/brand/the-den-wordmark.png"
            alt="The Den"
          />
        </a>
        <details
          className="account-menu"
          onClick={(e) => {
            if (e.target.closest("a,button")) e.currentTarget.open = false;
          }}
        >
          <summary>
            <SolarIcon name="user-circle" />
            Compte <SolarIcon name="alt-arrow-down" />
          </summary>
          <div>
            <strong>{account?.name || "Bienvenue"}</strong>
            {account?.connected ? (
              <a href="/auth/logout">
                <SolarIcon name="logout-2" />
                Se déconnecter
              </a>
            ) : (
              <a href="/auth/login?returnTo=/player">
                <SolarIcon name="login-2" />
                Se connecter
              </a>
            )}
            {account?.spotify ? (
              <>
                <span>Spotify · {account.spotify.name}</span>
                <form method="post" action="/api/spotify/disconnect">
                  <button>
                    <SolarIcon name="link-minimalistic-2" />
                    Dissocier Spotify
                  </button>
                </form>
              </>
            ) : (
              <a href="/api/spotify/connect">
                <img className="solar-icon" src="/spotify.svg" alt="" />
                Connecter mon Spotify
              </a>
            )}
            <a href="/profil">
              <SolarIcon name="user-circle" />
              Mon profil
            </a>
            <button onClick={() => go("Réglages")}>
              <SolarIcon name="settings" />
              Réglages
            </button>
            <button onClick={() => go("Extras")}>
              <SolarIcon name="widget" />
              Extras
            </button>
          </div>
        </details>
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
                  [
                    "headphones-round",
                    "library",
                    "playlist",
                    "solar-magnifier",
                  ][i] +
                  ".svg"
                }
              />
              {name}
            </button>
          ))}
        </nav>
        <footer>
          <a href="/profil">
            <SolarIcon name="user-circle" />
            Profil
          </a>
          <button onClick={() => go("Réglages")}>
            <SolarIcon name="settings" />
            Réglages
          </button>
          <button onClick={() => go("Extras")}>
            <SolarIcon name="widget" />
            Extras
          </button>
        </footer>
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
                : ["Après le service", "Carefree"]
              ).map((title, i) => (
                <button
                  key={title}
                  onClick={() => (i ? openTrack(i) : go("Après le service"))}
                >
                  <img src={"/den-" + i + ".svg"} alt="" />
                  <strong>{title}</strong>
                  <small>{i ? tracks[1].artist : "2 morceaux"}</small>
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
              <button onClick={toggle}>
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
      </main>
      {audioError && (
        <div className="audio-error" role="alert">
          {audioError}
          <button onClick={() => start(playing ?? preview, false)}>
            Réessayer
          </button>
        </div>
      )}
      <PlayerBar
        track={tracks[playing ?? preview]}
        index={playing ?? preview}
        playing={audible}
        onToggle={toggle}
        onPrevious={() =>
          playing === null ? next() : start(1 - playing, false)
        }
        onNext={() => (playing === null ? next() : advance())}
        onOpen={() => openTrack(playing ?? preview)}
        onQueue={() => go("À suivre")}
        volume={volume}
        onVolumeChange={(e) => setVolume(Number(e.target.value))}
        position={time.position}
        duration={time.duration}
        onSeek={(e) => {
          audio.current.currentTime = Number(e.target.value);
          setTime((t) => ({ ...t, position: Number(e.target.value) }));
        }}
      />{" "}
      <dialog ref={dialog} aria-label="Fiche du morceau" className="record">
        {previewContent}
      </dialog>
      {previewOpen && (
        <aside
          className="track-preview"
          aria-label="Fiche du morceau"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              e.stopPropagation();
              closePreview();
            }
          }}
        >
          {previewContent}
          {notice && <p role="status">{notice}</p>}
          <section className="preview-note">
            <h3>À propos du morceau</h3>
            <p>{track.artist}</p>
            <a href={track.sourceUrl} target="_blank" rel="noreferrer">
              Source · Incompetech
            </a>
            <a href={track.licenseUrl} target="_blank" rel="noreferrer">
              {track.license}
            </a>
          </section>
          <section className="preview-note">
            <h3>À suivre</h3>
            <p>{tracks[queue[0] ?? 1 - preview].title}</p>
            <button onClick={() => go("À suivre")}>Voir la file</button>
          </section>
        </aside>
      )}
    </div>
  );
}
