import "../styles/main.scss";
import RemoteKeys from "./RemoteKeys";
export const metadata = {
  title: "DIMENSION — AFTER THE NOISE",
  description: "Lecteur musical DIMENSION",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/brand/the-den-favicon.ico", type: "image/x-icon" },
      { url: "/brand/the-den-favicon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/brand/the-den-favicon.ico",
    apple: "/brand/house-180.png",
  },
  openGraph: {
    title: "DIMENSION — AFTER THE NOISE",
    images: ["/brand/house-512.png"],
  },
  metadataBase: new URL(process.env.APP_BASE_URL || "http://127.0.0.1:3000"),
};
export const viewport = { themeColor: "#efefed" };
export default function Layout({ children }) {
  return (
    <html lang="fr">
      <body>
        <RemoteKeys />
        {children}
      </body>
    </html>
  );
}

