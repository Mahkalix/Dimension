import { auth } from "../../lib/identity";
import styles from "../opening.module.css";
export default async function Profile() {
  const s = await auth?.getSession();
  return (
    <main className={styles.frame}>
      <section className={styles.sheet}>
        <h1>Profil</h1>
        <strong>{s?.user.name || s?.user.email || "Déconnecté"}</strong>
        {s?.spotify ? (
          <>
            <img
              width="72"
              src={s.spotify.avatar || "/brand/dimension-180.png"}
              alt=""
            />
            <b>{s.spotify.name}</b>
            <span>{s.spotify.id}</span>
            <form method="post" action="/api/spotify/disconnect">
              <button>Dissocier Spotify</button>
            </form>
          </>
        ) : (
          <a href="/api/spotify/connect">Connecter Spotify</a>
        )}
        <a href="/">Accueil et connexion</a>
        <a href="/player">Retour au lecteur</a>
      </section>
    </main>
  );
}
export const dynamic = "force-dynamic";
