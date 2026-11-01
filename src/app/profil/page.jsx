import SolarIcon from "../../components/SolarIcon";
import { auth } from "../../lib/identity";
import styles from "../opening.module.scss";
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
              <button><SolarIcon name="link-minimalistic-2"/>Dissocier Spotify</button>
            </form>
          </>
        ) : (
          <a href="/api/spotify/connect"><img className="solar-icon" src="/spotify.svg" alt=""/>Connecter Spotify</a>
        )}
        <a href={s ? "/auth/logout" : "/auth/login"}><SolarIcon name={s?"logout-2":"login-2"}/>{s ? "Se déconnecter" : "Se connecter"}</a>
        <a href="/player"><SolarIcon name="arrow-left"/>Retour au lecteur</a>
      </section>
    </main>
  );
}
export const dynamic = "force-dynamic";


