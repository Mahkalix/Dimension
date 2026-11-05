"use client";

import { useState } from "react";
import styles from "./Dedication.module.scss";

export default function Dedication() {
  const [paused, setPaused] = useState(false);
  return (
    <aside className={styles.story} lang="fr" aria-label="Dédicace" data-paused={paused}>
      <div className={styles.stills} aria-hidden="true">
        <img src="/images/dedication/carmy-sydney.jpg" alt="" />
        <img src="/images/dedication/sunnnliwx-fan-art.jpg" alt="" />
      </div>
      <div className={styles.gif} aria-hidden="true" />
      <div className={styles.dedication}>
        <span>Un peu de musique, beaucoup d’affection.</span>
        <h2>Pour un ami<br />que j’aime fort.</h2>
        <p>Un petit coin pour les jours où tu te prends pour Carmy. Pose le tablier, lance un morceau et souffle un peu. Ici, t’as rien à prouver.</p>
        <a href="https://github.com/Mahkalix" target="_blank" rel="noopener noreferrer" aria-label="Fait par @Mahkalix (GitHub, nouvel onglet)">Fait par @Mahkalix ↗</a>
        <a className={styles.artCredit} href="https://www.instagram.com/sunnnliwx/?hl=fr" target="_blank" rel="noopener noreferrer" aria-label="Fan art par @sunnnliwx (Instagram, nouvel onglet)">Fan art : @sunnnliwx ↗</a>
        <button className={styles.motionToggle} onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? "Animer l’image" : "Mettre l’image en pause"}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={paused ? "M7 4v16l13-8z" : "M6 4h4v16H6zm8 0h4v16h-4z"} />
          </svg>
        </button>
      </div>
    </aside>
  );
}
