import { useRef } from "react";
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
  const previousVolume = useRef(0.35);
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
        <div className="paper-volume">
          <button
            aria-label={volume === 0 ? "Unmute" : "Mute"}
            aria-pressed={volume === 0}
            onClick={() => {
              if (volume > 0) previousVolume.current = volume;
              onVolumeChange({
                target: { value: volume === 0 ? previousVolume.current : 0 },
              });
            }}
          >
            <SolarIcon name="volume-loud" />
            {volume === 0 && <span className="mute-slash" aria-hidden="true" />}
          </button>
          <input
            type="range"
            aria-label="Volume"
            aria-valuetext={Math.round(volume * 100) + "%"}
            min="0"
            max="1"
            step=".01"
            value={volume}
            style={{ "--volume-fill": volume * 100 + "%" }}
            onChange={onVolumeChange}
          />
        </div>
      </div>
    </aside>
  );
}
