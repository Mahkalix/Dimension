import React, { useEffect, useRef, useState } from 'react';
import originalTracks from '../data/datamusic.json';
import afterHours from '../data/afterhours.json';
import { LogButton } from './logbutton';
import MusicVideoPlayer from './MusicVideoPlayer';
import './IPodExperience.css';

const collections = [
  { id: 'after-hours', label: 'Après le service', detail: 'Une dernière lumière' },
  { id: 'original', label: 'Lo-fi original', detail: 'Les archives de DIMENSION' }
];
const formatTime = seconds => Number.isFinite(seconds) && seconds >= 0
  ? `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
  : '--:--';

export default function IPodExperience() {
  const audioRef = useRef(null);
  const wheelRef = useRef(null);
  const screenListRef = useRef(null);
  const pointerRef = useRef(null);
  const [screen, setScreen] = useState('menu');
  const [collection, setCollection] = useState('after-hours');
  const [cursor, setCursor] = useState(0);
  const [localIndex, setLocalIndex] = useState(0);
  const [localActive, setLocalActive] = useState(false);
  const [external, setExternal] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [videoCommand, setVideoCommand] = useState(0);
  const [volume, setVolume] = useState(.65);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const currentList = collection === 'after-hours' ? afterHours : originalTracks;
  const now = external || (localActive ? originalTracks[localIndex] : null);
  const title = now ? now.title : 'En silence';
  const artist = now ? (now.artist || 'DIMENSION / Lo-fi') : 'Aucun morceau en lecture';
  const menuEntries = screen === 'menu' ? collections : currentList;
  const cover = now && !now.videoId ? now.gif : '/brand/dimension-bear.svg';
  const isCurrent = item => now && now.id === item.id && (!!now.videoId === !!item.videoId);

  useEffect(() => {
    const player = audioRef.current;
    return () => { if (player) player.pause(); };
  }, []);

  useEffect(() => {
    const selected = screenListRef.current?.querySelector('.lcd-row-selected');
    selected?.scrollIntoView?.({ block: 'nearest', behavior: 'auto' });
  }, [cursor, screen, collection]);

  const openCollection = id => {
    setCollection(id);
    setCursor(0);
    setQuery('');
    setScreen('tracks');
  };

  const playItem = item => {
    setError('');
    if (item.videoId) {
      audioRef.current.pause();
      setPlaying(false);
      setLocalActive(false);
      setExternal(item);
    } else {
      setExternal(null);
      const nextIndex = originalTracks.findIndex(track => track.id === item.id);
      if (nextIndex === -1) return;
      const element = audioRef.current;
      element.pause();
      element.src = item.url;
      element.volume = muted ? 0 : volume;
      setLocalIndex(nextIndex);
      setLocalActive(true);
      setDuration(0);
      setElapsed(0);
      element.play().catch(() => setError('Ce morceau ne peut pas être lu.'));
    }
    setScreen('now');
  };

  const pauseAll = () => {
    audioRef.current.pause();
    setExternal(null);
    setLocalActive(false);
    setPlaying(false);
    setError('');
    setScreen('menu');
    setCursor(0);
  };

  const toggle = () => {
    if (external) { setVideoCommand(n => n + 1); return; }
    if (!localActive) {
      playItem(currentList[0]);
      return;
    }
    const audio = audioRef.current;
    if (audio.paused) audio.play().catch(() => setError('Lecture impossible.'));
    else audio.pause();
  };

  const skip = direction => {
    if (!now) { changeCursor(direction); return; }
    const list = external ? afterHours : originalTracks;
    const index = Math.max(0, list.findIndex(item => item.id === now.id));
    playItem(list[(index + direction + list.length) % list.length]);
  };

  const changeCursor = direction => {
    setCursor(previous => (previous + direction + menuEntries.length) % menuEntries.length);
  };

  const select = () => {
    if (screen === 'now') { toggle(); return; }
    if (screen === 'menu') openCollection(collections[cursor].id);
    else if (currentList[cursor]) playItem(currentList[cursor]);
  };

  const back = () => {
    if (screen === 'now') {
      setScreen('tracks');
      const match = currentList.findIndex(item => isCurrent(item));
      setCursor(Math.max(0, match));
    } else {
      setScreen('menu');
      setCursor(collections.findIndex(item => item.id === collection));
    }
  };

  const stepWheel = direction => {
    if (screen === 'now') skip(direction);
    else changeCursor(direction);
  };

  const onWheel = event => {
    event.preventDefault();
    stepWheel(event.deltaY > 0 ? 1 : -1);
  };

  const onPointerDown = event => {
    if (event.target.closest('button')) return;
    const box = wheelRef.current.getBoundingClientRect();
    pointerRef.current = { x: box.left + box.width / 2, y: box.top + box.height / 2, angle: Math.atan2(event.clientY - box.top - box.height / 2, event.clientX - box.left - box.width / 2), accumulated: 0 };
    wheelRef.current.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = event => {
    const pointer = pointerRef.current;
    if (!pointer) return;
    const angle = Math.atan2(event.clientY - pointer.y, event.clientX - pointer.x);
    let difference = angle - pointer.angle;
    if (difference > Math.PI) difference -= 2 * Math.PI;
    if (difference < -Math.PI) difference += 2 * Math.PI;
    pointer.angle = angle;
    pointer.accumulated += difference;
    if (Math.abs(pointer.accumulated) > .4) {
      stepWheel(pointer.accumulated > 0 ? 1 : -1);
      pointer.accumulated = 0;
    }
  };

  const onKeyDown = event => {
    if (event.target !== wheelRef.current) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault(); stepWheel(1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault(); stepWheel(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault(); select();
    } else if (event.key === 'Escape' || event.key === 'Backspace') {
      event.preventDefault(); back();
    } else if (event.key === ' ') {
      event.preventDefault(); toggle();
    }
  };

  const changeVolume = event => {
    const next = Number(event.target.value);
    setVolume(next);
    setMuted(false);
    audioRef.current.volume = next;
    audioRef.current.muted = false;
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    audioRef.current.muted = next;
  };

  const seek = event => {
    const seconds = Number(event.target.value);
    if (Number.isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = seconds;
      setElapsed(seconds);
    }
  };

  const visibleList = currentList.filter(item =>
    `${item.title} ${item.artist || ''}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="dimension-classic">
      <a className="classic-skip" href="#lecteur">Aller au lecteur</a>
      <audio ref={audioRef} preload="metadata" onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={() => setDuration(Number.isFinite(audioRef.current.duration) ? audioRef.current.duration : 0)}
        onTimeUpdate={() => setElapsed(audioRef.current.currentTime)}
        onEnded={() => skip(1)}
        onError={() => { if (localActive) setError('Enregistrement indisponible.'); }} />
      <header className="classic-header">
        <a href="#lecteur" className="classic-identity" aria-label="DIMENSION, accueil">
          <img src="/brand/dimension-bear.svg" alt="" />
          <strong>DIMENSION<span className="classic-period">.</span></strong>
        </a>
        <span className="classic-header-label">UN PEU DE CALME, EN BOUCLE.</span>
        <div className="classic-header-actions"><a href="#bibliotheque">La collection <span aria-hidden="true">↗</span></a><LogButton /></div>
      </header>

      <main id="lecteur" className="classic-main">
        <section className="classic-intro">
          <p className="classic-kicker">01 / UN LECTEUR À PART</p>
          <h1>Après<br />le <em>bruit.</em></h1>
          <p className="classic-description">La musique comme une pièce à part. Un iPod, quelques morceaux, rien de plus.</p>
          <span className="classic-signature">FAIT POUR LES HEURES SANS BRUIT.</span>
        </section>

        <section className="classic-device-wrap" aria-label="Lecteur interactif">
          <div className="classic-device" data-testid="dimension-ipod">
            <div className="classic-screen">
              <div className="classic-screen-status"><span>◀ DIMENSION</span><span>{screen === 'now' ? '♪' : '▮▮▮'}</span></div>
              {screen === 'now' ? (
                <div className="classic-screen-now">
                  <img src={cover} alt="" />
                  <div className="classic-screen-track"><strong>{title}</strong><span>{artist}</span><small>{external ? 'Vidéo officielle · YouTube' : 'Lo-fi original'}</small></div>
                  {localActive && <div className="classic-screen-progress"><span>{formatTime(elapsed)}</span><div><i style={{ width: `${duration ? Math.min(100, elapsed / duration * 100) : 0}%` }} /></div><span>{formatTime(duration)}</span></div>}
                </div>
              ) : (
                <div className="classic-screen-columns">
                  <div className="classic-lcd-list" ref={screenListRef}>
                    <strong className="classic-lcd-heading">{screen === 'menu' ? 'Musique' : collection === 'original' ? 'Lo-fi original' : 'Après le service'}</strong>
                    {menuEntries.map((item, index) => (
                      <button type="button" key={item.id} className={cursor === index ? 'lcd-row-selected' : ''}
                        aria-current={cursor === index ? 'true' : undefined}
                        onClick={() => {
                          if (screen === 'menu') openCollection(item.id);
                          else { setCursor(index); playItem(item); }
                        }}>
                        <span>{item.label || item.title}</span><span aria-hidden="true">›</span>
                      </button>
                    ))}
                  </div>
                  <div className="classic-lcd-cover">
                    <img src="/brand/dimension-bear.svg" alt="" />
                    <strong>DIMENSION</strong><small>{screen === 'menu' ? 'DEUX COLLECTIONS' : `${currentList.length} TITRES`}</small>
                  </div>
                </div>
              )}
              <div className="classic-screen-bottom"><span>{screen === 'now' ? 'LECTURE' : 'SÉLECTION'}</span><span>{screen === 'now' ? 'MENU POUR REVENIR' : `${cursor + 1} / ${menuEntries.length}`}</span></div>
            </div>
            <div className="classic-wheel" ref={wheelRef} role="group" tabIndex={0}
              aria-label="Molette iPod (flèches pour naviguer, Entrée pour choisir, Échap pour revenir)"
              onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove}
              onPointerUp={() => { pointerRef.current = null; }} onPointerCancel={() => { pointerRef.current = null; }}
              onKeyDown={onKeyDown}>
              <button type="button" className="wheel-menu" onClick={back}>MENU</button>
              <button type="button" className="wheel-prev" aria-label={screen === 'now' ? 'Morceau précédent' : 'Élément précédent'} onClick={() => stepWheel(-1)}>◀◀</button>
              <button type="button" className="wheel-next" aria-label={screen === 'now' ? 'Morceau suivant' : 'Élément suivant'} onClick={() => stepWheel(1)}>▶▶</button>
              <button type="button" className="wheel-play" aria-label="Lecture ou pause" onClick={toggle}>▶Ⅱ</button>
              <button type="button" className="wheel-select" aria-label="Sélectionner" onClick={select} />
            </div>
            <span className="classic-device-engraving">DIMENSION / 001</span>
          </div>
          <div className="classic-device-caption"><span>OBJET NUMÉRIQUE NO 001</span><span>POUR LES OREILLES ET LE RESTE.</span></div>
        </section>

        <section className="classic-aside" id="bibliotheque">
          <div className="classic-aside-top"><span className="classic-kicker">02 / LA SÉLECTION</span><span className="classic-edition">ÉDITION 2026</span></div>
          <h2>Peu de morceaux.<br /><i>La bonne ambiance.</i></h2>
          <div className="classic-collection-tabs" aria-label="Collections">
            {collections.map(item => <button key={item.id} type="button" aria-pressed={collection === item.id}
              onClick={() => openCollection(item.id)}>{item.label}</button>)}
          </div>
          <label className="classic-search">Chercher un titre
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Titre ou artiste…" />
          </label>
          <div className="classic-track-list" aria-label="Morceaux">
            {visibleList.map((item, index) => <button type="button" key={item.id}
              className={isCurrent(item) ? 'classic-track active' : 'classic-track'} onClick={() => playItem(item)}>
              <span className="classic-track-no">{String(index + 1).padStart(2, '0')}</span>
              <span className="classic-track-name"><strong>{item.title}</strong><small>{item.artist || 'DIMENSION / Lo-fi'}</small></span>
              <span className="classic-track-action" aria-hidden="true">{isCurrent(item) ? '♫' : '↗'}</span>
            </button>)}
            {!visibleList.length && <p className="classic-empty">Aucun titre trouvé.</p>}
          </div>
          <div className="classic-current">
            <div><span className="classic-kicker">EN CE MOMENT</span><strong>{title}</strong><small>{artist}</small></div>
            <button type="button" onClick={pauseAll} disabled={!now}>Silence <span aria-hidden="true">×</span></button>
          </div>
          {localActive && <div className="classic-mini-player">
            <button aria-label={playing ? 'Pause' : 'Lecture'} onClick={toggle}>{playing ? 'Ⅱ' : '▶'}</button>
            <label className="classic-seek">Position de lecture<input type="range" min="0" max={duration || 1} step=".1" value={Math.min(elapsed, duration || 0)} onChange={seek} disabled={!duration} /></label>
          </div>}
          {now && <div className="classic-volume"><button aria-label={muted ? 'Activer le son' : 'Couper le son'} onClick={toggleMute}>{muted ? '◌' : '◖)'}</button><label>Volume<input type="range" min="0" max="1" step=".01" value={muted ? 0 : volume} onChange={changeVolume} /></label></div>}
          {error && <p className="classic-error" role="alert">{error}</p>}
          {external && <MusicVideoPlayer key={external.id} track={external} volume={muted ? 0 : volume}
            onVolumeChange={changeVolume} onClose={pauseAll} command={videoCommand} />}
        </section>
      </main>
      <footer className="classic-footer"><span>DIMENSION © {new Date().getFullYear()}</span><span>FAIRE MOINS. ÉCOUTER PLUS.</span><a href="#lecteur">REMONTER ↑</a></footer>
    </div>
  );
}
