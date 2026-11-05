"use client";
import SolarIcon from "./components/SolarIcon";

import PlayerBar from "./components/PlayerBar";
import { useEffect, useRef, useState } from "react";
import tracks from "./data/library";
import playlists from "./data/playlists.json";

import { MenuPage, menuPages, defaults } from "./MenuPage";
const art = tracks.map((t) => t.art);
const sections = ["Listen", "Library", "Up next", "Search"];

export default function TheDen() {
  const [playlist, setPlaylist] = useState(null);
  const [section, setSection] = useState("Listen");
  const [libraryTab, setLibraryTab] = useState("Playlists");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewTrigger = useRef(null),
    previewClose = useRef(null);
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(0.65);
  const [queue, setQueue] = useState([]);
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
    setPlaylist(null);
    setQuery("");
    setNotice("");
    if (prefs["Navigation sounds"] === "On" && window.AudioContext) {
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
    if (
      audio.current.getAttribute("src") !== tracks[i].url ||
      audio.current.error
    ) {
      audio.current.src = tracks[i].url;
      audio.current.load();
      setTime({ position: 0, duration: 0 });
    }
    if (open) go("Now playing");
    try {
      await audio.current.play();
    } catch (error) {
      if (id === request.current && error.name !== "AbortError") {
        setAudible(false);
        setAudioError(
          "Playback failed. Check your connection, then retry or choose another track.",
        );
      }
    }
  };
  const advance = () => {
    const i = queue.length
      ? queue[0]
      : ((playing ?? preview) + 1) % tracks.length;
    setQueue((q) => q.slice(1));
    start(i, false);
  };
  const add = () => {
    setQueue((q) => (q.includes(preview) ? q : [...q, preview]));
    if (!previewOpen && !dialog.current.open) go("Up next");
    setNotice("Added to queue");
  };
  const menu = menuPages.includes(section);
  const dialog = useRef(null);
  const touch = useRef(null);
  const track = tracks[preview];
  const previous = () =>
    setPreview((i) => (i - 1 + tracks.length) % tracks.length);
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
    if (playing === preview && audible) toggle();
    else start(preview, false);
  };
  const playlistOrder = playlist?.tracks.map((id) =>
    tracks.findIndex((t) => t.id === id),
  );
  const order =
    section === "Up next" ? queue : playlistOrder || tracks.map((_, i) => i);
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
        <span>Back to tracks</span>
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
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) previous();
            else next();
          }
        }}
      >
        <img
          className="neighbor side0"
          src={art[(preview + 1) % tracks.length]}
          alt=""
        />
        <figure>
          <picture>
            <source media="(min-width:701px)" srcSet={track.visual} />
            <img src={art[preview]} alt="" />
          </picture>
          <figcaption aria-live="polite">
            <b>{track.title}</b>
            <small>{track.artist}</small>
          </figcaption>
        </figure>
      </div>
      <div className="transport">
        <span className="sr-only" role="status">
          {notice}
        </span>
        <button aria-label="Previous track" onClick={previous}>
          <SolarIcon name="skip-previous" />
        </button>
        <button onClick={play}>
          <SolarIcon name={playing === preview && audible ? "pause" : "play"} />{" "}
          {playing === preview && audible ? "Pause" : "Play"}
        </button>
        <button onClick={add}>Add to queue</button>
        <button aria-label="Next track" onClick={next}>
          <SolarIcon name="skip-next" />
        </button>
        {audioError && (
          <p className="preview-error" role="alert">
            {audioError}
          </p>
        )}
      </div>
    </>
  );
  return (
    <div
      className="den"
      data-section={section}
      data-preview={previewOpen}
      data-chrome={prefs["Chrome intensity"]}
      data-light={prefs.Backlight}
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
            "This audio file is unavailable. Retry or choose another track.",
          );
        }}
      />
      <aside className="rail">
        <a href="/" aria-label="The Den · Home">
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
            Account
            <SolarIcon name="alt-arrow-down" />
          </summary>
          <div>
            <a href="/account">
              <SolarIcon name="user-circle" />
              Account
            </a>
            <button onClick={() => go("Settings")}>
              <SolarIcon name="settings" />
              Settings
            </button>
            <button onClick={() => go("Extras")}>
              <SolarIcon name="widget" />
              Extras
            </button>
          </div>
        </details>
        <nav aria-label="Main navigation">
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
      </aside>
      <main>
        <header>
          <h1>
            {section === "Now playing"
              ? tracks[playing ?? preview].artist
              : section}
          </h1>
          <input
            aria-label="Search tracks"
            type="search"
            placeholder="Title or artist"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </header>
        {section === "Library" && (
          <div
            className="library-switch"
            role="group"
            aria-label="Browse library"
          >
            {["Playlists", "Artists", "Tracks"].map((tab) => (
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
        {section === "Library" && libraryTab === "Artists" && !query && (
          <section className="artist-list" aria-label="Artists">
            {tracks
              .filter(
                (item, i) =>
                  tracks.findIndex((t) => t.artist === item.artist) === i,
              )
              .map((item) => (
                <button key={item.id} onClick={() => setQuery(item.artist)}>
                  <img src={item.visual} alt="" />
                  <strong>{item.artist}</strong>
                </button>
              ))}
          </section>
        )}
        {(section === "Listen" ||
          (section === "Library" && libraryTab === "Playlists")) &&
          !query && (
            <section className="collections" aria-label="Collections">
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    go(p.title);
                    setPlaylist(p);
                  }}
                >
                  <img
                    src={p.cover}
                    alt={p.alt}
                    style={{ objectPosition: p.imagePosition }}
                  />
                  <strong>{p.title}</strong>
                  <small>{p.tracks.length} tracks</small>
                </button>
              ))}{" "}
            </section>
          )}
        {playlist && (
          <section className="playlist-hero" aria-label={playlist.title}>
            <img
              src={playlist.cover}
              alt={playlist.alt}
              style={{ objectPosition: playlist.imagePosition }}
            />
            <div>
              <span>{playlist.tracks.length} tracks</span>
              <button
                onClick={() => {
                  setQueue(playlistOrder.slice(1));
                  start(playlistOrder[0], false);
                }}
              >
                <SolarIcon name="play" />
                Play playlist
              </button>
            </div>
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
        ) : section === "Now playing" ? (
          <section className="now-playing">
            <img src={tracks[playing ?? preview].visual} alt="" />
            <div>
              <h2>{tracks[playing ?? preview].title}</h2>
              <button onClick={toggle}>{audible ? "Pause" : "Resume"}</button>
              <button onClick={advance}>Next ›</button>
              <button onClick={() => go("Volume")}>Volume</button>
              <p>
                <button onClick={() => go("Listen")}>‹ Listen</button>
                <button onClick={() => go("Up next")}>Up next ›</button>
              </p>
            </div>
          </section>
        ) : (
          <section
            hidden={section === "Library" && libraryTab !== "Tracks" && !query}
            aria-label="Track list"
          >
            {notice && <p role="status">{notice}</p>}
            <h2>{section === "Up next" ? "Playback queue" : "Tracks"}</h2>
            {results.map((i, position) => (
              <button
                className="track"
                key={position}
                onClick={() => {
                  openTrack(i);
                  setQueue((q) =>
                    section === "Up next"
                      ? q.slice(position + 1)
                      : q.filter((n) => n !== i),
                  );
                  if (playing === i && audible) toggle();
                  else start(i, false);
                }}
                aria-current={playing === i ? "true" : undefined}
              >
                <img src={tracks[i].art} alt="" />
                <span>
                  <b>{tracks[i].title}</b>
                  <small>{tracks[i].artist}</small>
                </span>
                <span className="track-end">
                  {playing === i && audible ? (
                    "Playing"
                  ) : (
                    <span aria-hidden="true">···</span>
                  )}
                </span>
              </button>
            ))}
            {!results.length && <p role="status">No tracks found.</p>}
          </section>
        )}
      </main>
      {audioError && (
        <div className="audio-error" role="alert">
          {audioError}
          <button onClick={() => start(playing ?? preview, false)}>
            Retry
          </button>
        </div>
      )}
      <PlayerBar
        track={tracks[playing ?? preview]}
        playing={audible}
        onToggle={toggle}
        onPrevious={() =>
          playing === null
            ? previous()
            : start((playing - 1 + tracks.length) % tracks.length, false)
        }
        onNext={() => (playing === null ? next() : advance())}
        onOpen={() => openTrack(playing ?? preview)}
        onQueue={() => go("Up next")}
        volume={volume}
        onVolumeChange={(e) => setVolume(Number(e.target.value))}
        position={time.position}
        duration={time.duration}
        onSeek={(e) => {
          audio.current.currentTime = Number(e.target.value);
          setTime((t) => ({ ...t, position: Number(e.target.value) }));
        }}
      />{" "}
      <dialog ref={dialog} aria-label="Track preview" className="record">
        {previewContent}
      </dialog>
      {previewOpen && (
        <aside
          className="track-preview"
          aria-label="Track preview"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              e.stopPropagation();
              closePreview();
            }
          }}
        >
          {previewContent}
        </aside>
      )}
    </div>
  );
}
