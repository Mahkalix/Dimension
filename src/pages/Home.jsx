import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/Home.css";
import Main from "../components/main";
import NoConnexionMain from "../components/noconnexionmain";

const Home = () => {
  const { isAuthenticated } = useAuth0();
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !refreshed) {
      setRefreshed(true);

      const timeoutId = setTimeout(() => {
        window.location.reload();
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isAuthenticated, refreshed]);

  return (
    <>
      {!isAuthenticated && <NoConnexionMain />}
      {isAuthenticated && <Main />}
    </>
  );
};

export default Home;
