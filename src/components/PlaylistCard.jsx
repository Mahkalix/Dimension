import styles from "./PlaylistCard.module.scss";

export default function PlaylistCard({ playlist, onOpen, onPlay, className = "" }) {
  return <article className={styles.card + " " + className}>
    <button className={styles.open} onClick={() => onOpen(playlist)} aria-label={"Open " + playlist.title}>
      <span className={styles.cover}>
        <img src={playlist.cover} alt="" style={{ objectPosition: playlist.imagePosition }} />
        <span className={styles.brand} aria-hidden="true" />
      </span>
      <strong>{playlist.title}</strong><small>{playlist.tracks.length} tracks</small>
    </button>
    {!!playlist.tracks.length && <button className={styles.play} onClick={() => onPlay(playlist)} aria-label={"Play " + playlist.title}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7Z" fill="currentColor" /></svg></button>}
  </article>;
}
