import avatars from "../data/avatars.json";

export const defaultAvatar = "/solar-user-circle.svg";
export const avatarKey = (accountId) => `den-avatar:v1:${accountId}`;
export function validAvatar(value) {
  return typeof value === "string" && (
    value === defaultAvatar || avatars.some((avatar) => avatar.image === value) ||
    (value.length <= 400000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(value))
  );
}
export function readAvatar(accountId) {
  if (!accountId) return defaultAvatar;
  try {
    const value = localStorage.getItem(avatarKey(accountId));
    return validAvatar(value) ? value : defaultAvatar;
  } catch { return defaultAvatar; }
}
export function saveAvatar(accountId, value) {
  if (!accountId || !validAvatar(value)) throw new Error("Invalid profile photo.");
  localStorage.setItem(avatarKey(accountId), value);
  window.dispatchEvent(new Event("den-avatar-change"));
}

export async function prepareAvatar(file) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Choose a JPG, PNG or WebP image.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Choose an image smaller than 8 MB.");
  const image = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 320;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing is unavailable.");
    const edge = Math.min(image.width, image.height);
    context.fillStyle = "#202020";
    context.fillRect(0, 0, 320, 320);
    context.drawImage(image, (image.width-edge)/2, (image.height-edge)/2, edge, edge, 0, 0, 320, 320);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally { image.close(); }
}
