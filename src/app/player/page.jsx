import TheDen from "../../TheDen";
import { auth } from "../../lib/identity";
export const dynamic = "force-dynamic";
export default async function Player() {
  const session = await auth?.getSession();
  const account = {
    connected: Boolean(session),
    name: session?.user.name || session?.user.email || null,
    spotify: session?.spotify || null,
  };
  return <TheDen account={account} />;
}
