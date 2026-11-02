import SolarIcon from "../../components/SolarIcon";
import SpotifyAccountButton from "../../components/SpotifyAccountButton";
import { getSession, configured } from "../../lib/identity";
import styles from "../opening.module.scss";
export const dynamic = "force-dynamic";
export default async function Profile({ searchParams }) {
  const session = await getSession(),
    u = session?.user,
    { error } = await searchParams;
  return (
    <main className={styles.frame}>
      <section className={styles.sheet}>
        <h1>Mon profil</h1>
        {u ? (
          <>
            <img
              src={u.image || "/brand/house-180.png"}
              width="80"
              height="80"
              alt=""
            />
            <strong>{u.name || u.id}</strong>
            <span>Spotify · {u.id}</span>
          </>
        ) : (
          <>
            <p>Votre compte Spotify suffit pour rejoindre The Den.</p>
            <p>La sélection musicale est accessible sans compte.</p>
          </>
        )}
        <SpotifyAccountButton connected={Boolean(u)} enabled={configured} />
        {error && (
          <p role="alert">
            {error === "Configuration"
              ? "La connexion Spotify est en cours de configuration. Vous pouvez écouter sans compte."
              : "La connexion Spotify a échoué ou a été annulée. Réessayez."}
          </p>
        )}
        <a href="/player">
          <SolarIcon name="arrow-left" />
          Retour à la musique
        </a>
      </section>
    </main>
  );
}
