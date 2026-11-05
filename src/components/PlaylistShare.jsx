import styles from "./PlaylistShare.module.scss";
export default function PlaylistShare({ onCopy }) {
  return <details className={styles.share}>
    <summary><span aria-hidden="true">↥</span> Share <span className={styles.arrow} aria-hidden="true">›</span></summary>
    <div className={styles.submenu}><button onClick={onCopy}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M8 8h12v12H8zM4 16V4h12" /></svg>Copy playlist link</button></div>
  </details>;
}
