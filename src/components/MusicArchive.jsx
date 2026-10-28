import React, { useEffect, useRef, useState } from 'react';
import tracks from '../data/datamusic.json';
import { LogButton } from './logbutton';

export const formatTime = (value) => Number.isFinite(value) && value >= 0
  ? `${Math.floor(value / 60).toString().padStart(2, '0')}:${Math.floor(value % 60).toString().padStart(2, '0')}` : '--:--';
const serial = (id) => String(id).padStart(3, '0');
const tabs = ['Now playing', 'The selection', 'Sessions', 'Archive'];
const sessions = [
  { title: 'Before the doors open.', subtitle: 'Unhurried sounds. A room finding its rhythm.', ids: [1, 3, 4, 8], tag: 'SIDE A / SLOW HOURS' },
  { title: 'One more before you go.', subtitle: 'For the conversations that outlast the evening.', ids: [2, 6, 7, 9, 10], tag: 'SIDE B / AFTER HOURS' },
];
function Icon({ name }) {
  const paths = {
    play: <path d="m9 5 11 7-11 7Z" fill="currentColor" stroke="none" />,
    pause: <><path d="M8 5v14M16 5v14" strokeWidth="4" /></>,
    next: <><path d="m5 5 10 7-10 7Z" fill="currentColor" stroke="none" /><path d="M19 5v14" /></>,
    previous: <><path d="m19 5-10 7 10 7Z" fill="currentColor" stroke="none" /><path d="M5 5v14" /></>,
    volume: <><path d="M4 10h4l5-4v12l-5-4H4Z" /><path d="M17 8c4 3 4 5 0 8" /></>,
    mute: <><path d="M4 10h4l5-4v12l-5-4H4Z" /><path d="m17 9 5 6m0-6-5 6" /></>,
    expand: <path d="M4 9V4h5m6 0h5v5m0 6v5h-5M9 20H4v-5" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{paths[name]}</svg>;
}
function Signal({ analyser, playing }) {
  const canvas = useRef(null);
  useEffect(() => {
    const el = canvas.current;
    const ctx = el.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const data = new Uint8Array(128);
    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, 600, 64);
      ctx.strokeStyle = '#c6382b'; ctx.lineWidth = 1.4;
      ctx.beginPath();
      if (analyser && playing && !reduced.matches) {
        analyser.getByteTimeDomainData(data);
        data.forEach((v, i) => { const x = i / 127 * 600; const y = v / 128 * 32; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      } else { ctx.moveTo(0, 32); ctx.lineTo(600, 32); }
      ctx.stroke();
      if (playing && !reduced.matches) frame = requestAnimationFrame(draw);
    };
    draw();
    reduced.addEventListener('change', draw);
    return () => { cancelAnimationFrame(frame); reduced.removeEventListener('change', draw); };
  }, [analyser, playing]);
  return <canvas ref={canvas} width="600" height="64" className="signal" aria-hidden="true" />;
}
function Sleeve({ track, small = false }) {
  return <div className={`sleeve ${small ? 'sleeve-small' : ''}`}>
    <img src="/images/dimension-studio.png" alt={small ? '' : 'Analog mixing console and reel-to-reel recorder in a quiet studio'} />
    {!small && <><div className="sleeve-top"><span>DIMENSION<br />SOUND ARCHIVE</span><span>VOL. 01<br />{serial(track.id)}</span></div>
    <div className="sleeve-label"><span>THE ROOM<br />AFTER HOURS.</span><span className="sleeve-mark">d/</span></div>
    <span className="sleeve-bottom">A PLACE HAS A SOUND. / SELECTED WITH INTENTION.</span></>}
  </div>;
}
export default function MusicArchive() {
  const audio = useRef(null);
  const graph = useRef(null);
  const [analyser, setAnalyser] = useState(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(.65);
  const [muted, setMuted] = useState(false);
  const [view, setView] = useState('Now playing');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [queue, setQueue] = useState(tracks.map(t => t.id));
  const immersive = useRef(null);
  const request = useRef(0);
  const track = tracks[index];

  useEffect(() => {
    const element = audio.current;
    return () => { request.current += 1; element.pause(); graph.current?.context.close().catch(() => {}); };
  }, []);
  const prepareSignal = () => {
    try {
      if (!graph.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const context = new AudioCtx();
        const source = context.createMediaElementSource(audio.current);
        const node = context.createAnalyser(); node.fftSize = 256;
        source.connect(node); node.connect(context.destination);
        graph.current = { context, node }; setAnalyser(node);
      }
      graph.current.context.resume().catch(() => {});
    } catch { /* Audio remains usable if visualization is unsupported. */ }
  };
  const playTrack = async (nextIndex = index) => {
    const id = ++request.current;
    const element = audio.current;
    setError(''); setLoading(true);
    prepareSignal();
    if (nextIndex !== index || !element.getAttribute('src')) {
      element.src = tracks[nextIndex].url;
      setIndex(nextIndex); setElapsed(0); setDuration(0);
    }
    try { await element.play(); }
    catch (err) { if (id === request.current && err.name !== 'AbortError') { setPlaying(false); setError('This recording could not be played. Try again or choose another track.'); } }
    finally { if (id === request.current) setLoading(false); }
  };
  const toggle = () => {
    if (playing || loading) { request.current += 1; audio.current.pause(); setPlaying(false); setLoading(false); }
    else playTrack();
  };
  const skip = (direction) => {
    const pos = queue.indexOf(track.id);
    const next = queue[(pos + direction + queue.length) % queue.length];
    playTrack(tracks.findIndex(t => t.id === next));
  };
  const choose = (item) => {
    if (item.id === track.id) toggle();
    else playTrack(tracks.findIndex(t => t.id === item.id));
  };
  const seek = (event) => {
    const position = Number(event.target.value);
    if (Number.isFinite(audio.current.duration)) { audio.current.currentTime = position; setElapsed(position); }
  };
  const changeVolume = (event) => {
    const value = Number(event.target.value); setVolume(value); setMuted(false);
    audio.current.volume = value; audio.current.muted = false;
  };
  const toggleMute = () => { audio.current.muted = !muted; setMuted(!muted); };
  const progress = duration ? elapsed / duration * 100 : 0;
  const transport = (large = false) => <div className={`transport ${large ? 'transport-large' : ''}`}>
    <button aria-label="Previous track" onClick={() => skip(-1)}><Icon name="previous" /></button>
    <button className="play-control" aria-label={playing || loading ? 'Pause playback' : 'Play recording'} onClick={toggle}><Icon name={playing || loading ? 'pause' : 'play'} /></button>
    <button aria-label="Next track" onClick={() => skip(1)}><Icon name="next" /></button>
  </div>;
  const rows = (items) => <div className="track-list">{items.map(item => <button key={item.id} className={`track-row ${track.id === item.id ? 'selected' : ''}`} onClick={() => choose(item)} aria-label={`${track.id === item.id && playing ? 'Pause' : 'Play'} ${item.title}`}>
    <span className="track-no">{String(item.id).padStart(2, '0')}</span><span className="track-name">{item.title}<small>DIMENSION SELECTS / VOL. 01</small></span>
    <span className="track-format">MP3</span><span className="row-play"><Icon name={item.id === track.id && playing ? 'pause' : 'play'} /></span>
  </button>)}</div>;
  return <div className={`dimension ${playing ? 'is-playing' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <audio ref={audio} preload="metadata" src={tracks[0].url}
      onLoadedMetadata={() => { const el = audio.current; setDuration(Number.isFinite(el.duration) ? el.duration : 0); el.volume = volume; }}
      onTimeUpdate={() => setElapsed(audio.current.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onEnded={() => skip(1)} onWaiting={() => setLoading(true)} onPlaying={() => setLoading(false)}
      onError={() => { setError('This recording is unavailable. Choose another track or retry playback.'); setPlaying(false); setLoading(false); }} />
    <header className="masthead"><a href="#main" className="wordmark" aria-label="Dimension home">DIMENSION<span className="brand-dot">®</span></a>
      <div className="masthead-note">A PLACE HAS A SOUND.<br /><span>INDEPENDENT SOUND CULTURE</span></div><LogButton /></header>
    <nav className="main-nav" aria-label="Music archive"><div>{tabs.map((tab,i) => <button key={tab} aria-current={view === tab ? 'page' : undefined} onClick={() => setView(tab)}><sup>0{i+1}</sup>{tab}<span className="nav-indicator" /></button>)}</div><span className="nav-note">EST. 2023 / ALWAYS LISTENING</span></nav>
    <main id="main">
      <div className="edition-line"><span>THE SOUND OF DIMENSION</span><span>VOLUME 01 — THE SLOW HOURS</span><span className="status"><i />{playing ? 'PLAYING' : 'READY TO LISTEN'}</span></div>
      {view === 'Now playing' ? <>
        <section className="listening-room" aria-label="Now playing">
          <div className="artwork-column"><div className="artwork-head"><span>RECORD {serial(track.id)}</span><button className="text-button" onClick={() => immersive.current.showModal()}>IMMERSIVE VIEW <Icon name="expand" /></button></div><Sleeve track={track} /><div className="artwork-foot"><span>FROM THE DIMENSION COLLECTION</span><span>↗ SOUND, NOT NOISE.</span></div></div>
          <div className="record-column"><div className="record-kicker"><span className="record-cross">✳</span><span>SELECTED WITH INTENTION.<br />PLAYED WITHOUT HURRY.</span></div>
            <div className="record-heading"><span className="eyebrow">NOW ON THE TURNTABLE / {serial(track.id)}</span><h1>{track.title}<span>.</span></h1><p>From the house collection</p></div>
            <div className="record-tags"><span>LO-FI</span><span>INSTRUMENTAL</span><span>VOL. 01</span></div>
            <div className="signal-box"><div><span>OUTPUT SIGNAL</span><span>{playing ? 'ACTIVE' : 'STANDBY'} / CH. 01</span></div><Signal analyser={analyser} playing={playing} /></div>
            <div className="seek-wrapper"><input aria-label="Playback position" type="range" min="0" max={duration || 1} step=".1" value={Math.min(elapsed,duration || 0)} disabled={!duration} onChange={seek} style={{'--progress': `${progress}%`}} /><div className="times"><span>{formatTime(elapsed)}</span><span>{formatTime(duration)}</span></div></div>
            <div className="hero-controls">{transport(true)}<div className="volume-control"><button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}><Icon name={muted || volume === 0 ? 'mute' : 'volume'} /></button><input aria-label="Volume" type="range" min="0" max="1" step=".01" value={muted ? 0 : volume} onChange={changeVolume} /></div></div>
            <div className="record-note"><span>LISTENING NOTE / 01</span><p>Some sounds belong to a place.<br />Others take you back there.</p></div>
          </div>
        </section>
        <section className="selection-preview"><div className="section-heading"><div><span className="eyebrow">THE NEXT CHAPTER</span><h2>Stay a little longer.</h2></div><button className="text-button" onClick={() => setView('The selection')}>EXPLORE THE SELECTION <Icon name="arrow" /></button></div>{rows(tracks.slice(0,4))}</section>
      </> : view === 'Sessions' ? <section className="catalog"><div className="section-heading"><div><span className="eyebrow">TWO SIDES OF THE SAME ROOM</span><h1>Listening sessions<span>.</span></h1></div><span className="eyebrow">CURATED SEQUENCES / 02</span></div><div className="session-grid">{sessions.map((session,i) => <article className={`session session-${i}`} key={session.title}><span className="eyebrow">{session.tag}</span><span className="session-number">0{i+1}</span><h2>{session.title}</h2><p>{session.subtitle}</p><button onClick={() => { setQueue(session.ids); playTrack(tracks.findIndex(t => t.id === session.ids[0])); setView('Now playing'); }}>PLAY SESSION <Icon name="arrow" /></button><span className="eyebrow">{session.ids.length} RECORDINGS / CONTINUOUS PLAY</span></article>)}</div></section>
      : <section className="catalog"><div className="section-heading"><div><span className="eyebrow">{view === 'Archive' ? 'EVERY SOUND HAS A PLACE' : 'COLLECTED, NOT GENERATED'}</span><h1>{view === 'Archive' ? 'The sound archive' : 'The selection'}<span>.</span></h1></div><span className="eyebrow">{tracks.length} RECORDINGS / VOL. 01</span></div><div className="catalog-toolbar"><p>{view === 'Archive' ? 'An index of the sounds that make this place.' : 'A small collection for long listening. Find your own rhythm.'}</p><label className="search"><span>FIND A RECORD</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search the collection…" /></label></div>{rows(tracks.filter(t => t.title.toLowerCase().includes(query.toLowerCase())))}{!tracks.some(t => t.title.toLowerCase().includes(query.toLowerCase())) && <p role="status" className="empty-state">No recording matches “{query}”. Try another title.</p>}<button className="text-button reset-queue" onClick={() => {setQueue(tracks.map(t=>t.id));playTrack(0);}}>PLAY THE FULL COLLECTION <Icon name="arrow" /></button></section>}
      {error && <p className="playback-error" role="alert">{error} <button onClick={() => playTrack()}>Retry</button></p>}
      <footer className="editorial-footer"><span className="footer-brand">DIMENSION</span><p>A place has a sound.<br />This is ours.</p><span>© {new Date().getFullYear()} DIMENSION<br />CURATED SOUND. OPEN EARS.</span></footer>
    </main>
    <aside className="player-dock" aria-label="Persistent player"><div className="dock-track"><Sleeve track={track} small /><div><strong>{track.title}</strong><span>DIMENSION SELECTS / {serial(track.id)}</span></div></div>{transport()}<div className="dock-progress"><span>{formatTime(elapsed)}</span><input aria-label="Dock playback position" type="range" min="0" max={duration || 1} step=".1" value={Math.min(elapsed,duration || 0)} disabled={!duration} onChange={seek} style={{'--progress': `${progress}%`}} /><span>{formatTime(duration)}</span></div><button className="dock-expand" aria-label="Open immersive player" onClick={() => immersive.current.showModal()}><Icon name="expand" /></button></aside>
    <dialog ref={immersive} className="immersive" aria-label="Immersive listening room"><button className="immersive-close" aria-label="Close immersive player" onClick={() => immersive.current.close()}><Icon name="close" /></button><span className="eyebrow">DIMENSION / RECORD {serial(track.id)}</span><Sleeve track={track} /><h2>{track.title}</h2><span className="eyebrow">{formatTime(elapsed)} / {formatTime(duration)}</span>{transport(true)}</dialog>
  </div>;
}

