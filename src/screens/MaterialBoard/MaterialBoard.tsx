import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { contrastRatio } from '../../lib/contrast';
import styles from './MaterialBoard.module.css';

type Backlight = 'low' | 'medium' | 'high';
const MENU_ITEMS = [
  { label: 'Playlists', submenu: true },
  { label: 'Extras', submenu: true },
  { label: 'Settings', submenu: true },
  { label: 'Shuffle Songs', submenu: false },
  { label: 'Backlight', submenu: false },
] as const;

const ENGRAVED = '#0d0f12';
const MATTE_ROW = '#c7cbd0';
const SELECTED_SAFE = '#b0b5bc';

export function MaterialBoard() {
  const [chrome, setChrome] = useState(1);
  const [backlight, setBacklight] = useState<Backlight>('high');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const menuRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const updateScale = () => setScale(Math.min(window.innerWidth / 1280, window.innerHeight / 720));
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((current) => (current + 1) % MENU_ITEMS.length);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((current) => (current - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => { menuRefs.current[selectedIndex]?.focus(); }, [selectedIndex]);

  const ratios = useMemo(
    () => MENU_ITEMS.map((_, index) =>
      contrastRatio(ENGRAVED, index === selectedIndex ? SELECTED_SAFE : MATTE_ROW)
    ),
    [selectedIndex]
  );

  const stageStyle: CSSProperties & { '--board-scale': number; '--chrome': number } = {
    '--board-scale': scale,
    '--chrome': chrome,
  };

  return (
    <main className={styles.viewport}>
      <section className={styles.stage} data-backlight={backlight} style={stageStyle} aria-label="Planche de matériaux DIMENSION étape 1">
        <header className={styles.header}>
          <p className={styles.eyebrow}>DIMENSION / MATERIAL BOARD / 01</p>
          <div className={styles.wordmarks}>
            <div className={styles.wordmarkSample}><strong className={`chrome-wordmark ${styles.archivo}`}>DIMENSION</strong><span className={styles.fontMeta}>ARCHIVO EXPANDED · 900</span></div>
            <div className={styles.wordmarkSample}><strong className={`chrome-wordmark ${styles.unbounded}`}>DIMENSION</strong><span className={styles.fontMeta}>UNBOUNDED · 900</span></div>
            <div className={styles.wordmarkSample}><strong className={`chrome-wordmark ${styles.montserrat}`}>DIMENSION</strong><span className={styles.fontMeta}>MONTSERRAT · 900</span></div>
          </div>
        </header>

        <div className={styles.grid}>
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}><span>01 / MATERIALS</span><small>GLOBAL TOKENS</small></h2>
            <div className={styles.materialList}>
              <div className={styles.materialRow}><div className={`material-polished ${styles.swatch}`}><span className="chrome-text-safe">CHROME</span></div><div className={styles.materialCopy}><strong>Chrome poli</strong><span>Horizon 50 %, gloss supérieur, bevel court.</span></div></div>
              <div className={styles.materialRow}><div className={`material-steel ${styles.swatch}`}>INOX</div><div className={styles.materialCopy}><strong>Inox brossé mat</strong><span>SVG turbulence anisotrope + repli PNG 3.2 Ko.</span></div></div>
              <div className={styles.materialRow}><div className={`material-circular ${styles.swatch}`}>◉</div><div className={styles.materialCopy}><strong>Chrome circulaire</strong><span>Conic-gradient alterné pour contrôles ronds.</span></div></div>
              <div className={styles.materialRow}><div className={`material-well ${styles.swatch}`}>03:42</div><div className={styles.materialCopy}><strong>Puits noir</strong><span>#05070d, chanfrein chrome, lueur bleue douce.</span></div></div>
              <div className={styles.materialRow}><div className={`material-steel material-engraved ${styles.swatch}`}>GRAVÉ</div><div className={styles.materialCopy}><strong>Lettrage gravé</strong><span>#0d0f12 + reflet typographique inférieur.</span></div></div>
            </div>
            <div className={styles.textureCheck}><div className={`texture-svg-only ${styles.textureTile}`}>SVG feTurbulence</div><div className={`texture-png-only ${styles.textureTile}`}>PNG fallback · 3.2 Ko</div></div>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}><span>02 / COMPONENTS</span><small>NO APP LOGIC</small></h2>
            <div className={styles.controlStack}>
              <div className={`material-steel ${styles.titleBar}`}>MATERIALS</div>
              <button type="button" className={`material-polished focus-specular ${styles.primaryButton}`}><span>VALIDER</span><i className="focus-sweep" aria-hidden="true"/></button>
              <div className={styles.circularDemo}>
                <button type="button" className={`material-circular ${styles.circularButton}`} aria-label="Exemple de bouton circulaire">▶</button>
                <div className={styles.chromeControl}>
                  <label htmlFor="chrome-range">INTENSITÉ DU CHROME</label>
                  <div className={styles.chromeLine}><input id="chrome-range" type="range" min="0" max="1" step="0.01" value={chrome} onChange={(event)=>setChrome(Number(event.target.value))}/><output className={`material-well ${styles.chromeValue}`}>{chrome.toFixed(2)}</output></div>
                </div>
              </div>
              <div className={`material-well ${styles.wellDemo}`}><div><strong>AFTER THE NOISE</strong><span>DIMENSION</span></div><b className={styles.wellTime}>03:42</b></div>
              <fieldset className={styles.backlight}><legend>RÉTROÉCLAIRAGE</legend><div className={styles.backlightOptions}>{(['low','medium','high'] as const).map((level)=><button key={level} type="button" aria-pressed={backlight===level} onClick={()=>setBacklight(level)}>{level.toUpperCase()}</button>)}</div></fieldset>
            </div>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}><span>03 / REFERENCE MENU</span><small>↑ ↓ ONLY</small></h2>
            <div className={styles.menuShell}>
              <div className={`material-steel ${styles.menuTitle}`}>MUSIC</div>
              <div className={styles.menu} role="listbox" aria-label="Menu iPod reference">
                {MENU_ITEMS.map((item,index)=>{
                  const selected=selectedIndex===index;
                  const ratioLabel=`${ratios[index].toFixed(1)}:1 AAA`;
                  return <button key={item.label} ref={(node)=>{menuRefs.current[index]=node}} type="button" role="option" aria-selected={selected} onFocus={()=>setSelectedIndex(index)} className={selected?`material-polished focus-specular ${styles.menuRow}`:`material-steel ${styles.menuRow}`}>
                    <span className={selected?`chrome-text-safe ${styles.menuLabel}`:styles.menuLabel}>{item.label}</span>
                    <span className={styles.ratio}>{ratioLabel}</span>
                    <span className={styles.chevron} aria-hidden="true">{item.submenu?' >'.trim():''}</span>
                    {selected&&<i className="focus-sweep" aria-hidden="true"/>}
                  </button>;
                })}
                <div className={styles.positionRail} aria-hidden="true"><div className={styles.positionThumb}/></div>
              </div>
            </div>
            <p className={styles.menuNote}>Worst case measured against #b0b5bc: 9.3:1. The hard 50 % horizon stays visible outside the label and is softened beneath selected text.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
