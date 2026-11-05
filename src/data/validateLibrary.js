const canonical = (value) =>
  value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en");
export function validateLibrary(tracks, playlists) {
  const ids = new Set(),
    recordings = new Set();
  for (const track of tracks) {
    if (!track.id || !track.title || !track.artist)
      throw new Error("A track is missing its identity.");
    const recording = canonical(track.title) + "\0" + canonical(track.artist);
    if (ids.has(track.id) || recordings.has(recording))
      throw new Error("Duplicate track: " + track.id);
    if (!track.url || !track.sourceUrl || !track.licenseUrl || !track.license)
      throw new Error("Missing audio source or license: " + track.id);
    if (!Number.isFinite(track.duration) || track.duration <= 0)
      throw new Error("Invalid duration: " + track.id);
    ids.add(track.id);
    recordings.add(recording);
  }
  const playlistIds = new Set();
  for (const playlist of playlists) {
    if (playlistIds.has(playlist.id))
      throw new Error("Duplicate playlist: " + playlist.id);
    playlistIds.add(playlist.id);
    if (
      new Set(playlist.tracks).size !== playlist.tracks.length ||
      playlist.tracks.some((id) => !ids.has(id))
    )
      throw new Error("Invalid playlist tracks: " + playlist.id);
  }
  return tracks;
}
