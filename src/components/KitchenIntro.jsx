import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, Html, RoundedBox } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

function Kitchen({ onEnter, entering }) {
  const { camera } = useThree();
  const tablet = useRef();
  const steel = '#929b9a';
  useEffect(() => {
    if (!entering) return;
    const target = new THREE.Vector3(0, 1.55, 1.78);
    const tween = gsap.to(camera.position, {
      x: target.x, y: target.y, z: target.z, duration: 1.8,
      ease: 'power3.inOut', onUpdate: () => camera.lookAt(0, 1.48, 0),
      onComplete: onEnter
    });
    return () => tween.kill();
  }, [camera, entering, onEnter]);
  return <>
    <color attach="background" args={['#101719']} />
    <fog attach="fog" args={['#101719', 8, 17]} />
    <ambientLight intensity={0.65} />
    <hemisphereLight args={['#e4f0ee', '#282c2b', 1.1]} />
    <pointLight position={[-2, 4, 2]} intensity={55} color="#b7d9e4" distance={9} />
    <spotLight position={[2, 5, 4]} angle={0.65} penumbra={0.8} intensity={70} color="#f5dfb5" />
    <mesh position={[0, -0.16, -1]} receiveShadow><boxGeometry args={[20, .2, 14]} /><meshStandardMaterial color="#343b3a" roughness={.85}/></mesh>
    <mesh position={[0, 2, -3.2]}><boxGeometry args={[16, 6, .18]} /><meshStandardMaterial color="#3f4b49" roughness={.95}/></mesh>
    <mesh position={[-2.65, 1.08, -.45]}><boxGeometry args={[3.5,.12,1.4]}/><meshStandardMaterial color={steel} metalness={.8} roughness={.25}/></mesh>
    <mesh position={[2.7,1.08,-.75]}><boxGeometry args={[3.6,.12,1.6]}/><meshStandardMaterial color={steel} metalness={.8} roughness={.27}/></mesh>
    {[-4.12,-1.18,1.3,4.1].map(x=><mesh key={x} position={[x,.48,-.8]}><boxGeometry args={[.08,1.1,.08]}/><meshStandardMaterial color="#647071" metalness={.8}/></mesh>)}
    {[-2.7,2.7].map(x=><group key={x}><mesh position={[x,2.65,-2.6]}><boxGeometry args={[3.8,.09,.6]}/><meshStandardMaterial color="#7b8380" metalness={.7} roughness={.35}/></mesh>{[-1,0,1].map(i=><mesh key={i} position={[x+i,2.78,-2.62]}><cylinderGeometry args={[.27,.21,.35,24]}/><meshStandardMaterial color="#858f90" metalness={.8} roughness={.24}/></mesh>)}</group>)}
    <mesh position={[0,.82,-.2]}><boxGeometry args={[2.6,.11,1.75]}/><meshStandardMaterial color="#b1b8b7" metalness={.85} roughness={.19}/></mesh>
    {[[-1,0],[1,0]].map(([x],i)=><mesh key={i} position={[x,.38,-.1]}><boxGeometry args={[.08,.85,.08]}/><meshStandardMaterial color="#777f7f" metalness={.8}/></mesh>)}
    <group ref={tablet} position={[0,1.5,0]} rotation={[-.12,0,0]}>
      <RoundedBox args={[1.96,1.26,.12]} radius={.08} smoothness={5}><meshStandardMaterial color="#c9d0d2" metalness={.72} roughness={.28}/></RoundedBox>
      <mesh position={[0,0,.067]} onClick={!entering?onEnter:undefined}>
        <planeGeometry args={[1.78,1.06]} /><meshStandardMaterial color="#152d42" emissive="#20425b" emissiveIntensity={.3}/></mesh>
      <Html position={[0,0,.075]} transform distanceFactor={1.4} occlude>
        <button className="dimension-tablet-screen" onClick={onEnter} disabled={entering} aria-label="Entrer dans DIMENSION">
          <span>DIMENSION</span><small>EVERY KITCHEN HAS A SOUNDTRACK</small><b>ENTER ↗</b>
        </button>
      </Html>
      <mesh position={[0,-.58,.071]}><sphereGeometry args={[.018,12,12]}/><meshBasicMaterial color="#f6b47d"/></mesh>
    </group>
    <ContactShadows position={[0,-.05,0]} opacity={.4} scale={9} blur={2.8} far={3}/>
  </>;
}
function WebGLAvailable() { try { const c=document.createElement('canvas'); return !!(c.getContext('webgl2')||c.getContext('webgl')); } catch {return false;} }
export default function KitchenIntro({onComplete}) {
  const [entering,setEntering]=useState(false);
  const [available]=useState(WebGLAvailable);
  const [reduced]=useState(()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  const start=()=>{if(entering){onComplete();return;}if(reduced||!available){onComplete();return;}setEntering(true);};
  return <section className="dimension-intro" aria-label="Entrée dans DIMENSION">
    {available&&!reduced&&<Canvas camera={{position:[3.1,2.5,5.8],fov:48}} dpr={[1,1.65]} gl={{antialias:true,powerPreference:'high-performance'}}>
      <Suspense fallback={null}><Kitchen onEnter={start} entering={entering}/></Suspense>
    </Canvas>}
    <div className="dimension-intro-overlay">
      <span className="dimension-eyebrow">THE KITCHEN / VOL. 001</span>
      <h1>DIMENSION<span>.</span></h1>
      <p>Every kitchen has a soundtrack.</p>
      <button onClick={start} disabled={entering}>{entering?'OPENING…':'ENTER DIMENSION ↗'}</button>
      <small>{available&&!reduced?'EXPLORE THE KITCHEN · TOUCH THE TABLET':'A MUSICAL SPACE AFTER THE NOISE'}</small>
    </div>
  </section>;
}