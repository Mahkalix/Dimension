"use client";
import styles from "../opening.module.scss";
export default function Error({ reset }) {
  return (
    <main className={styles.entry}>
      <section className={styles.sheet}>
        <h1>Sign-in unavailable</h1>
        <p role="alert">Check your connection and try again.</p>
        <button onClick={reset}>Retry</button>
        <a href="/player">Back to music</a>
      </section>
    </main>
  );
}
