import SolarIcon from "./SolarIcon";
import { formatDuration } from "./TrackRow";
export default function PlayerBar({
  track,
  playing = false,
  ready = true,
  onToggle,
  onPrevious,
  onNext,
  onOpen,
  onQueue,
  volume,
  onVolumeChange,
  position = 0,
  duration = 0,
  onSeek,
}) {
  const total = duration || track.duration;
  return (
    <aside className="paper-player" aria-label="Music player">
      <button className="paper-track" onClick={onOpen}>
        <img src={track.art} alt="" />
        <span>
          <b>{track.title}</b>
          <small>{track.artist}</small>
        </span>
      </button>
      <div className="paper-center">
        <div className="paper-transport">
          <button aria-label="Previous track" onClick={onPrevious}>
            <SolarIcon name="skip-previous" />
          </button>
          <button
            aria-label={playing ? "Pause" : "Play"}
            disabled={!ready}
            onClick={onToggle}
          >
            <SolarIcon name={playing ? "pause" : "play"} />
          </button>
          <button aria-label="Next track" onClick={onNext}>
            <SolarIcon name="skip-next" />
          </button>
        </div>
        <div className="paper-progress">
          <time>{formatDuration(position)}</time>
          <input
            aria-label="Playback position"
            type="range"
            min="0"
            max={total}
            value={Math.min(position, total)}
            disabled={!duration}
            onChange={onSeek}
          />
          <time>{formatDuration(total)}</time>
        </div>
      </div>
      <div className="paper-tools">
        <button aria-label="Up next" onClick={onQueue}>
          <SolarIcon name="playlist" />
        </button>
        <details className="paper-volume">
          <summary aria-label="Adjust volume">
            <SolarIcon name="volume-loud" />
          </summary>
          <label>
            Volume
            <input
              type="range"
              aria-label="Volume"
              min="0"
              max="1"
              step=".01"
              value={volume}
              onChange={onVolumeChange}
            />
            <output>{Math.round(volume * 100)}%</output>
          </label>
        </details>
      </div>
    </aside>
  );
}
