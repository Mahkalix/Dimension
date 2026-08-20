import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/Home.css";
import Main from "../components/main";
import NoConnexionMain from "../components/noconnexionmain";

const Home = () => {
  const { isAuthenticated } = useAuth0();

  return (
    isAuthenticated ? <Main /> : <NoConnexionMain />
  );
};

export default Home;
