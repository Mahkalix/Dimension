import TheDen from "../../TheDen";
import { getSession, configured } from "../../lib/identity";
export const dynamic = "force-dynamic";
export default async function Player() {
  const session = await getSession(),
    u = session?.user;
  const profile = u
    ? { id: u.id, name: u.name || u.id, avatar: u.image || null }
    : null;
  return (
    <TheDen
      account={{
        connected: Boolean(profile),
        authConfigured: configured,
        name: profile?.name || null,
        spotify: profile,
      }}
    />
  );
}
