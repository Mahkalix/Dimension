import React, { useEffect, useRef, useState } from 'react';
import tracks from '../data/datamusic.json';
import { LogButton } from './logbutton';
import headphones from '../assets/png/men.png';
export const formatTime = value => Number.isFinite(value) && value >= 0 ? `${Math.floor(value / 60).toString().padStart(2, '0')}:${Math.floor(value % 60).toString().padStart(2, '0')}` : '--:--';
function Icon({
  name
}) {
  const paths = {
    play: <path d="m9 5 11 7-11 7Z" fill="currentColor" stroke="none" />,
    pause: <><path d="M8 5v14M16 5v14" strokeWidth="4" /></>,
    next: <><path d="m5 5 10 7-10 7Z" fill="currentColor" stroke="none" /><path d="M19 5v14" /></>,
    previous: <><path d="m19 5-10 7 10 7Z" fill="currentColor" stroke="none" /><path d="M5 5v14" /></>,
    volume: <><path d="M4 10h4l5-4v12l-5-4H4Z" /><path d="M17 8c4 3 4 5 0 8" /></>,
    mute: <><path d="M4 10h4l5-4v12l-5-4H4Z" /><path d="m17 9 5 6m0-6-5 6" /></>,
    expand: <path d="M4 9V4h5m6 0h5v5m0 6v5h-5M9 20H4v-5" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{paths[name]}</svg>;
}
function Sleeve({
  track
}) {
  return <img className="cover" src={track.gif} alt="" />;
}
export default function MusicArchive() {
  const audio = useRef(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(.65);
  const [muted, setMuted] = useState(false);
  const [view, setView] = useState('all');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const queue = tracks.map(t => t.id);
  const immersive = useRef(null);
  const request = useRef(0);
  const track = tracks[index];
  useEffect(() => {
    const element = audio.current;
    return () => {
      request.current += 1;
      element.pause();
    };
  }, []);
  const playTrack = async (nextIndex = index) => {
    const id = ++request.current;
    const element = audio.current;
    setError('');
    setLoading(true);
    if (nextIndex !== index || !element.getAttribute('src')) {
      element.src = tracks[nextIndex].url;
      setIndex(nextIndex);
      setElapsed(0);
      setDuration(0);
    }
    try {
      await element.play();
    } catch (err) {
      if (id === request.current && err.name !== 'AbortError') {
        setPlaying(false);
        setError('This recording could not be played. Try again or choose another track.');
      }
    } finally {
      if (id === request.current) setLoading(false);
    }
  };
  const toggle = () => {
    if (playing || loading) {
      request.current += 1;
      audio.current.pause();
      setPlaying(false);
      setLoading(false);
    } else playTrack();
  };
  const skip = direction => {
    const pos = queue.indexOf(track.id);
    const next = queue[(pos + direction + queue.length) % queue.length];
    playTrack(tracks.findIndex(t => t.id === next));
  };
  const choose = item => {
    if (item.id === track.id) toggle();else playTrack(tracks.findIndex(t => t.id === item.id));
  };
  const seek = event => {
    const position = Number(event.target.value);
    if (Number.isFinite(audio.current.duration)) {
      audio.current.currentTime = position;
      setElapsed(position);
    }
  };
  const changeVolume = event => {
    const value = Number(event.target.value);
    setVolume(value);
    setMuted(false);
    audio.current.volume = value;
    audio.current.muted = false;
  };
  const toggleMute = () => {
    audio.current.muted = !muted;
    setMuted(!muted);
  };
  const progress = duration ? elapsed / duration * 100 : 0;
  const transport = (large = false) => <div className={`transport ${large ? 'transport-large' : ''}`}>
    <button aria-label="Previous track" onClick={() => skip(-1)}><Icon name="previous" /></button>
    <button className="play-control" aria-label={playing || loading ? 'Pause playback' : 'Play recording'} onClick={toggle}><Icon name={playing || loading ? 'pause' : 'play'} /></button>
    <button aria-label="Next track" onClick={() => skip(1)}><Icon name="next" /></button>
  </div>;
  const filtered = tracks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
  return <div className={`dimension ${playing ? 'is-playing' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <audio ref={audio} preload="metadata" src={tracks[0].url} onLoadedMetadata={() => {
      const el = audio.current;
      setDuration(Number.isFinite(el.duration) ? el.duration : 0);
      el.volume = volume;
    }} onTimeUpdate={() => setElapsed(audio.current.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => skip(1)} onWaiting={() => setLoading(true)} onPlaying={() => setLoading(false)} onError={() => {
      setError('This recording is unavailable. Choose another track or retry playback.');
      setPlaying(false);
      setLoading(false);
    }} />
    <header className="masthead"><a href="#main" className="wordmark" aria-label="Dimension home"><img className="brand-icon" src="/brand/dimension-mark.svg" alt="" />dimension</a><label className="search"><span aria-hidden="true">⌕</span><input type="search" aria-label="Search music" value={query} onChange={e => setQuery(e.target.value)} placeholder="What do you want to listen to?" /></label><LogButton /></header>
    <aside className="sidebar"><nav aria-label="Music library"><p className="nav-label">YOUR SPACE</p><button className={view === 'all' ? 'active' : ''} aria-current={view === 'all' ? 'page' : undefined} onClick={() => {
          setView('all');
          setQuery('');
        }}><span aria-hidden="true">⌂</span>Home</button><a href="#collections"><span aria-hidden="true">▤</span>Your library</a><div className="sidebar-divider" /><p className="nav-label">YOUR COLLECTIONS</p>{['girl', 'boy'].map(category => <button key={category} className={view === category ? 'active collection-link' : 'collection-link'} aria-current={view === category ? 'page' : undefined} onClick={() => setView(category)}><img src={tracks.find(t => t.categorie === category).gif} alt="" /><span>Lo-fi {category === 'girl' ? 'Girl' : 'Boy'}<small>Dimension collection</small></span></button>)}</nav><div className="sidebar-note"><span className="tiny-star">✳</span><strong>A little less noise.<br />A little more you.</strong><p>Your daily dose of lo-fi.</p></div></aside>
    <main id="main">
      <div className="filter-bar" aria-label="Filter collections">{[['all', 'All'], ['girl', 'Lo-fi Girl'], ['boy', 'Lo-fi Boy']].map(([value, label]) => <button key={value} aria-pressed={view === value} onClick={() => setView(value)}>{label}</button>)}</div>
      {!query && view === 'all' && <section className="welcome"><div className="welcome-copy"><span className="eyebrow">THE SOUND OF DIMENSION</span><h1>Find your<br /><em>own dimension.</em></h1><p>Slow down. Tune in. A soundtrack for your everyday escape.</p><button className="primary-button" onClick={toggle}><Icon name={playing || loading ? 'pause' : 'play'} />{playing || loading ? 'Pause listening' : 'Start listening'}</button><span className="hero-caption">10 tracks. Endless headspace.</span></div><img className="hero-person" src={headphones} alt="Person enjoying music through headphones" /><span className="hero-sticker" aria-hidden="true">JUST<br />PRESS PLAY ↗</span></section>}
      <div id="collections">{['girl', 'boy'].filter(category => view === 'all' || category === view).map(category => <section className="collection-section" key={category} aria-labelledby={category + '-title'}><div className="section-heading"><div><h2 id={category + '-title'}>Lo-fi {category === 'girl' ? 'Girl' : 'Boy'}<span>↗</span></h2><p>{category === 'girl' ? 'Soft melodies for a moment of calm.' : 'Mellow beats. Nothing else on your mind.'}</p></div><span className="collection-count">{filtered.filter(t => t.categorie === category).length} tracks</span></div><div className="music-grid">{filtered.filter(t => t.categorie === category).map(item => <button key={item.id} className={`music-card ${item.id === track.id ? 'selected' : ''}`} aria-label={`${item.id === track.id && playing ? 'Pause' : 'Play'} ${item.title}`} onClick={() => choose(item)}><span className="card-art"><Sleeve track={item} /><span className="card-play"><Icon name={item.id === track.id && playing ? 'pause' : 'play'} /></span>{item.id === track.id && playing && <span className="playing-label">Now playing</span>}</span><strong>{item.title}</strong><span className="card-subtitle">Lo-fi {category === 'girl' ? 'Girl' : 'Boy'} · Dimension</span></button>)}</div></section>)}</div>
      {!filtered.some(t => view === 'all' || t.categorie === view) && <p role="status" className="empty-state">No tracks found. Try another title or collection.</p>}
      {error && <p className="playback-error" role="alert">{error} <button onClick={() => playTrack()}>Retry</button></p>}
      <footer><a className="wordmark" href="#main">dimension</a><span>Made for your moments.</span><small>© {new Date().getFullYear()} Maxence Badin-Léger</small></footer>
    </main>
    <aside className="player-dock" aria-label="Persistent player"><div className="dock-track"><Sleeve track={track} /><div><strong aria-live="polite">{track.title}</strong><span>Lo-fi {track.categorie === 'girl' ? 'Girl' : 'Boy'} · Dimension</span></div></div><div className="dock-center">{transport()}<div className="dock-progress"><span>{formatTime(elapsed)}</span><input aria-label="Playback position" type="range" min="0" max={duration || 1} step=".1" value={Math.min(elapsed, duration || 0)} disabled={!duration} onChange={seek} style={{
            '--progress': `${progress}%`
          }} /><span>{formatTime(duration)}</span></div></div><div className="dock-tools"><button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}><Icon name={muted || volume === 0 ? 'mute' : 'volume'} /></button><input aria-label="Volume" type="range" min="0" max="1" step=".01" value={muted ? 0 : volume} onChange={changeVolume} /><button aria-label="Open immersive player" onClick={() => immersive.current.showModal()}><Icon name="expand" /></button></div></aside>
    <dialog ref={immersive} className="immersive" aria-label="Immersive listening room"><button className="immersive-close" aria-label="Close immersive player" onClick={() => immersive.current.close()}><Icon name="close" /></button><span className="eyebrow">DIMENSION / NOW PLAYING</span><Sleeve track={track} /><h2>{track.title}</h2><span>{formatTime(elapsed)} / {formatTime(duration)}</span>{transport(true)}</dialog>
  </div>;
}
