import IntroEntry from "./IntroEntry";
import styles from "./opening.module.scss";
const errors = {
  config: "Authentification non configurée.",
  auth: "Échec de la connexion Auth0.",
  session: "Session expirée. Reconnectez-vous.",
  state: "Demande Spotify expirée ou invalide.",
  consent: "Autorisation Spotify annulée.",
  spotify: "Impossible de récupérer votre profil Spotify.",
  "spotify-config": "Connexion Spotify non configurée.",
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
            aria-label="Entrer dans The Den"
          >
            <img
              className={styles.house}
              src="/brand/the-den-house.png"
              alt=""
              width="463"
              height="408"
            />
            <span className={styles.steam} aria-hidden="true" />
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
        aria-label="@mahkalix sur GitHub (nouvel onglet)"
      >
        @mahkalix
      </a>
      {error && (
        <p role="alert">
          {error} <a href="/profil">Profil</a>
        </p>
      )}
    </main>
  );
}
