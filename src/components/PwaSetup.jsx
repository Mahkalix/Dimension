"use client";
import { useEffect } from "react";
export default function PwaSetup() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(error => console.warn('Offline setup unavailable:', error.name));
  }, []);
  return null;
}
