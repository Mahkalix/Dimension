import PlayerBar from "./PlayerBar";
import React, { useEffect, useRef, useState } from "react";
let apiPromise;
export function loadYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise)
    apiPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const timeout = setTimeout(() => {
        script.remove();
        reject(new Error("Player timeout"));
      }, 20000);
      window.onYouTubeIframeAPIReady = () => {
        clearTimeout(timeout);
        resolve(window.YT);
      };
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        reject(new Error("Player unavailable"));
      };
      document.head.appendChild(script);
    }).catch((error) => {
      apiPromise = undefined;
      throw error;
    });
  return apiPromise;
}
export default function MusicVideoPlayer({
  track,
  volume,
  onVolumeChange,
  onClose,
  command = 0,
  onPlayingChange,
  index,
  onPrevious,
  onNext,
  onOpen,
  onQueue,
}) {
  const host = useRef(null);
  const player = useRef(null);
  const latestVolume = useRef(volume);
  const lastCommand = useRef(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [time, setTime] = useState({ position: 0, duration: 0 });
  useEffect(() => {
    if (!ready) return;
    const timer = setInterval(() => {
      const p = player.current;
      setTime({
        position: p?.getCurrentTime?.() || 0,
        duration: p?.getDuration?.() || 0,
      });
    }, 500);
    return () => clearInterval(timer);
  }, [ready]);
  latestVolume.current = volume;
  useEffect(() => {
    let cancelled = false;
    const container = host.current;
    loadYouTubeAPI()
      .then((YT) => {
        if (cancelled) return;
        const mount = document.createElement("div");
        container.appendChild(mount);
        player.current = new YT.Player(mount, {
          width: "100%",
          height: "100%",
          videoId: track.videoId,
          playerVars: {
            playsinline: 1,
            controls: 1,
            origin: window.location.origin,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              if (cancelled) return;
              event.target.setVolume(Math.round(latestVolume.current * 100));
              event.target
                .getIframe()
                ?.setAttribute("title", `${track.title} — ${track.artist}`);
              setReady(true);
            },
            onStateChange: (event) => {
              if (!cancelled) {
                setPlaying(event.data === 1);
                onPlayingChange?.(event.data === 1);
              }
            },
            onError: () => {
              if (!cancelled) {
                setError(true);
                setPlaying(false);
                onPlayingChange?.(false);
              }
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
      player.current?.destroy();
      player.current = null;
      container.replaceChildren();
    };
  }, [track.videoId, track.title, track.artist, onPlayingChange]);
  useEffect(() => {
    if (ready) {
      player.current?.unMute();
      player.current?.setVolume(Math.round(volume * 100));
    }
  }, [volume, ready]);
  useEffect(() => {
    if (
      !command ||
      command === lastCommand.current ||
      !ready ||
      error ||
      !player.current
    )
      return;
    lastCommand.current = command;
    if (playing) player.current.pauseVideo();
    else player.current.playVideo();
  }, [command, ready, error, playing]);
  return (
    <>
      <PlayerBar
        track={track}
        index={index}
        playing={playing}
        ready={ready && !error}
        onToggle={() =>
          playing ? player.current.pauseVideo() : player.current.playVideo()
        }
        onPrevious={onPrevious}
        onNext={onNext}
        onOpen={onOpen}
        onQueue={onQueue}
        volume={volume}
        onVolumeChange={onVolumeChange}
        position={time.position}
        duration={time.duration}
        onSeek={(e) => player.current?.seekTo(Number(e.target.value), true)}
      />
      <aside className="source-player" aria-label="Lecteur musical">
        <div className="video-frame" ref={host} />
        <button onClick={onClose}>Arrêter la lecture</button>
        {error && (
          <p role="alert">
            Lecture indisponible.{" "}
            <a
              href={"https://www.youtube.com/watch?v=" + track.videoId}
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir sur YouTube
            </a>
          </p>
        )}
      </aside>
    </>
  );
}
