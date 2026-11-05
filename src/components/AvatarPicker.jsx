"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Action from "./Action";
import avatars from "../data/avatars.json";
import { defaultAvatar, readAvatar, saveAvatar, prepareAvatar } from "../lib/avatar";
import styles from "./AvatarPicker.module.scss";

export default function AvatarPicker({ accountId }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => router.replace("/player"), 1200);
    return () => window.clearTimeout(timer);
  }, [saved, router]);
  const [selected, setSelected] = useState(defaultAvatar);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { setSelected(readAvatar(accountId)); }, [accountId]);
  const choose = (photo) => { setSelected(photo); setError(""); };
  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true); setError("");
    try { choose(await prepareAvatar(file)); }
    catch (err) { setError(err.message || "This image could not be opened."); }
    finally { setBusy(false); }
  }
  function save() {
    if (busy || saved) return;
    try { saveAvatar(accountId, selected); setError(""); setSaved(true); }
    catch { setError("Your photo could not be saved. Check that browser storage is available."); }
  }
  return <section className={styles.picker} aria-labelledby="photo-title">
    <div className={styles.preview}>
      <img src={selected} alt="Selected profile photo" width="96" height="96"
        style={{ filter: selected === defaultAvatar ? "brightness(0) invert(1)" : "none" }} />
      <div><h2 id="photo-title">Your profile photo</h2><p>Pick a character from The Bear, or bring your own photo.</p></div>
    </div>
    <div className={styles.actions}>
      <Action as="label" className={styles.upload}>Upload a photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={busy || saved} /></Action>
      <Action onClick={() => choose(defaultAvatar)} disabled={busy || saved}>Use default icon</Action>
    </div>
    <p className={styles.note}>JPG, PNG or WebP, up to 8 MB. Your photo is cropped to a square.</p>
    <div className={styles.gallery} aria-label="The Bear profile photos">
      {avatars.map(a => <button type="button" key={a.id} aria-pressed={selected === a.image} onClick={() => choose(a.image)} disabled={busy || saved}>
        <img src={a.image} alt="" width="72" height="72" loading="lazy" />
        <span>{a.name}</span>
      </button>)}
    </div>
    <div className={styles.footer}>
      <Action variant="primary" disabled={busy || saved} onClick={save}>{saved ? "✓ Saved" : busy ? "Preparing photo…" : "Save photo"}</Action>
      <p className={styles.note}>Saved for your account on this browser. Not synced across devices.</p>
    </div>
    {error && <p role="alert">{error}</p>}
  </section>;
}
