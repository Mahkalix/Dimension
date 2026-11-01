"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
export default function IntroEntry({ children, auto = true }) {
  const router = useRouter(),
    root = useRef(null);
  useEffect(() => {
    if (!auto) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      const animations = root.current?.getAnimations({ subtree: true }) || [];
      Promise.all(animations.map((a) => a.finished.catch(() => {}))).then(
        () => {
          if (!cancelled) router.replace("/player");
        },
      );
    }, 50);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [auto, router]);
  return <div ref={root}>{children}</div>;
}
