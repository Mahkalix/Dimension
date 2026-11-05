import { useRef } from "react";
import styles from "./PlaylistActions.module.scss";

export default function PlaylistActions({ onPlay, disabled, children }) {
  const menu = useRef(null);
  return <div className={styles.actions}>
    <button className={styles.play} onClick={onPlay} disabled={disabled} aria-label="Play playlist"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7Z" /></svg></button>
    <details ref={menu} onKeyDown={event => { if (event.key === "Escape") { menu.current.open = false; menu.current.querySelector("summary").focus(); event.stopPropagation(); } }}>
      <summary aria-label="Playlist options">•••</summary>
      <div className={styles.menu} onClick={event => { if (event.target.closest("button:not(:disabled)")) menu.current.open = false; }}>{children}</div>
    </details>
  </div>;
}
