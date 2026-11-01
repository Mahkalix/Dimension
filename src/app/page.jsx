import { auth } from "../lib/identity";
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
  const session = await auth?.getSession(),
    profile = session?.spotify,
    error = errors[(await searchParams).error];
  return (
    <main className={styles.frame}>
      <section className={styles.sheet}>
        <img className={styles.mark} src="/brand/dimension-mark.svg" alt="" />
        <h1>DIMENSION</h1>
        <p>AFTER THE NOISE</p>
        <a className={styles.enter} href="/player">
          Entrer
        </a>
        <div className={styles.accounts}>
          <div>
            <strong>Compte DIMENSION</strong>
            <span>
              {session?.user.name ||
                session?.user.email ||
                (session ? "Connecté" : "Déconnecté")}
            </span>
            <a href={session ? "/auth/logout" : "/auth/login"}>
              {session ? "Se déconnecter" : "Se connecter"}
            </a>
          </div>
          <div>
            <strong>Spotify</strong>
            {profile?.avatar && (
              <img src={profile.avatar} width="40" height="40" alt="" />
            )}
            <span>
              {profile
                ? profile.name + " · " + profile.id
                : "Aucun compte associé"}
            </span>
            {profile ? (
              <form method="post" action="/api/spotify/disconnect">
                <button>Dissocier Spotify</button>
              </form>
            ) : (
              <a href="/api/spotify/connect">Connecter Spotify</a>
            )}
          </div>
        </div>
        {error && <p role="alert">{error}</p>}
      </section>
    </main>
  );
}
