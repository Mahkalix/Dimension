"use client";
import { useEffect, useState } from "react";
import styles from "../opening.module.css";
export default function Settings() {
  const [motion, setMotion] = useState(false);
  useEffect(
    () => setMotion(localStorage.getItem("dimension-still") === "1"),
    [],
  );
  return (
    <main className={styles.frame}>
      <section className={styles.sheet}>
        <h1>Paramètres</h1>
        <button
          aria-pressed={motion}
          onClick={() => {
            localStorage.setItem("dimension-still", motion ? "0" : "1");
            document.documentElement.dataset.still = motion ? "0" : "1";
            setMotion(!motion);
          }}
        >
          Réduire les animations · {motion ? "Oui" : "Non"}
        </button>
        <a href="/player">Retour au lecteur</a>
      </section>
    </main>
  );
}
