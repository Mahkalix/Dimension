import React, { Suspense, useState } from 'react';
import './components/KitchenIntro.css';
import MusicStation from './components/MusicStation';
const KitchenIntro = React.lazy(() => import('./components/KitchenIntro'));
export default function App() {
  const [entered,setEntered] = useState(false);
  return <>
    <a className="dimension-skip" href="#dimension-player" onClick={()=>setEntered(true)}>Passer l'introduction</a>
    {!entered && <Suspense fallback={<div className="dimension-loading">DIMENSION / LOADING THE KITCHEN…</div>}>
      <KitchenIntro onComplete={()=>setEntered(true)} />
    </Suspense>}
    <div style={!entered?{display:'none'}:undefined} aria-hidden={!entered}>
      <MusicStation />
    </div>
  </>;
}