import React from "react";
import { useAuth } from "../auth/AuthProvider";
import "../style/Home.css";
import Main from "../components/main";
import NoConnexionMain from "../components/noconnexionmain";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <main aria-busy="true"><p role="status">Restoring your session…</p></main>;
  return isAuthenticated ? <Main /> : <NoConnexionMain />;
}
