"use client";
import { useEffect } from "react";
export default function RemoteKeys() {
  useEffect(() => {
    document.documentElement.dataset.still =
      localStorage.getItem("dimension-still") || "0";
    function move(e) {
      if (
        e.defaultPrevented ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.target.matches?.("input,textarea,select")
      )
        return;
      const dialog = document.querySelector("dialog[open]");
      const preview=document.querySelector(".track-preview");
      if((e.key==="Escape"||e.key==="Backspace")&&preview){
        e.preventDefault();
        preview.querySelector(".return")?.click();
        return;
      }
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
          "button:not(:disabled),a[href],input:not(:disabled),summary",
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


