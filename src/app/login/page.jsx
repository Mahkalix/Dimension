import { redirect } from "next/navigation";
import { getSession, configured } from "../../lib/identity";
import styles from "../opening.module.scss";
export const dynamic = "force-dynamic";
const messages = {
  config:
    "Sign-in is not configured yet. You can still listen without an account.",
  auth: "Sign-in was cancelled or could not be completed. Please try again.",
  network:
    "We could not reach the sign-in service. Check your connection and try again.",
  session: "Your session has expired. Please sign in again.",
};
export default async function Login({ searchParams }) {
  const params = await searchParams;
  const returnTo = params.returnTo === "/player" ? "/player" : "/account";
  if ((await getSession())?.user) redirect(returnTo);
  const signup = params.mode === "signup";
  return (
    <main className={styles.entry}>
      <section className={styles.sheet}>
        <img
          className={styles.mark}
          src="/brand/the-den-house.png"
          alt="The Den"
        />
        <h1>{signup ? "Create account" : "Sign in"}</h1>
        <p>
          Use your email and password. Music is always available without an
          account.
        </p>
        {(messages[params.error] || !configured) && (
          <p role="alert">{messages[params.error] || messages.config}</p>
        )}
        {configured && (
          <a
            className={styles.enter}
            href={
              "/auth/login?returnTo=" +
              encodeURIComponent(returnTo) +
              (signup ? "&screen_hint=signup" : "")
            }
          >
            {signup ? "Sign up with email" : "Sign in with email"}
          </a>
        )}
        <a
          href={
            "/login?returnTo=" +
            encodeURIComponent(returnTo) +
            (signup ? "" : "&mode=signup")
          }
        >
          {signup ? "Already have an account? Sign in" : "Create an account"}
        </a>
        <a href="/player">Back to music</a>
      </section>
    </main>
  );
}
