import styles from './MaterialBoard.module.css';

const samples = [
  ['Chrome poli', 'polished'], ['Inox brossé', 'steel'],
  ['Chrome circulaire', 'disc'], ['Puits noir', 'well'], ['Lettrage gravé', 'engraving'],
] as const;
const entries = ['Playlists', 'Extras', 'Settings', 'Shuffle Songs', 'Backlight'];

export function MaterialBoard() {
  return <main className={styles.viewport}><article className={styles.sheet}>
    <header className={styles.heading}><h1>Planche de matériaux</h1><span>ÉTUDE 01 / 06</span></header>
    <ul className={styles.samples}>{samples.map(([label, material]) =>
      <li key={label}><div className={styles.sample}><i className={material} aria-hidden="true">{material === 'well' ? '03:42' : material === 'engraving' ? 'Aa' : ''}</i></div>{label}</li>
    )}</ul>
    <div className={styles.lower}>
      <section className={styles.controls} aria-label="Spécimens des commandes">
        <h2>Commandes</h2>
        <div className={styles.control}><span>Bouton</span><button className="disc" disabled aria-label="Lecture, spécimen"><i className={styles.play}/></button></div>
        <div className={styles.control}><span>Curseur</span><div className={styles.track} role="img" aria-label="Curseur de volume à mi-course"><i className="disc"/></div></div>
      </section>
      <section aria-label="Menu de référence"><h2 className={styles.title}>Music</h2>
        <ul className={styles.menu}>{entries.map((label, i) => <li key={label} className={i === 0 ? 'polished' : 'steel'}>
          <span>{label}</span>{i < 3 && <b aria-hidden="true">›</b>}
        </li>)}</ul>
      </section>
    </div>
  </article></main>;
}
