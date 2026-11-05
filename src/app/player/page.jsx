import TheDen from "../../TheDen";
import { getSession } from "../../lib/identity";
export default async function Player() {
  const session = await getSession();
  return (
    <TheDen
      profile={
        session?.user
          ? { name: session.user.name, picture: session.user.picture }
          : null
      }
    />
  );
}
