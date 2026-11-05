"use client";
import { useEffect, useState } from "react";
import avatars from "../data/avatars.json";
import { defaultAvatar, readAvatar, saveAvatar, prepareAvatar } from "../lib/avatar";
import styles from "./AvatarPicker.module.scss";

export default function AvatarPicker({ accountId }) {
  const [selected, setSelected] = useState(defaultAvatar);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { setSelected(readAvatar(accountId)); }, [accountId]);
  const choose = (photo) => { setSelected(photo); setMessage(""); setError(""); };
  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true); setError(""); setMessage("");
    try { choose(await prepareAvatar(file)); }
    catch (err) { setError(err.message || "This image could not be opened."); }
    finally { setBusy(false); }
  }
  function save() {
    try { saveAvatar(accountId, selected); setError(""); setMessage("Profile photo saved."); }
    catch { setError("Your photo could not be saved. Check that browser storage is available."); }
  }
  const matches = avatars.filter(a => a.name.toLowerCase().includes(query.toLowerCase().trim()));
  return <section className={styles.picker} aria-labelledby="photo-title">
    <div className={styles.preview}>
      <img src={selected} alt="Selected profile photo" width="96" height="96"
        style={{ filter: selected === defaultAvatar ? "brightness(0) invert(1)" : "none" }} />
      <div><h2 id="photo-title">Your profile photo</h2><p>Pick someone from The Bear, or bring your own photo.</p></div>
    </div>
    <div className={styles.actions}>
      <label className={styles.upload}>Upload a photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={busy} /></label>
      <button type="button" onClick={() => choose(defaultAvatar)} disabled={busy}>Use default icon</button>
    </div>
    <p className={styles.note}>JPG, PNG or WebP, up to 8 MB. Your photo is cropped to a square.</p>
    <label className={styles.search}>Find a character<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Carmy, Sydney, Richie…" /></label>
    <div className={styles.gallery} aria-label="The Bear profile photos">
      {matches.map(a => <button type="button" key={a.id} aria-pressed={selected === a.image} onClick={() => choose(a.image)} disabled={busy}>
        <img src={a.image} alt="" width="72" height="72" loading="lazy" />
        <span>{a.name}</span>
      </button>)}
    </div>
    {!matches.length && <p>No character matches your search.</p>}
    <p className={styles.note}>Character and cast portraits via <a href="https://www.tvmaze.com/shows/54198/the-bear/cast" target="_blank" rel="noreferrer">TVmaze</a>. Carmy photo provided for The Den.</p>
    <div className={styles.footer}>
      <button className={styles.save} type="button" disabled={busy} onClick={save}>{busy ? "Preparing photo…" : "Save photo"}</button>
      <p className={styles.note}>Saved for your account on this browser. Not synced across devices.</p>
    </div>
    <p role="status">{message}</p>
    {error && <p role="alert">{error}</p>}
  </section>;
}
