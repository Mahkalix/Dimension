import SolarIcon from "./SolarIcon";
export default function PlayerBar({
  track,
  index,
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
  const format = (s) =>
    Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
  return (
    <aside className="paper-player" aria-label="Barre de lecture">
      <div className="paper-transport">
        <button aria-label="Morceau précédent" onClick={onPrevious}>
          <SolarIcon name="skip-previous" />
        </button>
        <button
          aria-label={playing ? "Pause" : "Lecture"}
          disabled={!ready}
          onClick={onToggle}
        >
          <SolarIcon name={playing ? "pause" : "play"} />
        </button>
        <button aria-label="Morceau suivant" onClick={onNext}>
          <SolarIcon name="skip-next" />
        </button>
      </div>
      <button className="paper-track" onClick={onOpen}>
        <img src={"/den-" + index + ".svg"} alt="" />
        <span>
          <b>{track.title}</b>
          <small>{track.artist}</small>
        </span>
      </button>
      <button aria-label="À suivre" onClick={onQueue}>
        <SolarIcon name="playlist" />
      </button>
      <details className="paper-volume">
        <summary aria-label="Régler le volume">
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
          <output>{Math.round(volume * 100)} %</output>
        </label>
      </details>
      {duration > 0 && (
        <div className="paper-progress">
          <time>{format(position)}</time>
          <input
            aria-label="Position de lecture"
            type="range"
            min="0"
            max={duration}
            value={Math.min(position, duration)}
            onChange={onSeek}
          />
          <time>{format(duration)}</time>
        </div>
      )}
    </aside>
  );
}
