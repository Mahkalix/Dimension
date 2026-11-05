"use client";

import { useState } from "react";
import styles from "./login.module.scss";

export default function Dedication() {
  const [paused, setPaused] = useState(false);
  return (
    <aside className={styles.story} lang="fr" aria-label="Dédicace" data-paused={paused}>
      <div className={styles.gif} aria-hidden="true" />
      <div className={styles.dedication}>
        <span>Un peu de musique, beaucoup d’affection.</span>
        <h2>Pour un ami<br />que j’aime fort.</h2>
        <p>Un petit coin pour les morceaux qu’on partage, les longues journées et les moments qui restent. Ce lieu, c’est pour toi.</p>
        <a href="https://github.com/Mahkalix" target="_blank" rel="noopener noreferrer" aria-label="Fait par @Mahkalix (GitHub, nouvel onglet)">Fait par @Mahkalix ↗</a>
        <button className={styles.motionToggle} onClick={() => setPaused(!paused)} aria-pressed={paused}>
          {paused ? "Animer l’image" : "Mettre l’image en pause"}
        </button>
      </div>
    </aside>
  );
}
