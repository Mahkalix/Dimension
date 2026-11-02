import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "../../lib/identity";
import styles from "../opening.module.scss";
export const dynamic = "force-dynamic";
export default async function Account() {
  const session = await getSession();
  if (!session?.user) {
    const expired = (await cookies()).has("__session");
    redirect("/login?returnTo=%2Faccount" + (expired ? "&error=session" : ""));
  }
  const user = session.user;
  return (
    <main className={styles.entry}>
      <section className={styles.sheet}>
        <h1>Account</h1>
        <img
          src={user.picture || "/brand/house-180.png"}
          width="80"
          height="80"
          alt="Account avatar"
        />
        <strong>{user.name || user.email || "The Den listener"}</strong>
        {user.email && <span>{user.email}</span>}
        <span>
          {user.email_verified ? "Email verified" : "Email not verified"}
        </span>
        <a href="/auth/logout">Sign out</a>
        <a href="/player">Back to music</a>
      </section>
    </main>
  );
}
