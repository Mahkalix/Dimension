import React,{useEffect,useRef,useState} from 'react';
import {LogButton} from './logbutton';
import MusicVideoPlayer from './MusicVideoPlayer';
import original from '../data/datamusic.json';
import editorial from '../data/afterhours.json';
import './MusicSanctuary.css';
import './SanctuarySingle.css';

const external=[
 {...editorial[0],side:'IN THE WEEDS',note:'From the Basement'},
 {...editorial[1],side:'AFTER CLOSE'},
 {id:'new-noise',title:'New Noise',artist:'Refused',side:'IN THE WEEDS',url:'https://www.youtube.com/results?search_query=Refused+New+Noise+official'},
 {id:'strange-currencies',title:'Strange Currencies',artist:'R.E.M.',side:'AFTER CLOSE',url:'https://www.youtube.com/results?search_query=REM+Strange+Currencies+official'},
 {id:'let-down',title:'Let Down',artist:'Radiohead',side:'AFTER CLOSE',url:'https://www.youtube.com/results?search_query=Radiohead+Let+Down+official'},
 {id:'via-chicago',title:'Via Chicago',artist:'Wilco',side:'BEFORE SERVICE',url:'https://www.youtube.com/results?search_query=Wilco+Via+Chicago+official'},
 {id:'together',title:'Together',artist:'Nine Inch Nails',side:'AFTER CLOSE',url:'https://www.youtube.com/results?search_query=Nine+Inch+Nails+Together+official'}
];
const library=[...external,...original.map(x=>({...x,side:'BEFORE SERVICE',artist:'DIMENSION / LO-FI',local:true}))];
const sides=['BEFORE SERVICE','IN THE WEEDS','AFTER CLOSE'];
const readableTime=value=>Number.isFinite(value)?`${String(Math.floor(value/60)).padStart(2,'0')}:${String(Math.floor(value%60)).padStart(2,'0')}`:'--:--';
export default function MusicSanctuary(){
 const audio=useRef(null);
 const [intro,setIntro]=useState(true);
 const [side,setSide]=useState('AFTER CLOSE');
 const [now,setNow]=useState(null);
 const [playing,setPlaying]=useState(false);
 const [videoPlaying,setVideoPlaying]=useState(false);
 const [videoCommand,setVideoCommand]=useState(0);
 const [volume,setVolume]=useState(.65);
 const [muted,setMuted]=useState(false);
 const [elapsed,setElapsed]=useState(0);
 const [duration,setDuration]=useState(0);
 const [error,setError]=useState('');
 const [search,setSearch]=useState('');
 const tracks=library.filter(x=>x.side===side&&`${x.title} ${x.artist}`.toLowerCase().includes(search.toLowerCase()));
 const active=playing||videoPlaying;
 useEffect(()=>{const element=audio.current;return()=>element?.pause();},[]);
 const choose=track=>{
   if(track.url&&/^https?:/.test(track.url)&&!track.videoId){window.open(track.url,'_blank','noopener,noreferrer');return;}
   audio.current.pause();setPlaying(false);setVideoPlaying(false);setElapsed(0);setDuration(0);setError('');
   setNow(track);
   if(track.local){audio.current.src=track.url;audio.current.volume=muted?0:volume;audio.current.play().catch(()=>setError('Ce fichier ne peut pas être lu.'));}
 };
 const pause=()=>{if(!now)return;if(now.videoId){setVideoCommand(x=>x+1);}else if(audio.current.paused){audio.current.play().catch(()=>setError('Lecture impossible.'));}else audio.current.pause();};
 const silence=()=>{audio.current.pause();setNow(null);setPlaying(false);setVideoPlaying(false);};
 const adjacent=direction=>{
  const current=library.filter(x=>x.side===side&&(!x.url||!/^https?:/.test(x.url)||x.videoId));
  if(!current.length)return;
  const index=current.findIndex(x=>now&&now.id===x.id);
  choose(current[(index+direction+current.length)%current.length]);
 };
 const changeVolume=e=>{const v=Number(e.target.value);setVolume(v);audio.current.volume=v;audio.current.muted=false;setMuted(false);};
 const seek=e=>{const value=Number(e.target.value);if(Number.isFinite(audio.current.duration)){audio.current.currentTime=value;setElapsed(value);}};
 return <div className="sanctuary sanctuary-single">
  <audio ref={audio} preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}
   onTimeUpdate={()=>setElapsed(audio.current.currentTime)} onLoadedMetadata={()=>setDuration(Number.isFinite(audio.current.duration)?audio.current.duration:0)}
   onEnded={()=>adjacent(1)}/>
  {intro&&<div className="kitchen-entry" role="dialog" aria-modal="true" aria-labelledby="dimension-intro">
    <div className="kitchen-entry-world" aria-hidden="true">
      <div className="kitchen-entry-light light-one"/><div className="kitchen-entry-light light-two"/>
      <div className="kitchen-entry-pans"><i/><i/><i/><i/><i/></div>
      <div className="kitchen-entry-counter"/><div className="kitchen-entry-towel"/>
    </div>
    <div className="kitchen-device-scene">
      <div className="kitchen-tablet">
        <div className="kitchen-tablet-frame">
          <div className="kitchen-tablet-screen">
            <span className="tablet-screen-top">DIMENSION / 001 <span>● READY</span></span>
            <img src="/brand/dimension-bear.svg" alt="" className="tablet-bear"/>
            <h1 id="dimension-intro">DIMENSION</h1>
            <p>AFTER THE NOISE</p>
            <button autoFocus type="button" onClick={()=>setIntro(false)}>ENTER <span aria-hidden="true">↗</span></button>
          </div>
          <div className="kitchen-tablet-speaker" aria-hidden="true"/>
          <div className="kitchen-tablet-dial" aria-hidden="true"><span/></div>
        </div>
        <div className="kitchen-tablet-stand" aria-hidden="true"/>
      </div>
    </div>
    <span className="kitchen-entry-caption">THE KITCHEN IS CLOSED. THE MUSIC IS STILL ON.</span>
  </div>}
  <header className="sanctuary-header">
    <a className="sanctuary-logo" href="#dimension-player"><img src="/brand/dimension-bear.svg" alt=""/><strong>DIMENSION<span>.</span></strong></a>
    <span className="single-topline">86 THE NOISE / KEEP THE MUSIC</span>
    <div className="sanctuary-header-end"><a href="#dimension-concept" className="single-concept-link">LE CONCEPT</a><LogButton/></div>
  </header>
  <main id="dimension-player" className="single-main">
    <div className="single-left"><span className="single-eyebrow">DIMENSION / VOL. 001</span><h1>THE<br/><em>ROOM.</em></h1>
     <nav className="single-sides" aria-label="Ambiances">{sides.map((value,i)=><button key={value} aria-pressed={side===value} onClick={()=>{setSide(value);setSearch('');}}>
      <span>0{i+1}</span><strong>{value}</strong><span aria-hidden="true">↗</span></button>)}</nav>
    </div>
    <div className="single-right"><span className="single-eyebrow">SIDE {sides.indexOf(side)+1} / THE TRACKS</span><h2>{side.split(' ').map((word,i)=><React.Fragment key={i}>{word}{i===0?<br/>:' '}</React.Fragment>)}</h2>
     <label className="single-search">RECHERCHER<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Titre ou artiste…"/></label>
     <div className="single-tracklist">{tracks.map((track,i)=><button key={track.id} onClick={()=>choose(track)} className={now?.id===track.id?'selected':''}>
      <span>{String(i+1).padStart(2,'0')}</span><span><strong>{track.title}</strong><small>{track.artist}</small></span><span aria-hidden="true">{track.url&&/^https?:/.test(track.url)&&!track.videoId?'↗':'▶'}</span></button>)}</div>
     {tracks.length===0&&<p>Aucun titre trouvé.</p>}
     <span className="single-right-note">INSPIRED BY THE SOUND OF THE BEAR · NOT AN OFFICIAL SOUNDTRACK</span>
    </div>
    <aside className="single-device-panel"><div className="single-device-head"><span>DIMENSION / HI-FI</span><span>33⅓ RPM</span></div>    <div className="sanctuary-3d-scene single-stage compact-stage" aria-label="Platine vinyle">
     <div className="sanctuary-plinth"><div className="sanctuary-plinth-surface">
       <div className="sanctuary-3d-record-stage"><div className={`sanctuary-3d-record ${active?'is-spinning':''}`}>
        <div className="sanctuary-3d-label"><img src="/brand/dimension-bear.svg" alt=""/></div><i className="sanctuary-3d-spindle"/></div></div>
       <div className={`sanctuary-3d-arm ${active?'on-record':''}`}><span className="sanctuary-3d-arm-base"/><span className="sanctuary-3d-arm-shaft"/><span className="sanctuary-3d-arm-cartridge"/></div>
       <div className="sanctuary-3d-switch"><span>33</span><i/></div><div className="sanctuary-3d-knob"/>
     </div><div className="sanctuary-plinth-front"><span>DIMENSION</span><span>STEREO · 33⅓</span><i/></div></div>
    </div>

      <div className="single-device-status"><span>NOW PLAYING</span><strong>{now?now.title:'EN SILENCE'}</strong><small>{now?now.artist:'DIMENSION RECORDS'}</small></div>
    </aside>
  </main>
  <section className="single-concept" id="dimension-concept"><span>01 / THE CONCEPT</span><h2>AFTER<br/><em>THE NOISE.</em></h2><p>La cuisine ferme. Le bruit s'arrête.<br/>Un disque continue de tourner.</p><a href="#dimension-player">RETOUR AU LECTEUR ↑</a></section>
  {now?.videoId&&<div className="single-video"><MusicVideoPlayer key={now.id} track={now} volume={muted?0:volume} onVolumeChange={changeVolume} onClose={silence} command={videoCommand} onPlayingChange={setVideoPlaying}/></div>}
  <div className="single-dock" aria-label="Lecteur musical"><div className="single-dock-info"><div className="single-dock-art"><img src="/brand/dimension-bear.svg" alt=""/></div><div className="single-dock-lcd"><span className="single-lcd-status">{active?'● PLAYING':'Ⅱ STANDBY'} / 33 RPM</span><strong>{now?now.title:'En silence'}</strong><small>{now?now.artist:'DIMENSION / VOL. 001'}</small></div></div>
   <div className="single-dock-player"><div className="single-dock-actions"><button aria-label="Piste précédente" onClick={()=>adjacent(-1)}>↤</button><button className="single-dock-play" aria-label={active?'Pause':'Lecture'} onClick={()=>{if(!now){choose(library.find(x=>x.local));}else pause();}}>{active?'Ⅱ':'▶'}</button><button aria-label="Piste suivante" onClick={()=>adjacent(1)}>↦</button></div>
    <div className="single-dock-progress"><span>{readableTime(elapsed)}</span><input aria-label="Position de lecture" type="range" min="0" max={duration||1} step=".1" value={Math.min(elapsed,duration||0)} onChange={seek} disabled={!now?.local||!duration}/><span>{readableTime(duration)}</span></div>
   </div><div className="single-dock-volume"><span className="single-volume-label">VOL.</span><button aria-label="Couper ou activer le son" onClick={()=>{audio.current.muted=!muted;setMuted(!muted);}}>◖)</button><input aria-label="Volume" type="range" min="0" max="1" step=".01" value={muted?0:volume} onChange={changeVolume}/><button aria-label="Arrêter" onClick={silence}>×</button></div>
  </div>
  {error&&<p role="alert" className="single-error">{error}</p>}
 </div>;
}
