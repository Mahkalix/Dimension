import React, { useEffect, useRef, useState } from 'react';
import tracks from '../data/datamusic.json';
import { LogButton } from './logbutton';
import afterHours from '../data/afterhours.json';
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
  const [collection, setCollection] = useState('after-hours');
  const [external, setExternal] = useState(null);
  const [hasLocalSelection, setHasLocalSelection] = useState(false);
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
    setExternal(null);
    setHasLocalSelection(true);
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
  const silence = () => {
    request.current += 1;
    audio.current.pause();
    setPlaying(false);
    setLoading(false);
    setExternal(null);
    setHasLocalSelection(false);
  };
  const selectExternal = item => {
    request.current += 1;
    audio.current.pause();
    setPlaying(false);
    setLoading(false);
    setError('');
    setHasLocalSelection(false);
    setExternal(item);
  };
  const catalogue = collection === 'after-hours' ? afterHours : tracks;
  const progress = duration ? elapsed / duration * 100 : 0;
  const transport = (large = false) => <div className={`transport ${large ? 'transport-large' : ''}`}>
    <button aria-label="Previous track" onClick={() => skip(-1)}><Icon name="previous" /></button>
    <button className="play-control" aria-label={playing || loading ? 'Pause playback' : 'Play recording'} onClick={toggle}><Icon name={playing || loading ? 'pause' : 'play'} /></button>
    <button aria-label="Next track" onClick={() => skip(1)}><Icon name="next" /></button>
  </div>;
  const filtered = catalogue.filter(t => `${t.title} ${t.artist || ''}`.toLowerCase().includes(query.toLowerCase()));
  return <div className={`dimension ${playing ? 'is-playing' : ''} ${external ? 'has-external-player' : ''}`}>
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
    <header className="masthead"><a href="#main" className="wordmark" aria-label="Dimension home"><img className="brand-icon" src="/brand/dimension-bear.svg" alt="" />dimension</a><label className="search"><input type="search" aria-label="Search music" value={query} onChange={e => setQuery(e.target.value)} placeholder="Un titre, un artiste…" /></label><LogButton /></header>
    <aside className="sidebar"><nav aria-label="Music library"><p className="nav-label">ÉCOUTER</p><button className={view === 'all' ? 'active' : ''} aria-current={view === 'all' ? 'page' : undefined} onClick={() => {
          setView('all');
          setQuery('');
        }}>La sélection</button><a href="#collections">Les collections</a><div className="sidebar-divider" /><p className="nav-label">SÉLECTIONS</p>{['girl', 'boy'].map(category => <button key={category} className={view === category ? 'active collection-link' : 'collection-link'} aria-current={view === category ? 'page' : undefined} onClick={() => setView(category)}><span className="side-number">{category === 'girl' ? '01' : '02'}</span><span>{category === 'girl' ? 'Silence' : 'Retour'}</span></button>)}</nav><div className="sidebar-note"><span className="quiet-line" /><button className="silence-button" onClick={silence}>Silence <span aria-hidden="true">—</span></button></div></aside>
    <main id="main">
      <div className="collection-toolbar"><div className="filter-bar" aria-label="Filter collections">{[['all', 'Tout'], ['girl', 'Silence'], ['boy', 'Retour']].map(([value, label]) => <button key={value} aria-pressed={view === value} onClick={() => setView(value)}>{label}</button>)}</div><div className="collection-switch" aria-label="Choisir la sélection"><button aria-pressed={collection === 'after-hours'} onClick={() => {
            setCollection('after-hours');
            setQuery('');
          }}>Après le service</button><button aria-pressed={collection === 'original'} onClick={() => {
            setCollection('original');
            setQuery('');
          }}>Lo-fi original</button></div></div>
      {!query && view === 'all' && <section className="welcome"><div className="welcome-copy"><span className="eyebrow">DIMENSION — SÉLECTION 01</span><h1>Après<br /><em>le bruit.</em></h1><button className="primary-button" onClick={() => collection === 'after-hours' ? selectExternal(afterHours[0]) : toggle()}><Icon name="play" />{collection === 'after-hours' ? 'Écouter Together' : playing ? 'Mettre en pause' : 'Écouter'}</button></div><figure className="quiet-photo"><img src="/images/dimension-after-hours.webp" alt="Une cuisine vide après fermeture, un verre et un torchon sur le plan de travail." /></figure></section>}
      <div id="collections">{['girl', 'boy'].filter(category => view === 'all' || category === view).map(category => <section className="collection-section" key={category} aria-labelledby={category + '-title'}><div className="section-heading"><div><span className="section-index">{category === 'girl' ? '01' : '02'} / {collection === 'after-hours' ? 'APRÈS LE SERVICE' : 'COLLECTION ORIGINALE'}</span><h2 id={category + '-title'}>{category === 'girl' ? 'Silence' : 'Retour'}</h2></div><span className="collection-count">{filtered.filter(t => t.categorie === category).length} morceaux</span></div><div className={`music-grid ${collection === 'after-hours' ? 'curated-grid' : ''}`}>{filtered.filter(t => t.categorie === category).map(item => item.spotifyId ? <button key={item.id} className={`music-card curated-card ${external?.id === item.id ? 'selected' : ''}`} aria-label={`Écouter ${item.title} — ${item.artist}`} onClick={() => selectExternal(item)}><span className={`record-sleeve sleeve-${item.id}`}><span className="sleeve-meta">{item.artist}<span>{item.year}</span></span><span className="sleeve-title">{item.title}</span><span className="sleeve-rule" /><span className="card-play"><Icon name="play" /></span></span><strong>{item.title}</strong><span className="card-subtitle">{item.artist}</span></button> : <button key={item.id} className={`music-card ${!external && hasLocalSelection && item.id === track.id ? 'selected' : ''}`} aria-label={`${item.id === track.id && playing ? 'Pause' : 'Play'} ${item.title}`} onClick={() => choose(item)}><span className="card-art"><Sleeve track={item} /><span className="card-play"><Icon name={item.id === track.id && playing ? 'pause' : 'play'} /></span>{item.id === track.id && playing && <span className="playing-label">Now playing</span>}</span><strong>{item.title}</strong></button>)}</div></section>)}</div>
      {!filtered.some(t => view === 'all' || t.categorie === view) && <p role="status" className="empty-state">No tracks found. Try another title or collection.</p>}
      {error && <p className="playback-error" role="alert">{error} <button onClick={() => playTrack()}>Retry</button></p>}
      <footer><a className="wordmark" href="#main">dimension</a><small>© {new Date().getFullYear()} Maxence Badin-Léger</small></footer>
    </main>
    {external ? <aside className="external-dock" aria-label="Lecteur Spotify"><div className="external-caption"><span>{external.artist} — {external.title}</span><button onClick={silence} aria-label="Fermer le lecteur et revenir au silence">Silence <Icon name="close" /></button></div><iframe key={external.id} title={`Écouter ${external.title} sur Spotify`} src={`https://open.spotify.com/embed/track/${external.spotifyId}?utm_source=generator&theme=0`} width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen /><div className="external-help"><span>Lecture proposée par Spotify selon votre compte.</span><a href={`https://open.spotify.com/track/${external.spotifyId}`} target="_blank" rel="noreferrer">Ouvrir dans Spotify ↗</a></div></aside> : hasLocalSelection ? <aside className="player-dock" aria-label="Persistent player"><div className="dock-track"><Sleeve track={track} /><div><strong aria-live="polite">{track.title}</strong></div></div><div className="dock-center">{transport()}<div className="dock-progress"><span>{formatTime(elapsed)}</span><input aria-label="Playback position" type="range" min="0" max={duration || 1} step=".1" value={Math.min(elapsed, duration || 0)} disabled={!duration} onChange={seek} style={{
            '--progress': `${progress}%`
          }} /><span>{formatTime(duration)}</span></div></div><div className="dock-tools"><button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}><Icon name={muted || volume === 0 ? 'mute' : 'volume'} /></button><input aria-label="Volume" type="range" min="0" max="1" step=".01" value={muted ? 0 : volume} onChange={changeVolume} /><button aria-label="Open immersive player" onClick={() => immersive.current.showModal()}><Icon name="expand" /></button></div></aside> : <aside className="silent-dock" aria-label="Lecteur au repos"><span className="quiet-status"><i />En silence.</span><button onClick={() => collection === 'after-hours' ? selectExternal(afterHours[0]) : playTrack(0)}>Écouter <Icon name="play" /></button></aside>}
    <dialog ref={immersive} className="immersive" aria-label="Immersive listening room"><button className="immersive-close" aria-label="Close immersive player" onClick={() => immersive.current.close()}><Icon name="close" /></button><span className="eyebrow">DIMENSION / NOW PLAYING</span><Sleeve track={track} /><h2>{track.title}</h2><span>{formatTime(elapsed)} / {formatTime(duration)}</span>{transport(true)}</dialog>
  </div>;
}
