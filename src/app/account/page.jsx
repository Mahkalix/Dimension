import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "../../lib/identity";
import styles from "./account.module.scss";
import Action from "../../components/Action";
import AvatarPicker from "../../components/AvatarPicker";
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
        <strong>{user.name || user.email || "The Den listener"}</strong>
        {user.email && user.name && user.name !== user.email && <span>{user.email}</span>}
        <span>
          {user.email_verified ? "Email verified" : "Email not verified"}
        </span>
        <AvatarPicker accountId={user.sub} />
        <nav className={styles.actions} aria-label="Account actions">
          <Action href="/player">Back to music</Action>
          <Action href="/auth/logout">Sign out</Action>
        </nav>
      </section>
    </main>
  );
}
