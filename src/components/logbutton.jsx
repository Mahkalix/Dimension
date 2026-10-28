import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import "../style/logbutton.css";

export function LogButton() {
  const auth = useAuth();
  const dialog = useRef(null);
  const inFlight = useRef(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const run = async (action, fallback) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true); setError(""); setNotice("");
    try { await action(); }
    catch { setError(fallback); }
    finally { inFlight.current = false; setBusy(false); }
  };
  const submit = (event) => {
    event.preventDefault();
    if (!auth.isConfigured) return;
    run(async () => {
      if (step === "email") {
        await auth.sendCode(email.trim());
        setStep("code"); setCooldown(30);
        setNotice("Check your inbox for your sign-in code.");
      } else {
        await auth.completeLogin(code.trim());
        dialog.current.close(); setCode("");
      }
    }, step === "email" ? "We could not send your code. Check your email address and try again later."
      : "We could not sign you in. Check the code, or request a new one if it has expired.");
  };
  return (
    <div className="btn-container">
      <button type="button" className={auth.isAuthenticated ? "btn-out" : "btn-in"}
        disabled={auth.isLoading || busy} onClick={() => {
          if (auth.isAuthenticated) {
            run(auth.logout, "We could not sign you out. Please try again.");
          } else {
            setError(""); setNotice(""); setCode(""); setStep("email");
            dialog.current.showModal();
          }
        }}>
        {auth.isLoading ? "Loading…" : auth.isAuthenticated ? "Log out" : "Log in"}
      </button>
      {auth.isAuthenticated && error && <p role="alert">{error}</p>}
      <dialog ref={dialog} className="auth-dialog" aria-labelledby="auth-title"
        onCancel={(event) => { if (busy) event.preventDefault(); }}>
        <button className="auth-close" type="button" aria-label="Close sign-in" disabled={busy}
          onClick={() => dialog.current.close()}>×</button>
        <h2 id="auth-title">Welcome to Dimension</h2>
        {!auth.isConfigured ? <p role="status">Sign-in is temporarily unavailable. Please try again later.</p> : (
          <form onSubmit={submit}>
            <p>{step === "email" ? "Sign in or create an account with a code sent to your email."
              : `Enter the code sent to ${email.trim()}.`}</p>
            {step === "email" ? (
              <label>Email address<input type="email" autoComplete="email" required maxLength={254}
                value={email} disabled={busy} onChange={(event) => setEmail(event.target.value)} /></label>
            ) : (
              <label>Sign-in code<input type="text" inputMode="numeric" autoComplete="one-time-code"
                required pattern="[0-9]{4,8}" minLength={4} maxLength={8} value={code} disabled={busy}
                onChange={(event) => setCode(event.target.value)} /></label>
            )}
            {error && <p role="alert">{error}</p>}
            {notice && <p role="status">{notice}</p>}
            <button className="btn-in" type="submit" disabled={busy}>
              {busy ? "Please wait…" : step === "email" ? "Send code" : "Verify and sign in"}
            </button>
            {step === "code" && <div className="auth-actions">
              <button type="button" disabled={busy || cooldown > 0} onClick={() => run(async () => {
                await auth.resendCode(); setCooldown(30); setNotice("A new code has been sent.");
              }, "We could not resend your code. Please try again later.")}>
                {cooldown ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
              <button type="button" disabled={busy} onClick={() => {
                setStep("email"); setCode(""); setError(""); setNotice("");
              }}>Change email</button>
            </div>}
          </form>
        )}
      </dialog>
    </div>
  );
}
