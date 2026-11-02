"use client";
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import SolarIcon from "./SolarIcon";
export default function SpotifyAccountButton({
  connected = false,
  enabled = true,
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  const act = async () => {
    if (!enabled) {
      window.location.assign("/profil?error=Configuration");
      return;
    }
    setBusy(true);
    setError(false);
    try {
      if (connected) await signOut({ callbackUrl: "/player" });
      else await signIn("spotify", { callbackUrl: "/player" });
    } catch {
      setError(true);
      setBusy(false);
    }
  };
  return (
    <>
      <button disabled={busy} onClick={act}>
        {connected ? (
          <SolarIcon name="logout-2" />
        ) : (
          <img className="solar-icon" src="/spotify.svg" alt="" />
        )}
        {busy
          ? "Un instant…"
          : connected
            ? "Se déconnecter"
            : "Continuer avec Spotify"}
      </button>
      {error && <p role="alert">Connexion impossible. Réessayez.</p>}
    </>
  );
}
