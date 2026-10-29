import React, { useState } from 'react';
import './components/KitchenIntro.css';
import MusicStation from './components/MusicStation';

export default function App() {
  const [entered,setEntered] = useState(false);
  return <>
    <a className="dimension-skip" href="#dimension-player" onClick={()=>setEntered(true)}>Passer l'introduction</a>
    {!entered && <section className="dimension-photo-intro" aria-labelledby="dimension-intro-title">
      <img src="/images/dimension-after-hours.webp" alt="" className="dimension-photo-intro-bg" />
      <div className="dimension-photo-intro-shade" aria-hidden="true" />
      <div className="dimension-photo-intro-content">
        <span className="dimension-photo-kicker">THE KITCHEN / VOL. 001</span>
        <h1 id="dimension-intro-title">DIMENSION</h1>
        <p>AFTER THE NOISE</p>
        <button type="button" onClick={()=>setEntered(true)}>ENTER</button>
      </div>
    </section>}
    <div style={!entered?{display:'none'}:undefined} aria-hidden={!entered}>
      <MusicStation />
    </div>
  </>;
}