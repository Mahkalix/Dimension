"use client";
import { useEffect } from "react";
export default function RemoteKeys() {
  useEffect(() => {
    document.documentElement.dataset.still =
      localStorage.getItem("dimension-still") || "0";
    function move(e) {
      if (
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.target.matches?.("input,textarea,select")
      )
        return;
      const dialog = document.querySelector("dialog[open]");
      if (
        (e.key === "Escape" || e.key === "Backspace") &&
        !dialog &&
        location.pathname !== "/"
      ) {
        e.preventDefault();
        location.assign("/");
        return;
      }
      if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key))
        return;
      const nodes = [
        ...(dialog || document).querySelectorAll(
          "button:not(:disabled),a[href],input:not(:disabled)",
        ),
      ].filter((n) => n.getClientRects().length);
      if (!nodes.length) return;
      e.preventDefault();
      const i = nodes.indexOf(document.activeElement);
      nodes[
        i < 0
          ? 0
          : (i +
              (["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : -1) +
              nodes.length) %
            nodes.length
      ].focus();
    }
    document.addEventListener("keydown", move);
    return () => document.removeEventListener("keydown", move);
  }, []);
  return null;
}
