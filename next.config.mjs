// Keep verification builds separate from a running development server.
export default { distDir: process.env.NEXT_BUILD_DIR || '.next' };
