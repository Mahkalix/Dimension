import IntroEntry from "./IntroEntry";
import styles from "./opening.module.scss";
const errors = {
  auth: "Sign-in failed. Please try again.",
  session: "Your session expired. Please sign in again.",
};
export const dynamic = "force-dynamic";
export default async function Opening({ searchParams }) {
  const error = errors[(await searchParams).error];
  return (
    <main className={styles.entry}>
      <IntroEntry auto={!error}>
        <div className={styles.identity}>
          <a
            className={styles.signature}
            href="/player"
            aria-label="Open The Den"
          >
            <img
              className={styles.house}
              src="/brand/the-den-house.png"
              alt=""
              width="463"
              height="408"
            />
          </a>
          <h1 className={styles.wordmark}>
            <img
              src="/brand/the-den-wordmark.png"
              alt="The Den"
              width="452"
              height="76"
            />
          </h1>
        </div>
      </IntroEntry>
      <a
        className={styles.credit}
        href="https://github.com/mahkalix"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="@mahkalix on GitHub (opens a new tab)"
      >
        @mahkalix
      </a>
      {error && (
        <p role="alert">
          {error} <a href="/login">Sign in</a>
        </p>
      )}
    </main>
  );
}
