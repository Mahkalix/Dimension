"use client";
import { useEffect, useRef, useState } from "react";
import { prepareAvatar } from "../lib/avatar";
import Action from "./Action";
import styles from "./PlaylistEditor.module.scss";

export default function PlaylistEditor({ playlist, tracks, covers, onSave, onClose }) {
  const dialog = useRef(null);
  const [title, setTitle] = useState(playlist?.title || "");
  const [cover, setCover] = useState(playlist?.cover || covers[0]);
  const [selected, setSelected] = useState(playlist?.tracks || []);
  const [description, setDescription] = useState(playlist?.description || "");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { dialog.current.showModal(); }, []);
  const matches = tracks.filter(track => `${track.title} ${track.artist}`.toLowerCase().includes(query.toLowerCase()));
  function submit(event) {
    event.preventDefault();
    if (!title.trim()) { setError("Choose a name."); return; }
    try { onSave({ ...playlist, title: title.trim(), cover, description, tracks: selected }); }
    catch { setError("Could not save. Check that browser storage is available."); }
  }
  return <dialog ref={dialog} className={styles.dialog} onCancel={onClose} aria-labelledby="playlist-editor-title">
    <form onSubmit={submit}>
      <header><h2 id="playlist-editor-title">{playlist ? "Edit playlist" : "Create playlist"}</h2><Action onClick={onClose} aria-label="Close playlist editor">Close</Action></header>
      <label>Name<input autoFocus required maxLength={80} value={title} onChange={event => setTitle(event.target.value)} /></label>
      <fieldset><legend>Cover</legend><div className={styles.covers}>{covers.map(src => <button key={src} type="button" aria-label={`Choose cover ${covers.indexOf(src) + 1}`} aria-pressed={cover === src} onClick={() => setCover(src)}><img src={src} alt="" /></button>)}</div></fieldset>
      <label>Description<textarea maxLength={300} value={description} onChange={event => setDescription(event.target.value)} /></label>
      <img className={styles.preview} src={cover} alt="Playlist cover preview" />
      <label>Upload a photo<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={async event => {
        const file = event.target.files?.[0]; if (!file) return;
        setBusy(true); setError("");
        try { setCover(await prepareAvatar(file)); } catch (error) { setError(error.message); } finally { setBusy(false); }
      }} /></label>
      <small>JPG, PNG or WebP, up to 8 MB. Uploaded photos stay on this browser; shared copies use the generic cover.</small>
      <label>Find tracks<input type="search" value={query} onChange={event => setQuery(event.target.value)} /></label>
      <p>{selected.length} selected. Tracks play in the order you select them.</p>
      <div className={styles.tracks}>{matches.map(track => <label key={track.id}>
        <input type="checkbox" checked={selected.includes(track.id)} onChange={() => setSelected(current => current.includes(track.id) ? current.filter(id => id !== track.id) : [...current, track.id])} />
        <img src={track.art} alt="" /><span><b>{track.title}</b><small>{track.artist}</small></span>
      </label>)}{!matches.length && <p>No matching tracks.</p>}</div>
      {error && <p role="alert">{error}</p>}
      <footer><Action onClick={onClose}>Cancel</Action><Action type="submit" variant="primary" disabled={busy}>Save playlist</Action></footer>
      <small>Saved on this browser. Share a link to send a copy to someone else.</small>
    </form>
  </dialog>;
}
