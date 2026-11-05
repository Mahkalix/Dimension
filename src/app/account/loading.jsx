import styles from "../opening.module.scss";
export default function Loading() {
  return (
    <main className={styles.entry}>
      <section className={styles.sheet} role="status">
        <img className={styles.mark} src="/brand/the-den-house.svg" alt="" />
        <p>Checking your session…</p>
      </section>
    </main>
  );
}
