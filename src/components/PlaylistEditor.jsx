"use client";
import { useEffect, useRef, useState } from "react";
import { prepareAvatar } from "../lib/avatar";
import { genericCover } from "../lib/playlists";
import Action from "./Action";
import styles from "./PlaylistEditor.module.scss";

export default function PlaylistEditor({ playlist, onSave, onClose }) {
  const dialog = useRef(null);
  const nameInput = useRef(null);
  const uploadInput = useRef(null);
  const [title, setTitle] = useState(playlist?.title || "");
  const [cover, setCover] = useState(playlist?.cover || genericCover);
  const [description, setDescription] = useState(playlist?.description || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { dialog.current.showModal(); nameInput.current?.select(); }, []);
  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    setBusy(true); setError("");
    try { setCover(await prepareAvatar(file)); }
    catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  function submit(event) {
    event.preventDefault();
    if (busy) return;
    if (!title.trim()) { setError("Choose a name."); return; }
    try { onSave({ ...playlist, title: title.trim(), cover, description, tracks: playlist?.tracks || [] }); }
    catch { setError("Could not save. Check that browser storage is available."); }
  }
  return <dialog ref={dialog} className={styles.dialog} onCancel={onClose} aria-labelledby="playlist-editor-title">
    <form onSubmit={submit}>
      <header><h2 id="playlist-editor-title">Edit details</h2><button type="button" className={styles.close} onClick={onClose} aria-label="Close playlist editor">×</button></header>
      <div className={styles.fields}>
        <div className={styles.artwork}>
          <button type="button" className={styles.cover} disabled={busy} onClick={() => uploadInput.current?.click()} aria-label="Choose playlist photo">
            <img src={cover} alt="Playlist cover" /><span>{busy ? "Preparing photo…" : "Choose photo"}</span>
          </button>
          <input ref={uploadInput} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} />
        </div>
        <div className={styles.details}>
          <label>Name<input ref={nameInput} autoFocus required maxLength={80} value={title} onChange={event => setTitle(event.target.value)} /></label>
          <label>Description<textarea placeholder="Add an optional description" maxLength={300} value={description} onChange={event => setDescription(event.target.value)} /></label>
        </div>
      </div>
      {error && <p role="alert">{error}</p>}
      <footer>{cover !== genericCover && <button type="button" className={styles.remove} disabled={busy} onClick={() => setCover(genericCover)}>Remove photo</button>}<Action className={styles.save} type="submit" variant="primary" disabled={busy}>Save</Action></footer>
      <small>JPG, PNG or WebP, up to 8 MB. Choose an image you have permission to use. Uploaded photos stay on this browser; shared copies use the generic cover.</small>
    </form>
  </dialog>;
}
