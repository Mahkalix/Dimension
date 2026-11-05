import { useEffect, useRef, useState } from "react";
import SolarIcon from "./SolarIcon";
import Dedication from "./Dedication";
import TrackRow, { formatDuration } from "./TrackRow";
import tracks from "../data/library";
import playlists from "../data/playlists.json";

const featured = playlists.find((playlist) => playlist.id === "apres-service");
const picks = ["tea-roots", "cylinder-5", "shaw-solo-acoustic-3"].map((id) =>
  tracks.findIndex((track) => track.id === id),
);

export default function ListenDashboard({
  playing,
  audible,
  onTrack,
  onPlay,
  onPlaylist,
  onPlayPlaylist,
  onBrowse,
}) {
  const shelf = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  useEffect(() => {
    const element = shelf.current;
    const update = () =>
      setEdges({
        start: element.scrollLeft <= 2,
        end:
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
      });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, []);
  const scrollShelf = (direction) => {
    const element = shelf.current;
    element.scrollBy({
      left: direction * element.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  return (
    <div className="listen-dashboard">
      <section className="listen-feature" aria-label="Featured playlist">
        <img
          src={featured.cover}
          alt={featured.alt}
          style={{ objectPosition: featured.imagePosition }}
        />
        <div className="feature-copy">
          <span className="eyebrow">The after hours selection</span>
          <h2>
            {featured.title}
            <span>.</span>
          </h2>
          <p>The rush is over. Let the record run.</p>
          <div className="feature-actions">
            <button onClick={() => onPlayPlaylist(featured)}>
              <SolarIcon name="play" />
              Play selection
            </button>
            <button
              onClick={() => onPlaylist(featured)}
              aria-label={`Explore ${featured.title}`}
            >
              <SolarIcon name="arrow-right" />
            </button>
            <span>{featured.tracks.length} tracks · Made for slowing down</span>
          </div>
        </div>
        <span className="feature-edition" aria-hidden="true">
          THE DEN / VOL. 01
        </span>
      </section>

      <section className="rotation" aria-labelledby="rotation-title">
        <div className="section-heading">
          <h2 id="rotation-title">In rotation</h2>
          <button onClick={() => onBrowse()}>
            All tracks <SolarIcon name="arrow-right" />
          </button>
        </div>
        {tracks.slice(0, 4).map((track, i) => (
          <TrackRow
            key={track.id}
            track={track}
            number={i + 1}
            current={playing === i}
            playing={audible}
            onClick={() => onTrack(i)}
          />
        ))}
      </section>

      <aside className="dashboard-side" aria-label="Discover music">
        <section className="house-picks" aria-labelledby="picks-title">
          <div className="section-heading">
            <h2 id="picks-title">House picks</h2>
            <span className="eyebrow">01 / 03</span>
          </div>
          <div className="picks-list">
            {picks.map((index, position) => {
              const track = tracks[index];
              const active = playing === index && audible;
              return (
                <button
                  className="spotlight-track"
                  key={track.id}
                  onClick={() => onPlay(index)}
                  aria-label={`${active ? "Pause" : "Play"} ${track.title}`}
                  aria-pressed={active}
                >
                  <span className="pick-number">0{position + 1}</span>
                  <img src={track.art} alt="" />
                  <span className="pick-copy">
                    <b>{track.title}</b>
                    <small>{track.artist}</small>
                    <time>{formatDuration(track.duration)}</time>
                  </span>
                  <SolarIcon name={active ? "pause" : "play"} />
                </button>
              );
            })}
          </div>
        </section>
        <Dedication />
      </aside>

      <section className="playlist-shelf" aria-labelledby="shelf-title">
        <div className="section-heading">
          <h2 id="shelf-title">Made for the moment</h2>
          <button onClick={() => onBrowse("Playlists")}>
            All playlists <SolarIcon name="arrow-right" />
          </button>
        </div>
        <div className="shelf-carousel">
          <div className="shelf-records" id="playlist-carousel" ref={shelf}>
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                className="shelf-record"
                onClick={() => onPlaylist(playlist)}
              >
                <div className="shelf-cover">
                  <img
                    src={playlist.cover}
                    alt={playlist.alt}
                    style={{ objectPosition: playlist.imagePosition }}
                  />
                  <span className="playlist-brand" data-style={playlist.logoStyle || "badge"} aria-hidden="true" />
                  <SolarIcon name="arrow-right" />
                </div>
                <strong>{playlist.title}</strong>
                <small>{playlist.tracks.length} tracks</small>
              </button>
            ))}
          </div>
          <button
            className="shelf-arrow shelf-arrow-prev"
            aria-label="Previous playlists"
            aria-controls="playlist-carousel"
            disabled={edges.start}
            onClick={() => scrollShelf(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14 5-7 7 7 7" />
            </svg>
          </button>
          <button
            className="shelf-arrow shelf-arrow-next"
            aria-label="Next playlists"
            aria-controls="playlist-carousel"
            disabled={edges.end}
            onClick={() => scrollShelf(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m10 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
