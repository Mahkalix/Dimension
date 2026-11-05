export const genericCover = "/images/playlists/generic.svg";
const isUpload = value => typeof value === "string" && value.length <= 400000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(value);
export function normalizePlaylist(value, tracks, covers, allowUpload = true) {
  if (!value || typeof value.title !== "string" || !Array.isArray(value.tracks)) return null;
  const title = value.title.trim().slice(0, 80);
  const known = new Set(tracks.map(track => track.id));
  const ids = [...new Set(value.tracks.filter(id => known.has(id)))];
  if (!title || (value.tracks.length > 0 && !ids.length) || value.tracks.length > 200) return null;
  return {
    title, tracks: ids,
    description: typeof value.description === "string" ? value.description.trim().slice(0, 300) : "",
    cover: value.cover === genericCover || covers.includes(value.cover) || (allowUpload && isUpload(value.cover)) ? value.cover : genericCover,
    alt: `${title} playlist cover`, imagePosition: "50% 50%", logoStyle: "badge",
  };
}

export function playlistShareHash(playlist) {
  return "#playlist=" + encodeURIComponent(JSON.stringify({
    title: playlist.title, description: playlist.description, tracks: playlist.tracks, cover: isUpload(playlist.cover) ? genericCover : playlist.cover,
  }));
}

export function readSharedPlaylist(hash, tracks, covers) {
  if (!hash.startsWith("#playlist=") || hash.length > 20000) return null;
  try { return normalizePlaylist(JSON.parse(decodeURIComponent(hash.slice(10))), tracks, covers, false); }
  catch { return null; }
}
