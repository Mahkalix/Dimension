"use client";
import SolarIcon from "./components/SolarIcon";

import PlayerBar from "./components/PlayerBar";
import ListenDashboard from "./components/ListenDashboard";
import TrackRow from "./components/TrackRow";
import TrackPreview from "./components/TrackPreview";
import { useEffect, useRef, useState } from "react";
import tracks from "./data/library";
import artistProfiles from "./data/artists.json";
import playlists from "./data/playlists.json";

import { MenuPage, menuPages, defaults } from "./MenuPage";
const sections = ["Listen", "Library", "Up next", "Search"];
const artists = artistProfiles.map((artist) => ({
  ...artist,
  tracks: tracks.filter((track) => track.artist === artist.name),
}));

export default function TheDen({ signedIn = false }) {
  const [pins, setPins] = useState([]);
  const searchInput = useRef(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("den-pinned-playlists"));
      if (Array.isArray(saved))
        setPins(saved.filter((id) => playlists.some((p) => p.id === id)));
    } catch {}
    const shortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  const togglePin = (id) => {
    const updated = pins.includes(id)
      ? pins.filter((pin) => pin !== id)
      : [...pins, id];
    setPins(updated);
    try {
      localStorage.setItem("den-pinned-playlists", JSON.stringify(updated));
    } catch {}
  };
  const sortedPlaylists = [...playlists].sort(
    (a, b) => Number(pins.includes(b.id)) - Number(pins.includes(a.id)),
  );
  const [playlist, setPlaylist] = useState(null);
  const [section, setSection] = useState("Listen");
  const [libraryTab, setLibraryTab] = useState("Playlists");
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState(null);
  const [preview, setPreview] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewTrigger = useRef(null),
    previewClose = useRef(null);
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(0.35);
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
    window.scrollTo(0, 0);
    setSection(page);
    setPlaylist(null);
    setQuery("");
    setGenre(null);
    setNotice("");
    if (prefs["Navigation sounds"] === "On" && window.AudioContext) {
      const ctx = tone.current || (tone.current = new AudioContext());
      const osc = ctx.createOscillator(),
        gain = ctx.createGain();
      gain.gain.value = 0.012 * volume;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    }
  };
  const select = (key, value, i) => {
    const updated = { ...prefs, [key]: value };
    const level = volume;
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
  const playlistOrder = playlist?.tracks.map((id) =>
    tracks.findIndex((t) => t.id === id),
  );
  const order =
    section === "Up next" ? queue : playlistOrder || tracks.map((_, i) => i);
  const upcoming = queue.slice(0, 3);
  while (upcoming.length < 3) {
    upcoming.push(((upcoming.at(-1) ?? playing ?? preview) + 1) % tracks.length);
  }
  const selectedArtist =
    section === "Library" && libraryTab === "Artists"
      ? artists.find((artist) => artist.name === query)
      : null;
  const results = order.filter(
    (i) =>
      (!selectedArtist || tracks[i].artist === selectedArtist.name) &&
      (!genre || tracks[i].genre === genre) &&
      (tracks[i].title + " " + tracks[i].artist)
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const choosePlaylist = (item) => {
    go(item.title);
    setPlaylist(item);
  };
  const playPlaylist = (item) => {
    const indices = item.tracks.map((id) =>
      tracks.findIndex((t) => t.id === id),
    );
    setQueue(indices.slice(1));
    start(indices[0], false);
  };
  const browse = (tab = "Tracks") => {
    go("Library");
    setLibraryTab(tab);
  };
  const activateTrack = (i, position) => {
    openTrack(i);
    setQueue((q) =>
      section === "Up next" ? q.slice(position + 1) : q.filter((n) => n !== i),
    );
    if (playing === i && audible) toggle();
    else start(i, false);
  };
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
    <TrackPreview
      track={track}
      context={
        playlist?.tracks.includes(track.id)
          ? playlist.title
          : playing === preview
            ? "Now playing"
            : "Track preview"
      }
      queued={queue.includes(preview)}
      onClose={closePreview}
      closeRef={previewClose}
      onQueue={add}
      onPrevious={previous}
      onNext={next}
      onRelated={(i) => start(i, false)}
      notice={notice}
      error={audioError}
    />
  );
  return (
    <div
      className="den"
      data-section={section}
      data-preview={previewOpen}
      data-light={prefs.Backlight}
      data-appearance={prefs.Appearance || "Paper"}
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
      <div className="app-topbar">
        <button
          className="header-brand"
          aria-label="The Den · Home"
          onClick={() => go("Listen")}
        >
          <img
            className="logo"
            src="/brand/the-den-wordmark.png"
            alt="The Den"
          />
          <span className="eyebrow">Before service. After hours.</span>
        </button>
        <div className="topbar-search">
          <button
            className="home-button"
            aria-label="Home"
            onClick={() => go("Listen")}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z" />
            </svg>
          </button>{" "}
          <label className="search-field">
            <SolarIcon name="magnifier" />
            <input
              ref={searchInput}
              aria-label="Search tracks"
              type="search"
              placeholder="What do you want to listen to?"
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                if (section !== "Search") go("Search");
                setQuery(value);
              }}
            />
            <kbd aria-hidden="true">Ctrl K</kbd>{" "}
          </label>
        </div>{" "}
        <details
          className="account-menu"
          onClick={(e) => {
            if (e.target.closest("a,button")) e.currentTarget.open = false;
          }}
        >
          <summary aria-label="Account menu" title="Account">
            <SolarIcon name="user-circle" />
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
            <a href={signedIn ? "/auth/logout" : "/login?returnTo=%2Fplayer"}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M9 4H4v16h5M9 12h12m-4-4 4 4-4 4" />
              </svg>
              {signedIn ? "Sign out" : "Sign in"}
            </a>
          </div>
        </details>
      </div>
      <aside className="rail">
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
        <section
          className="rail-playlists"
          aria-labelledby="rail-playlists-title"
        >
          <h2 className="eyebrow" id="rail-playlists-title">
            <button
              className="library-heading"
              onClick={() => browse("Playlists")}
            >
              <SolarIcon name="playlist" />
              Library
            </button>
          </h2>
          {sortedPlaylists.map((item) => (
            <div className="rail-playlist-row" key={item.id}>
              <button
                className="rail-playlist-open"
                onClick={() => choosePlaylist(item)}
                aria-current={playlist?.id === item.id ? "page" : undefined}
              >
                <img
                  src={item.cover}
                  alt=""
                  style={{ objectPosition: item.imagePosition }}
                />
                <span>
                  <b>{item.title}</b>
                  <small>
                    {pins.includes(item.id) ? "Pinned · " : ""}Playlist ·{" "}
                    {item.tracks.length} tracks
                  </small>
                </span>
              </button>
              <button
                className="pin-playlist"
                aria-label={`${pins.includes(item.id) ? "Unpin" : "Pin"} ${item.title}`}
                aria-pressed={pins.includes(item.id)}
                onClick={() => togglePin(item.id)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path d="m15 3 6 6-3 1-3 5v3l-4-4-6 7 5-8-4-4h3l5-3z" />
                </svg>
              </button>
            </div>
          ))}
        </section>
        <div className="rail-signoff">
          <img src="/brand/the-den-house.png" alt="" />
          <span>
            A place to tune in.<small>Est. in the kitchen.</small>
          </span>
        </div>
      </aside>
      <main>
        <header className="main-header">
          <div>
            <h1>
              {section === "Now playing"
                ? tracks[playing ?? preview].artist
                : section}
            </h1>
          </div>
        </header>
        {section === "Listen" && !query && (
          <ListenDashboard
            playing={playing}
            audible={audible}
            onTrack={activateTrack}
            upcoming={upcoming}
            onQueue={() => go("Up next")}
            onPlayUpcoming={(i, position) => {
              setQueue((q) => q.slice(position + 1));
              start(i, false);
            }}
            onPlaylist={choosePlaylist}
            onPlayPlaylist={playPlaylist}
            onBrowse={browse}
            onGenre={(value) => {
              browse();
              setGenre(value);
            }}
          />
        )}
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
                  setGenre(null);
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
        {section === "Library" && libraryTab === "Artists" && !query && (
          <section className="artist-list" aria-label="Artists">
            {artists.map((item) => (
              <button key={item.id} onClick={() => setQuery(item.name)}>
                <img src={item.image} alt="" loading="lazy" />
                <strong>{item.name}</strong>
                <small>{item.tracks.length} tracks</small>
              </button>
            ))}
          </section>
        )}
        {selectedArtist && (
          <section className="artist-profile" aria-label={selectedArtist.name}>
            <div className="artist-banner">
              <img src={selectedArtist.image} alt={selectedArtist.name} />
              <div className="artist-banner-copy">
                <button onClick={() => setQuery("")}>‹ All artists</button>
                <span className="eyebrow">Artist</span>
                <h2>{selectedArtist.name}</h2>
                <p>{selectedArtist.tracks.length} tracks in your library</p>
                <p>
                  {[
                    ...new Set(
                      selectedArtist.tracks.map((track) => track.genre),
                    ),
                  ].join(" · ")}
                </p>
              </div>
            </div>
            <div className="artist-actions">
              <button
                className="artist-play"
                onClick={() =>
                  playPlaylist({
                    tracks: selectedArtist.tracks.map((track) => track.id),
                  })
                }
              >
                <SolarIcon name="play" /> Play all
              </button>
              <button
                onClick={() => {
                  const ids = selectedArtist.tracks.map((track) => track.id);
                  for (let i = ids.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [ids[i], ids[j]] = [ids[j], ids[i]];
                  }
                  playPlaylist({ tracks: ids });
                }}
              >
                Shuffle
              </button>
              <a href={selectedArtist.source} target="_blank" rel="noreferrer">
                {selectedArtist.credit}
              </a>
              {selectedArtist.license && (
                <a
                  href={selectedArtist.license}
                  target="_blank"
                  rel="noreferrer"
                >
                  Photo license
                </a>
              )}
            </div>
          </section>
        )}
        {section === "Library" && libraryTab === "Playlists" && !query && (
          <section className="collections" aria-label="Collections">
            {sortedPlaylists.map((p) => (
              <button key={p.id} onClick={() => choosePlaylist(p)}>
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
            <div className="playlist-info">
              <span className="eyebrow">Playlist</span>
              <h2>{playlist.title}</h2>
              <p>
                The Den · {playlist.tracks.length} tracks ·{" "}
                {Math.round(
                  playlist.tracks.reduce(
                    (total, id) =>
                      total + tracks.find((track) => track.id === id).duration,
                    0,
                  ) / 60,
                )}{" "}
                min
              </p>
              <div className="playlist-actions">
                <button
                  aria-pressed={pins.includes(playlist.id)}
                  onClick={() => togglePin(playlist.id)}
                >
                  {pins.includes(playlist.id)
                    ? "Unpin playlist"
                    : "Pin playlist"}
                </button>
                <button
                  className="playlist-play"
                  onClick={() => playPlaylist(playlist)}
                >
                  <SolarIcon name="play" />
                  Play playlist
                </button>
              </div>
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
              <p>
                <button onClick={() => go("Listen")}>‹ Listen</button>
                <button onClick={() => go("Up next")}>Up next ›</button>
              </p>
            </div>
          </section>
        ) : (
          section !== "Listen" && (
            <section
              hidden={
                section === "Library" && libraryTab !== "Tracks" && !query
              }
              aria-label="Track list"
            >
              {notice && <p role="status">{notice}</p>}
              <div className="section-heading">
                <h2>
                  {section === "Up next"
                    ? "Playback queue"
                    : genre
                      ? `${genre} tracks`
                      : "Tracks"}
                </h2>
                {genre && (
                  <button onClick={() => setGenre(null)}>
                    All genres <SolarIcon name="close-circle" />
                  </button>
                )}
              </div>
              {results.map((i, position) => (
                <TrackRow
                  key={`${tracks[i].id}-${position}`}
                  track={tracks[i]}
                  number={position + 1}
                  current={playing === i}
                  playing={audible}
                  onClick={() => activateTrack(i, position)}
                />
              ))}
              {!results.length && <p role="status">No tracks found.</p>}
            </section>
          )
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
        onVolumeChange={(e) => {
          const level = Number(e.target.value);
          setVolume(level);
          try {
            localStorage.setItem(
              "den-preferences",
              JSON.stringify({ prefs, volume: level }),
            );
          } catch {}
        }}
        position={time.position}
        duration={time.duration}
        onSeek={(e) => {
          audio.current.currentTime = Number(e.target.value);
          setTime((t) => ({ ...t, position: Number(e.target.value) }));
        }}
      />{" "}
      <dialog
        ref={dialog}
        aria-label="Track preview"
        className="record"
        onCancel={(event) => {
          event.preventDefault();
          closePreview();
        }}
      >
        {!previewOpen && previewContent}
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
