"use client";
import { useEffect, useState } from "react";
import { defaultAvatar, readAvatar } from "../lib/avatar";

export default function AccountAvatar({ accountId, size = 38, className }) {
  const [photo, setPhoto] = useState(defaultAvatar);
  useEffect(() => {
    const refresh = () => setPhoto(readAvatar(accountId));
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("den-avatar-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("den-avatar-change", refresh);
    };
  }, [accountId]);
  return <img src={photo} alt="" width={size} height={size} className={className}
    onError={() => setPhoto(defaultAvatar)}
    style={{ width: size, height: size, flexShrink: 0, borderRadius: "50%", objectFit: "cover", filter: photo === defaultAvatar ? "brightness(0) invert(1)" : "none" }} />;
}
