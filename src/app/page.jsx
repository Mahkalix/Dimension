import styles from "./opening.module.css";
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
      <div className={styles.signature} aria-hidden="true">
  <img className={styles.houseBody} src="/brand/the-den-house.png" alt="" />
  <img className={styles.houseFlames} src="/brand/the-den-house.png" alt="" />
  <span className={styles.inkSweep} />
</div>
      <h1 className={styles.wordmark}><img src="/den-2.svg" alt="The Den" width="300" height="75"/></h1>
      <a className={styles.entryButton} href="/player">
        Entrer
      </a>
      {error && (
        <p role="alert">
          {error} <a href="/profil">Profil</a>
        </p>
      )}
    </main>
  );
}


