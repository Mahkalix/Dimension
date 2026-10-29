import React,{useCallback,useEffect,useRef,useState} from 'react';
import originals from '../data/datamusic.json';
import editorial from '../data/afterhours.json';
import MusicVideoPlayer from './MusicVideoPlayer';
import {LogButton} from './logbutton';
import './MusicStation.css';

const tracks=[
 ...originals.map((x,i)=>({...x,id:'local-'+x.id,artist:'DIMENSION SESSIONS',album:'The Original Sessions',cover:x.gif,source:'local',durationLabel:'AUDIO',moods:['before','family','after','walk'][i%4]})),
 ...editorial.map(x=>({...x,id:'video-'+x.id,album:'The Kitchen Selection',cover:'/brand/dimension-bear.svg',source:'youtube',moods:x.id==='chicago'?'walk':'after'}))
];
const moods=[
 {id:'before',name:'BEFORE SERVICE',description:'The quiet hour before the doors open.',subtitle:'Warm-up · Soul · Slow mornings'},
 {id:'service',name:'YES, CHEF',description:'For every second that counts.',subtitle:'Energy · The rush · High pressure'},
 {id:'family',name:'FAMILY MEAL',description:'A minute together in the middle of the noise.',subtitle:'Jazz · Soul · The break'},
 {id:'after',name:'AFTER HOURS',description:'The kitchen is finally yours.',subtitle:'Closing time · Alternative'},
 {id:'walk',name:'THE WALK HOME',description:'One more song before home.',subtitle:'Night streets · Introspection'}
];
const moodsTracks={before:tracks.filter(x=>x.moods==='before'),service:tracks.filter(x=>x.id==='video-weird-fishes'),family:tracks.filter(x=>x.moods==='family'),after:tracks.filter(x=>x.moods==='after'),walk:tracks.filter(x=>x.moods==='walk')};
function clock(t){if(!Number.isFinite(t))return '--:--';return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');}
function safeRead(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
function SymbolButton({label,children,onClick,pressed,disabled,className=''}){return <button type="button" className={className} onClick={onClick} disabled={disabled} aria-label={label} aria-pressed={pressed===undefined?undefined:pressed}>{children}</button>}

export default function MusicStation(){
 const audio=useRef(null);const [page,setPage]=useState('home');const [mood,setMood]=useState('after');
 const [now,setNow]=useState(null);const [playing,setPlaying]=useState(false);const [youtubePlaying,setYoutubePlaying]=useState(false);
 const [command,setCommand]=useState(0);const [elapsed,setElapsed]=useState(0);const [duration,setDuration]=useState(0);
 const [volume,setVolume]=useState(.6);const [muted,setMuted]=useState(false);const [query,setQuery]=useState('');
 const [favorites,setFavorites]=useState(()=>safeRead('dimension-favorites',[]));
 const [queue,setQueue]=useState([]);const [shuffle,setShuffle]=useState(false);const [repeat,setRepeat]=useState(false);
 const [queueOpen,setQueueOpen]=useState(false);const [error,setError]=useState('');
 const active=playing||youtubePlaying;
 useEffect(()=>{try{localStorage.setItem('dimension-favorites',JSON.stringify(favorites));}catch{}},[favorites]);
 useEffect(()=>{const player=audio.current;return()=>player?.pause();},[]);
 const choose=useCallback((track,upcoming)=>{
  if(!track)return;
  const node=audio.current;if(node){node.pause();node.removeAttribute('src');node.load();}
  setPlaying(false);setYoutubePlaying(false);setNow(track);setElapsed(0);setDuration(0);setError('');
  if(upcoming)setQueue(upcoming);
  if(track.source==='local'&&node){node.src=track.url;node.volume=volume;node.muted=muted;node.play().catch(()=>setError('Impossible de lire ce fichier audio.'));}
 },[volume,muted]);
 const stop=()=>{audio.current?.pause();setNow(null);setQueue([]);setPlaying(false);setYoutubePlaying(false);setError('');};
 const step=useCallback((direction)=>{
  if(!now){choose(tracks[0]);return;}
  if(direction<0&&elapsed>3&&now.source==='local'){audio.current.currentTime=0;setElapsed(0);return;}
  if(direction>0&&queue.length){const [next,...rest]=queue;choose(next,rest);return;}
  const idx=tracks.findIndex(t=>t.id===now.id);
  const next=shuffle?tracks[Math.floor(Math.random()*tracks.length)]:tracks[(idx+direction+tracks.length)%tracks.length];
  choose(next);
 },[now,queue,elapsed,shuffle,choose]);
 const toggle=()=>{if(!now){choose(tracks[0]);return;}if(now.source==='youtube'){setCommand(x=>x+1);return;}
  if(audio.current.paused)audio.current.play().catch(()=>setError('Lecture impossible.'));else audio.current.pause();};
 const handleEnd=()=>{if(repeat&&now?.source==='local'){audio.current.currentTime=0;audio.current.play().catch(()=>{});}else step(1);};
 useEffect(()=>{const keyboard=e=>{
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)||e.metaKey||e.ctrlKey||e.altKey)return;
  if(e.code==='Space'){e.preventDefault();toggle();}if(e.code==='ArrowRight'&&e.shiftKey){e.preventDefault();step(1);}
 };window.addEventListener('keydown',keyboard);return()=>window.removeEventListener('keydown',keyboard);});
 const changeVolume=e=>{const v=Number(e.target.value);setVolume(v);setMuted(false);if(audio.current){audio.current.volume=v;audio.current.muted=false;}};
 const seek=e=>{if(!now||now.source!=='local'||!Number.isFinite(audio.current?.duration))return;audio.current.currentTime=Number(e.target.value);setElapsed(Number(e.target.value));};
 const toggleFavorite=id=>setFavorites(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);
 const addQueue=t=>setQueue(q=>[...q,t]);
 const selected=moods.find(m=>m.id===mood);const moodList=moodsTracks[mood]||[];
 const filtered=tracks.filter(t=>(t.title+' '+t.artist+' '+t.album).toLowerCase().includes(query.toLowerCase()));
 const available=page==='favorites'?tracks.filter(t=>favorites.includes(t.id)):page==='search'?filtered:page==='artists'?tracks:page==='albums'?tracks:page==='library'?tracks:page==='playlists'?moodList:tracks;
 const label=page==='home'?'THE KITCHEN':page==='playlists'?selected.name:page.toUpperCase();
 const renderTrack=(track,index)=> <div className={'ds-track '+(now?.id===track.id?'is-current':'')} key={track.id}>
   <button type="button" className="ds-track-main" onClick={()=>choose(track,available.slice(index+1))}>
    <span className="ds-track-number">{now?.id===track.id&&active?'♫':String(index+1).padStart(2,'0')}</span>
    <img src={track.cover} alt="" loading="lazy"/><span className="ds-track-title"><strong>{track.title}</strong><small>{track.artist}</small></span>
    <span className="ds-track-album">{track.album}</span><span className="ds-track-source">{track.source==='youtube'?'VIDEO':'LOCAL'}</span>
   </button><SymbolButton label={favorites.includes(track.id)?'Retirer des favoris':'Ajouter aux favoris'} onClick={()=>toggleFavorite(track.id)} pressed={favorites.includes(track.id)}>{favorites.includes(track.id)?'♥':'♡'}</SymbolButton>
   <SymbolButton label={'Ajouter '+track.title+' à la file d’attente'} onClick={()=>addQueue(track)}>＋</SymbolButton>
 </div>;
 return <div className="ds-app">
  <audio ref={audio} preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}
   onTimeUpdate={()=>setElapsed(audio.current.currentTime)} onLoadedMetadata={()=>setDuration(Number.isFinite(audio.current.duration)?audio.current.duration:0)} onEnded={handleEnd}
   onError={()=>{if(now?.source==='local')setError('Piste indisponible.');}}/>
  <header className="ds-top"><a href="#dimension-player" className="ds-wordmark" onClick={()=>setPage('home')}><img src="/brand/dimension-bear.svg" alt=""/><strong>DIMENSION<span>.</span></strong></a><span className="ds-top-note">EVERY KITCHEN HAS A SOUNDTRACK.</span><LogButton/></header>
  <div className="ds-layout" id="dimension-player">
   <nav className="ds-sidebar" aria-label="Navigation principale">
    <span className="ds-overline">THE SYSTEM / 001</span>
    {[['home','HOME'],['library','LIBRARY'],['playlists','PLAYLISTS'],['albums','ALBUMS'],['artists','ARTISTS'],['search','SEARCH'],['favorites','FAVORITES']].map(([id,title])=><button key={id} type="button" aria-current={page===id?'page':undefined} onClick={()=>setPage(id)}><span>{title}</span><span aria-hidden="true">↗</span></button>)}
    <div className="ds-sidebar-bottom"><span>THE BEAR / INSPIRED</span><small>UNOFFICIAL MUSIC EXPERIENCE</small></div>
   </nav>
   <main className="ds-content">
    <div className="ds-location"><span>DIMENSION / VOL. 001</span><span>CHICAGO · AFTER THE NOISE</span></div>
    <div className="ds-heading"><span className="ds-overline">{page==='home'?'WELCOME TO THE SERVICE':'THE COLLECTION'}</span><h1>{label}<span>.</span></h1><p>{page==='home'?'Every shift has its own rhythm. Pick a moment, find its sound.':page==='playlists'?selected.description:page==='favorites'?'The tracks you keep close.':'A collection for all the hours around the service.'}</p></div>
    {(page==='home'||page==='playlists')&&<section className="ds-mood-grid" aria-label="Ambiances musicales">{moods.map((m,i)=><button key={m.id} aria-pressed={mood===m.id&&page==='playlists'} onClick={()=>{setMood(m.id);setPage('playlists');}}><small>0{i+1} / DIMENSION</small><strong>{m.name}</strong><span>{m.subtitle}</span><b aria-hidden="true">↗</b></button>)}</section>}
    {page==='search'&&<label className="ds-search"><span>FIND A TRACK</span><input type="search" autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Song, artist, album…"/></label>}
    {page==='albums'&&<div className="ds-collections"><button onClick={()=>setPage('library')}>THE ORIGINAL SESSIONS <span>10 TRACKS ↗</span></button><button onClick={()=>{setQuery('Radiohead');setPage('search');}}>THE KITCHEN SELECTION <span>02 TRACKS ↗</span></button></div>}
    {page==='artists'&&<div className="ds-collections">{['DIMENSION SESSIONS','Radiohead','Sufjan Stevens'].map(a=><button key={a} onClick={()=>{setQuery(a);setPage('search');}}>{a}<span>EXPLORE ↗</span></button>)}</div>}
    <section className="ds-list" aria-label="Liste de morceaux"><div className="ds-list-heading"><h2>{page==='playlists'?selected.name:page==='favorites'?'SAVED TRACKS':page==='search'?'SEARCH RESULTS':'SELECTED TRACKS'}</h2><span>{available.length} TRACKS</span></div>{available.map(renderTrack)}{available.length===0&&<p className="ds-empty">Nothing here yet. Try another selection.</p>}</section>
    <footer className="ds-footer">DIMENSION IS AN INDEPENDENT EXPERIENCE INSPIRED BY THE ATMOSPHERE OF THE BEAR. NOT AFFILIATED WITH FX OR SPOTIFY.</footer>
   </main>
   <aside className="ds-right" aria-label="Lecteur en cours"><div className="ds-device"><div className="ds-device-head"><span>DIMENSION / HI-FI 001</span><span>STEREO</span></div><div className="ds-lcd"><span>NOW PLAYING · {active?'● ON AIR':'STANDBY'}</span><img src={now?.cover||'/brand/dimension-bear.svg'} alt={now?'Pochette de '+now.title:''}/><strong>{now?.title||'NO SIGNAL'}</strong><small>{now?.artist||'SELECT A TRACK TO PLAY'}</small></div><div className="ds-wheel"><SymbolButton label="Morceau précédent" onClick={()=>step(-1)}>◀◀</SymbolButton><SymbolButton label={active?'Pause':'Lecture'} onClick={toggle}>{active?'Ⅱ':'▶'}</SymbolButton><SymbolButton label="Morceau suivant" onClick={()=>step(1)}>▶▶</SymbolButton></div><div className="ds-device-caption">THE MUSIC NEVER LEAVES THE ROOM.</div></div></aside>
  </div>
  {now?.source==='youtube'&&<div className="ds-video"><MusicVideoPlayer key={now.id} track={now} volume={muted?0:volume} onVolumeChange={changeVolume} onClose={stop} command={command} onPlayingChange={setYoutubePlaying}/></div>}
  {queueOpen&&<aside className="ds-queue" aria-label="File d'attente"><div className="ds-queue-head"><h2>UP NEXT</h2><button onClick={()=>setQueueOpen(false)} aria-label="Fermer la file d'attente">×</button></div>{queue.length===0?<p>No tracks queued.</p>:queue.map((t,i)=><div key={t.id+'-'+i} className="ds-queue-item"><span>{t.title}</span><button onClick={()=>setQueue(q=>q.filter((_,n)=>n!==i))} aria-label={'Retirer '+t.title}>×</button><button disabled={!i} onClick={()=>setQueue(q=>{const n=[...q];[n[i-1],n[i]]=[n[i],n[i-1]];return n;})} aria-label={'Monter '+t.title}>↑</button><button disabled={i===queue.length-1} onClick={()=>setQueue(q=>{const n=[...q];[n[i+1],n[i]]=[n[i],n[i+1]];return n;})} aria-label={'Descendre '+t.title}>↓</button></div>)}</aside>}
  <div className="ds-dock" aria-label="Lecteur audio persistant"><div className="ds-dock-info"><img src={now?.cover||'/brand/dimension-bear.svg'} alt=""/><span><strong>{now?.title||'EN SILENCE'}</strong><small>{now?.artist||'DIMENSION'}</small></span></div>
   <div className="ds-transport"><div className="ds-transport-buttons"><SymbolButton label="Aléatoire" onClick={()=>setShuffle(v=>!v)} pressed={shuffle}>⤨</SymbolButton><SymbolButton label="Précédent" onClick={()=>step(-1)}>⏮</SymbolButton><SymbolButton label={active?'Pause':'Lecture'} onClick={toggle}>{active?'Ⅱ':'▶'}</SymbolButton><SymbolButton label="Suivant" onClick={()=>step(1)}>⏭</SymbolButton><SymbolButton label="Répéter" onClick={()=>setRepeat(v=>!v)} pressed={repeat}>↻</SymbolButton></div><div className="ds-progress"><span>{clock(elapsed)}</span><input aria-label="Position de lecture" type="range" min="0" max={duration||1} step=".1" value={Math.min(elapsed,duration||0)} onChange={seek} disabled={now?.source!=='local'||!duration}/><span>{clock(duration)}</span></div></div>
   <div className="ds-extras"><SymbolButton label="File d'attente" onClick={()=>setQueueOpen(v=>!v)} pressed={queueOpen}>☷ {queue.length||''}</SymbolButton><SymbolButton label={muted?'Activer le son':'Couper le son'} onClick={()=>{setMuted(v=>!v);audio.current.muted=!muted;}}>◖</SymbolButton><input aria-label="Volume" type="range" min="0" max="1" step=".01" value={muted?0:volume} onChange={changeVolume}/><SymbolButton label="Arrêter la lecture" onClick={stop}>×</SymbolButton></div>
  </div>
  {error&&<p className="ds-error" role="alert">{error}</p>}
 </div>;
}
