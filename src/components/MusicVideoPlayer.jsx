import React, { useEffect, useRef, useState } from 'react';
let apiPromise;
export function loadYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) apiPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timeout = setTimeout(() => { script.remove(); reject(new Error('Player timeout')); }, 20000);
    window.onYouTubeIframeAPIReady = () => { clearTimeout(timeout); resolve(window.YT); };
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => { clearTimeout(timeout); script.remove(); reject(new Error('Player unavailable')); };
    document.head.appendChild(script);
  }).catch(error => { apiPromise = undefined; throw error; });
  return apiPromise;
}
export default function MusicVideoPlayer({ track, volume, onVolumeChange, onClose, command = 0, onPlayingChange }) {
  const host = useRef(null);
  const player = useRef(null);
  const latestVolume = useRef(volume);
  const lastCommand = useRef(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  latestVolume.current = volume;
  useEffect(() => {
    let cancelled = false;
    const container = host.current;
    loadYouTubeAPI().then(YT => {
      if (cancelled) return;
      const mount = document.createElement('div');
      container.appendChild(mount);
      player.current = new YT.Player(mount, {
        width: '100%', height: '100%', videoId: track.videoId,
        playerVars: { playsinline: 1, controls: 1, origin: window.location.origin, rel: 0 },
        events: {
          onReady: event => {
            if (cancelled) return;
            event.target.setVolume(Math.round(latestVolume.current * 100));
            event.target.getIframe()?.setAttribute('title', `${track.title} — ${track.artist}`);
            setReady(true);
          },
          onStateChange: event => { if (!cancelled) { setPlaying(event.data === 1); onPlayingChange?.(event.data === 1); } },
          onError: () => { if (!cancelled) { setError(true); setPlaying(false); onPlayingChange?.(false); } }
        }
      });
    }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; player.current?.destroy(); player.current = null; container.replaceChildren(); };
  }, [track.videoId, track.title, track.artist, onPlayingChange]);
  useEffect(() => { if (ready) { player.current?.unMute(); player.current?.setVolume(Math.round(volume * 100)); } }, [volume, ready]);
  useEffect(() => {
    if (!command || command === lastCommand.current || !ready || error || !player.current) return;
    lastCommand.current = command;
    if (playing) player.current.pauseVideo();
    else player.current.playVideo();
  }, [command, ready, error, playing]);
  return <aside className="video-dock" aria-label="Lecteur musical">
    <div className="video-frame" ref={host} />
    <div className="video-controls"><button className="video-close" aria-label="Fermer le lecteur et revenir au silence" onClick={onClose}>×</button>
      <strong>{track.title}</strong><span className="video-artist">{track.artist}</span>
      <button className="video-toggle" disabled={!ready || error} onClick={() => playing ? player.current.pauseVideo() : player.current.playVideo()}>{playing ? 'Pause' : 'Lecture'}</button>
      <label className="video-volume">Volume<input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={onVolumeChange} /><output>{Math.round(volume * 100)} %</output></label>
      {error && <p role="alert">Ce morceau ne peut pas être lu ici.</p>}
      <a href={`https://www.youtube.com/watch?v=${track.videoId}`} target="_blank" rel="noreferrer">YouTube ↗</a>
    </div>
  </aside>;
}
