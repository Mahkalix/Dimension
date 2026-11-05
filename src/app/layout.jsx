import "../styles/main.scss";
import "@fontsource-variable/archivo";
import PwaSetup from "../components/PwaSetup";
import RemoteKeys from "./RemoteKeys";
export const metadata = {
  title: "The Den",
  description: "Your soundtrack. Before service. After hours.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "The Den", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/brand/the-den-favicon.ico?v=3", type: "image/x-icon" },
      { url: "/brand/the-den-favicon.png?v=3", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/brand/the-den-favicon.ico?v=3",
    apple: "/brand/house-180.png",
  },
  openGraph: {
    title: "The Den",
    images: ["/brand/house-512.png"],
  },
  metadataBase: new URL(process.env.APP_BASE_URL || "http://127.0.0.1:3000"),
};
export const viewport = { themeColor: "#142134" };
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <RemoteKeys />
        <PwaSetup />
        {children}
      </body>
    </html>
  );
}
