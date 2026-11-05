import SolarIcon from "./SolarIcon";

export function formatDuration(seconds) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export default function TrackRow({ track, number, current, playing, onClick }) {
  return (
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
  );
}
