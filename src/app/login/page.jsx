import { getSession, configured } from "../../lib/identity";
import styles from "./login.module.scss";
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
  const returnTo = params.returnTo === "/account" ? "/account" : "/player";
  const user = (await getSession())?.user;
  const signup = params.mode === "signup";
  return (
    <main className={styles.entry}>
      <section className={styles.sheet} aria-label="Welcome to The Den">
        <div className={styles.content}>
          <div className={styles.brand}>
            <img className={styles.mark} src="/brand/the-den-house.png" alt="" width="48" height="44" />
            <img className={styles.wordmark} src="/brand/the-den-wordmark.png" alt="The Den" width="170" height="29" />
          </div>
          <h1>
            {user ? "Welcome back" : signup ? "Make yourself at home." : <>Your soundtrack.<br />Before service.<br />After hours.</>}
          </h1>
          {user ? (
            <>
              <p>Your music. Your own pace.</p>
              <div className={styles.account}>
                <img
                  className={styles.avatar}
                  src="/solar-user-circle.svg"
                  alt=""
                  width="44"
                  height="44"
                />
                <strong>{user.name || user.email || "The Den listener"}</strong>
                <a href="/auth/logout">Not you?</a>
              </div>
              <a className={styles.enter} href={returnTo}>
                Continue to The Den
              </a>
            </>
          ) : (
            <>
              {signup && <p>Create your account and settle into The Den.</p>}
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
                  {signup ? "Create account" : "Sign in"}
                </a>
              )}
              <div className={styles.invitation}>
                <p>{signup ? "Already part of The Den?" : "New to The Den?"}</p>
                <a
                href={
                  "/login?returnTo=" +
                  encodeURIComponent(returnTo) +
                  (signup ? "" : "&mode=signup")
                }
              >
                {signup
                  ? "Sign in"
                  : "Create an account"}
              </a>
              <a className={styles.guest} href="/player">Continue without an account</a>
              </div>
            </>
          )}
        </div>
        <aside className={styles.story}>
          <span>Before service. After hours.</span>
          <h2>
            A little room
            <br />
            for your soundtrack.
          </h2>
          <p>
            Pull up a chair and press play.
          </p>
        </aside>
      </section>
    </main>
  );
}
