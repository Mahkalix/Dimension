import React, { useEffect, useRef, useState } from 'react';
import { LogButton } from './logbutton';
import MusicVideoPlayer from './MusicVideoPlayer';
import original from '../data/datamusic.json';
import editorial from '../data/afterhours.json';
import './MusicSanctuary.css';

const rooms = [
  { id: 'before', number: '01', name: 'BEFORE SERVICE', time: '07:30 AM', mood: 'A little room to think.', description: 'Avant que tout commence. Les gestes sont lents, la tête est encore claire.', theme: 'morning', tracks: [original[2], original[6], original[8], original[7]] },
  { id: 'weeds', number: '02', name: 'IN THE WEEDS', time: '08:47 PM', mood: 'Let it all out.', description: 'Pour les jours trop bruyants. Tu peux arrêter de faire semblant que tout va bien.', theme: 'pressure', tracks: [editorial[0], original[3], original[4], original[0]] },
  { id: 'after', number: '03', name: 'AFTER CLOSE', time: '02:14 AM', mood: 'The noise is over.', description: 'La dernière lumière est éteinte. Il ne reste que toi et quelques morceaux.', theme: 'night', tracks: [editorial[1], editorial[0], original[5], original[9]] }
];
const time = v => Number.isFinite(v) ? `${String(Math.floor(v/60)).padStart(2,'0')}:${String(Math.floor(v%60)).padStart(2,'0')}` : '--:--';
export default function MusicSanctuary() {
  const audio = useRef(null);
  const [roomId, setRoomId] = useState(null);
  const [now, setNow] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [videoCommand, setVideoCommand] = useState(0);
  const [volume, setVolume] = useState(.65);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const [lowLight, setLowLight] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [search, setSearch] = useState('');
  const room = rooms.find(item => item.id === roomId);
  const selection = room ? room.tracks : [];
  useEffect(() => {
    const player = audio.current;
    const stored = window.localStorage.getItem('dimension-low-light');
    if (stored === 'true') setLowLight(true);
    return () => { player?.pause(); };
  }, []);
  const toggleLight = () => setLowLight(current => {
    window.localStorage.setItem('dimension-low-light', String(!current));
    return !current;
  });
  const selectTrack = track => {
    if (!track) return;
    setError('');
    audio.current.pause();
    setPlaying(false);
    setNow(track);
    setElapsed(0);
    setDuration(0);
    if (!track.videoId) {
      audio.current.src = track.url;
      audio.current.volume = muted ? 0 : volume;
      audio.current.play().catch(() => setError('Lecture indisponible. Choisis un autre morceau.'));
    }
  };
  const enterRoom = id => {
    setRoomId(id);
    setShowArchive(false);
    const chosen = rooms.find(item => item.id === id);
    if (now && !chosen.tracks.some(item => item.id === now.id && !!item.videoId === !!now.videoId)) {
      audio.current.pause();
      setNow(null);
      setPlaying(false);
    }
  };
  const silence = () => { audio.current.pause(); setNow(null); setPlaying(false); setError(''); };
  const toggle = () => {
    if (!now) { if (selection[0]) selectTrack(selection[0]); return; }
    if (now.videoId) { setVideoCommand(x => x+1); return; }
    if (audio.current.paused) audio.current.play().catch(() => setError('Lecture impossible.'));
    else audio.current.pause();
  };
  const skip = direction => {
    if (!selection.length) return;
    const i = selection.findIndex(x => now && x.id === now.id && !!x.videoId === !!now.videoId);
    selectTrack(selection[(i + direction + selection.length) % selection.length]);
  };
  const changeVolume = e => {
    const next = Number(e.target.value);
    setVolume(next); setMuted(false);
    audio.current.volume = next; audio.current.muted = false;
  };
  const toggleMute = () => { setMuted(x => { audio.current.muted = !x; return !x; }); };
  const seek = e => { const next = Number(e.target.value); if (Number.isFinite(audio.current.duration)) { audio.current.currentTime = next; setElapsed(next); } };
  const available = [...editorial, ...original].filter(track => `${track.title} ${track.artist || ''}`.toLowerCase().includes(search.toLowerCase()));
  return <div className={`sanctuary ${lowLight ? 'low-light' : ''} ${room ? 'in-room' : ''}`}>
    <a className="sanctuary-skip" href="#sanctuary-main">Aller au contenu</a>
    <audio ref={audio} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onLoadedMetadata={() => setDuration(Number.isFinite(audio.current.duration) ? audio.current.duration : 0)}
      onTimeUpdate={() => setElapsed(audio.current.currentTime)} onEnded={() => skip(1)}
      onError={() => { if (now && !now.videoId) setError('Ce morceau est indisponible.'); }} />
    <header className="sanctuary-header">
      <button className="sanctuary-logo" onClick={() => { setRoomId(null); setShowArchive(false); }} aria-label="Dimension, accueil">
        <img src="/brand/dimension-bear.svg" alt=""/><strong>DIMENSION<span>.</span></strong>
      </button>
      <nav aria-label="Navigation principale">
        <button aria-current={!room && !showArchive ? 'page' : undefined} onClick={() => { setRoomId(null); setShowArchive(false); }}>THE ROOM</button>
        <button aria-current={showArchive ? 'page' : undefined} onClick={() => setShowArchive(x => !x)}>THE ARCHIVE</button>
      </nav>
      <div className="sanctuary-header-end"><button className="low-light-toggle" onClick={toggleLight} aria-pressed={lowLight}>{lowLight ? 'LIGHT ON' : 'LOW LIGHT'} <span aria-hidden="true">◐</span></button><LogButton /></div>
    </header>
    <main id="sanctuary-main">
      {showArchive ? <section className="sanctuary-archive">
        <p className="sanctuary-overline">03 / THE ARCHIVE</p>
        <h1>THE<br/><em>ARCHIVE.</em></h1><p>Des morceaux à garder près de soi. Rien à découvrir à tout prix.</p>
        <label>RECHERCHER UN MORCEAU<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Titre ou artiste" /></label>
        <div className="archive-tracks">{available.map((track,i) => <button key={track.id} onClick={() => selectTrack(track)}>
          <span>{String(i+1).padStart(2,'0')}</span><strong>{track.title}</strong><span>{track.artist || 'DIMENSION / LO-FI'}</span><span aria-hidden="true">↗</span>
        </button>)}</div>
        {!available.length && <p>Aucun morceau trouvé.</p>}
      </section> : !room ? <section className="sanctuary-home vinyl-home">
        <div className="vinyl-dark-panel">
          <div className="vinyl-panel-top"><span>DIMENSION / HI-FI</span><span>VOL. 001</span></div>
          <div className="vinyl-intro"><span>86 THE NOISE.</span><h1>AFTER<br/><em>CLOSE.</em></h1></div>
          <div className="vinyl-playlists"><p className="vinyl-caption">SELECT A SIDE <span>03 SIDES</span></p>
            {rooms.map(item => <button key={item.id} className="vinyl-room-row" onClick={() => enterRoom(item.id)}>
              <span className="vinyl-room-number">{item.number}</span><span className="vinyl-room-text"><strong>{item.name}</strong><small>{item.time}</small></span><span className="vinyl-room-arrow" aria-hidden="true">↗</span>
            </button>)}
          </div>
        </div>
        <div className="vinyl-record-stage" aria-hidden="true">
          <div className="vinyl-tonearm"><span className="tonearm-pivot"/><span className="tonearm-bar"/><span className="tonearm-head"/></div>
          <div className={`vinyl-record ${now && playing ? 'spinning' : ''}`}><div className="vinyl-record-label"><img src="/brand/dimension-bear.svg" alt=""/></div></div>
        </div>
        <div className="vinyl-paper-panel">
          <div className="vinyl-paper-top"><span>STEREO / 33 RPM</span><span>EST. 2026</span></div>
          <div className="vinyl-editorial"><span>SIDE A / NOW PLAYING</span><h2>NO<br/><em>NOISE.</em></h2><div className="vinyl-now"><span>{now ? now.title : "AFTER CLOSE"}</span><small>{now ? now.artist || "DIMENSION / LO-FI" : "DIMENSION / VOL. 001"}</small></div>
            <button className="vinyl-feature-button" onClick={() => enterRoom('after')}>OPEN PLAYER <span aria-hidden="true">↗</span></button>
          </div>
          <div className="vinyl-annotation"><img src="/brand/dimension-bear.svg" alt=""/><span>DIMENSION RECORDS · 2026</span></div>
        </div>
        <div className="vinyl-bottom-player"><span>01 / 03</span><button aria-label="Ouvrir la salle d'écoute" onClick={() => enterRoom('after')}>↗</button><span>33⅓ RPM · STEREO</span><button onClick={() => {enterRoom('after'); if(!now)selectTrack(rooms[2].tracks[0]);}} aria-label="Lancer une écoute">▶</button></div>
      </section> : <section className="sanctuary-listening">
        <div className="listening-header"><button onClick={() => setRoomId(null)}>← THE ROOM</button><span>{room.number} / {room.name}</span><span>DIMENSION, VOL. 001</span></div>
        <div className="listening-layout"><div className="listening-main">
          <p className="sanctuary-overline">{room.time} / {room.name}</p>
          <h1>{room.mood.split(' ').slice(0,-1).join(' ')}<br/><em>{room.mood.split(' ').slice(-1)}</em></h1>
          <p className="listening-description">{room.description}</p>
          <div className="listening-artwork"><img src={now && !now.videoId ? now.gif : '/brand/dimension-bear.svg'} alt=""/><div><span>NOW PLAYING / {room.number}</span><strong>{now ? now.title : 'En silence.'}</strong><small>{now ? now.artist || 'DIMENSION / Lo-fi' : 'Choisis un morceau pour commencer'}</small></div></div>
          <div className="listening-actions"><button onClick={() => skip(-1)} aria-label="Morceau précédent">↤</button><button className="listening-play" onClick={toggle} aria-label={playing ? 'Pause' : 'Lecture'}>{playing ? 'Ⅱ' : '▶'}</button><button onClick={() => skip(1)} aria-label="Morceau suivant">↦</button><button onClick={silence}>SILENCE ×</button></div>
          {now && !now.videoId && <div className="listening-progress"><span>{time(elapsed)}</span><input aria-label="Position de lecture" type="range" min="0" max={duration || 1} step=".1" value={Math.min(elapsed,duration || 0)} disabled={!duration} onChange={seek}/><span>{time(duration)}</span></div>}
          {now && <div className="listening-volume"><button onClick={toggleMute} aria-label={muted?'Activer le son':'Couper le son'}>{muted?'◌':'◖)'}</button><input aria-label="Volume" type="range" min="0" max="1" step=".01" value={muted?0:volume} onChange={changeVolume}/></div>}
        </div><aside className="listening-queue"><div><span>THE QUEUE</span><span>{String(selection.length).padStart(2,'0')} TRACKS</span></div>
          {selection.map((track,i) => <button key={track.id} className={now && now.id === track.id ? 'active' : ''} onClick={() => selectTrack(track)}><span>{String(i+1).padStart(2,'0')}</span><span><strong>{track.title}</strong><small>{track.artist || 'DIMENSION / Lo-fi'}</small></span><span aria-hidden="true">↗</span></button>)}
          <small>86 THE NOISE. KEEP THE MUSIC.</small>
        </aside></div>
      </section>}
      {error && <p className="sanctuary-error" role="alert">{error}</p>}
    </main>
    {now && now.videoId && <div className="sanctuary-video"><MusicVideoPlayer key={now.id} track={now} volume={muted?0:volume} onVolumeChange={changeVolume} onClose={silence} command={videoCommand}/></div>}
    {now && !room && <div className="sanctuary-dock"><strong>{now.title}</strong><span>{now.artist || 'DIMENSION'}</span><button onClick={toggle}>{playing?'Ⅱ':'▶'}</button><button onClick={silence}>×</button></div>}
    <footer className="sanctuary-footer"><span>DIMENSION © {new Date().getFullYear()}</span><span>86 THE NOISE.</span><span>BUILT FOR THE QUIET HOURS.</span></footer>
  </div>;
}
