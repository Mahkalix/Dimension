import SolarIcon from "./SolarIcon";

export function formatDuration(seconds) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export default function TrackRow({ track, number, current, playing, onClick, onQueue, queued }) {
  return (
    <div className="track-row">
    <button
      className="track"
      onClick={onClick}
      aria-current={current ? "true" : undefined}
    >
      <span className="track-number" aria-hidden="true">
        {current && playing ? (
          <SolarIcon name="volume-loud" />
        ) : (
          String(number).padStart(2, "0")
        )}
      </span>
      <img src={track.art} alt="" />
      <span className="track-copy">
        <b>{track.title}</b>
        <small>{track.artist}</small>
      </span>
      <span className="track-genre">{track.genre}</span>
      <span className="track-end">
        <time>{formatDuration(track.duration)}</time>
        <SolarIcon name={current && playing ? "pause" : "play"} />
      </span>
    </button>
    {onQueue && <button className="track-queue" onClick={onQueue} aria-label={`${queued ? "Remove from queue" : "Add to queue"}: ${track.title}`} title={queued ? "Remove from queue" : "Add to queue"} aria-pressed={queued}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={queued ? "m5 12 4 4L19 6" : "M12 5v14M5 12h14"} /></svg>
    </button>}
    </div>
  );
}
