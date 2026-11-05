import TheDen from "../../TheDen";
import { getSession } from "../../lib/identity";

export const dynamic = "force-dynamic";

export default async function Player() {
  const session = await getSession();
  return <TheDen signedIn={Boolean(session?.user)} accountId={session?.user?.sub} />;
}
