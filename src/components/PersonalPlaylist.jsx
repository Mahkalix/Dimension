"use client";
import { useState } from "react";
import PlaylistShare from "./PlaylistShare";
import PlaylistActions from "./PlaylistActions";
import styles from "./PersonalPlaylist.module.scss";

export default function PersonalPlaylist({ playlist, tracks, onEdit, onUpdate, onDelete, onShare, onPlay, onQueue }) {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const selected = playlist.tracks.map(id => tracks.find(track => track.id === id));
  const matches = search.trim() ? tracks.filter(track => !playlist.tracks.includes(track.id) && `${track.title} ${track.artist}`.toLowerCase().includes(search.toLowerCase())).slice(0, 20) : [];
  function update(ids) {
    try { onUpdate({ ...playlist, tracks: ids }); setError(""); }
    catch { setError("Could not save changes. Check browser storage."); }
  }
  function move(index, direction) {
    const ids = [...playlist.tracks];
    [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
    update(ids);
  }
  return <section className={styles.page} aria-label={playlist.title}>
    <header className={styles.hero}>
      <button className={styles.cover} onClick={onEdit} aria-label="Change playlist photo"><img src={playlist.cover} alt="" /><span>Choose a photo</span></button>
      <div><small>Your playlist</small><button className={styles.title} onClick={onEdit} aria-label="Edit playlist name"><h2>{playlist.title}</h2></button>
        {playlist.description && <p>{playlist.description}</p>}<small>{selected.length} tracks · Saved on this browser</small></div>
    </header>
    <div className={styles.content}>
      <PlaylistActions onPlay={onPlay} disabled={!selected.length}>
        <button onClick={onEdit}>Name and details</button>
        <button disabled={!selected.length} onClick={onQueue}>Add to Up next</button>
        <PlaylistShare onCopy={onShare} />
        <button onClick={onDelete}>Delete playlist</button>
      </PlaylistActions>
      {selected.map((track, index) => <div className={styles.row} key={track.id}><img src={track.art} alt="" /><span><b>{track.title}</b><small>{track.artist}</small></span><button disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move ${track.title} up`}>↑</button><button disabled={index === selected.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${track.title} down`}>↓</button><button onClick={() => update(playlist.tracks.filter(id => id !== track.id))} aria-label={`Remove ${track.title}`}>Remove</button></div>)}
      <div className={styles.find}><h3>Let’s find something for your playlist</h3><label>Find tracks<input type="search" placeholder="Search songs or artists" value={search} onChange={event => setSearch(event.target.value)} /></label>
        {matches.map(track => <div className={styles.row} key={track.id}><img src={track.art} alt="" /><span><b>{track.title}</b><small>{track.artist}</small></span><button onClick={() => update([...playlist.tracks, track.id])} aria-label={`Add ${track.title}`}>Add</button></div>)}
        {search.trim() && !matches.length && <p>No more matching tracks to add.</p>}
      </div>
      {error && <p role="alert">{error}</p>}
    </div>
  </section>;
}
