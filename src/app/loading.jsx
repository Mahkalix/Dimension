import styles from "./opening.module.css";
export default function Loading() {
  return (
    <main className={styles.entry} role="status" aria-label="Allumage">
      <img
        className={styles.signature}
        src="/brand/the-den-house.png"
        alt="The Den"
      />
      <progress className={styles.charge} aria-label="Chargement" />
    </main>
  );
}

