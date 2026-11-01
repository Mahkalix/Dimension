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
      <a className={styles.signature} href="/player" aria-label="Entrer dans The Den">
  <img className={styles.houseBody} src="/brand/the-den-house.png" alt="" />
  <img className={styles.houseFlames} src="/brand/the-den-house.png" alt="" />
  <span className={styles.inkSweep} aria-hidden="true" /><span className={styles.steam} aria-hidden="true" />
</a>
      <h1 className={styles.wordmark}><img src="/brand/the-den-wordmark.png" alt="The Den" width="300" height="52"/></h1>
      {error && (
        <p role="alert">
          {error} <a href="/profil">Profil</a>
        </p>
      )}
    </main>
  );
}





