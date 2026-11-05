import { useEffect, useRef } from "react";
import SolarIcon from "./SolarIcon";
import { formatDuration } from "./TrackRow";
import tracks from "../data/library";

export default function TrackPreview({
  track,
  context,
  queued,
  onClose,
  closeRef,
  onQueue,
  onPrevious,
  onNext,
  onRelated,
  notice,
  error,
}) {
  const scroll = useRef(null);
  const touch = useRef(null);
  const related = tracks
    .map((item, index) => ({
      item,
      index,
      score:
        Number(item.genre === track.genre) * 2 +
        Number(item.artist === track.artist),
    }))
    .filter(({ item }) => item.id !== track.id)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  useEffect(() => {
    scroll.current?.scrollTo(0, 0);
  }, [track.id]);

  return (
    <>
      <div className="preview-topbar">
        <span className="preview-context">
          <SolarIcon name="playlist" />
          {context}
        </span>
        <button
          className="return"
          ref={closeRef}
          aria-label="Back to tracks"
          title="Close preview"
          onClick={onClose}
        >
          <SolarIcon name="close-circle" />
        </button>
      </div>
      <div className="preview-scroll" ref={scroll}>
        <figure className="preview-feature">
          <div
            className="preview-artwork"
            onTouchStart={(e) => {
              touch.current = [e.touches[0].clientX, e.touches[0].clientY];
            }}
            onTouchCancel={() => {
              touch.current = null;
            }}
            onTouchEnd={(e) => {
              if (!touch.current) return;
              const dx = e.changedTouches[0].clientX - touch.current[0];
              const dy = e.changedTouches[0].clientY - touch.current[1];
              touch.current = null;
              if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
                dx > 0 ? onPrevious() : onNext();
            }}
          >
            <img src={track.visual} alt="" />
            <span className="preview-badge">
              <SolarIcon name="volume-loud" />
              {track.genre} · {formatDuration(track.duration)}
            </span>
          </div>
          <figcaption className="preview-title">
            <div aria-live="polite">
              <h2>{track.title}</h2>
              <p>{track.artist}</p>
            </div>
            <button
              className="preview-add"
              onClick={onQueue}
              aria-label={queued ? "In queue" : "Add to queue"}
              title={queued ? "Already in queue" : "Add to queue"}
              disabled={queued}
            >
              {queued ? (
                <span aria-hidden="true">✓</span>
              ) : (
                <SolarIcon name="playlist" />
              )}
            </button>
          </figcaption>
        </figure>

        <section className="preview-credits" aria-label="About this track">
          <h3>On the record</h3>
          <strong>{track.artist}</strong>
          <dl>
            <div>
              <dt>Genre</dt>
              <dd>{track.genre}</dd>
            </div>
            <div>
              <dt>Length</dt>
              <dd>{formatDuration(track.duration)}</dd>
            </div>
          </dl>
          <div className="preview-sources">
            <a href={track.sourceUrl} target="_blank" rel="noreferrer">
              {track.sourceName}
              <SolarIcon name="arrow-right" />
            </a>
            <a href={track.licenseUrl} target="_blank" rel="noreferrer">
              {track.license}
            </a>
          </div>
        </section>

        <section className="preview-related" aria-label="Related tracks">
          <h3>Keep listening</h3>
          <div>
            {related.map(({ item, index }) => (
              <button
                key={item.id}
                aria-label={`Play ${item.title}`}
                onClick={() => {
                  onRelated(index);
                  closeRef.current?.focus({ preventScroll: true });
                }}
              >
                <span className="related-artwork">
                  <img src={item.visual} alt="" />
                  <span className="related-play">
                    <SolarIcon name="play" />
                  </span>
                </span>
                <b>{item.title}</b>
                <small>{item.artist}</small>
              </button>
            ))}
          </div>
        </section>

        <span className="sr-only" role="status">
          {notice}
        </span>
        {error && (
          <p className="preview-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </>
  );
}
