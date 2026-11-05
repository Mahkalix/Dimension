export function normalizePlaylist(value, tracks, covers) {
  if (!value || typeof value.title !== "string" || !Array.isArray(value.tracks)) return null;
  const title = value.title.trim().slice(0, 80);
  const known = new Set(tracks.map(track => track.id));
  const ids = [...new Set(value.tracks.filter(id => known.has(id)))];
  if (!title || !ids.length || value.tracks.length > 200) return null;
  return {
    title, tracks: ids,
    cover: covers.includes(value.cover) ? value.cover : covers[0],
    alt: `${title} playlist cover`, imagePosition: "50% 50%", logoStyle: "badge",
  };
}

export function playlistShareHash(playlist) {
  return "#playlist=" + encodeURIComponent(JSON.stringify({
    title: playlist.title, tracks: playlist.tracks, cover: playlist.cover,
  }));
}

export function readSharedPlaylist(hash, tracks, covers) {
  if (!hash.startsWith("#playlist=") || hash.length > 20000) return null;
  try { return normalizePlaylist(JSON.parse(decodeURIComponent(hash.slice(10))), tracks, covers); }
  catch { return null; }
}
