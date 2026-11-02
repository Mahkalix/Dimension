import styles from "./opening.module.scss";
export default function Loading() {
  return (
    <main className={styles.entry} role="status" aria-label="Starting up">
      <img
        className={styles.signature}
        src="/brand/the-den-house.png"
        alt="The Den"
      />
      <progress className={styles.charge} aria-label="Loading" />
    </main>
  );
}
