import tracks from "./selection.json";
import playlists from "./playlists.json";
import { validateLibrary } from "./validateLibrary";
// Validation runs whenever the data module is loaded, including the build.
export default validateLibrary(tracks, playlists);
