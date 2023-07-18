import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Footer from "../components/footer";
import Header from "../components/header";
import "../style/Home.css";
import Main from "../components/main";
import NoConnexionMain from "../components/noconnexionmain";

const Home = () => {
  const { isAuthenticated } = useAuth0();
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !refreshed) {
      setRefreshed(true);
      // Perform any necessary actions on initial login

      // Example: Refresh the page after 1 second
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
      <Header />
      {!isAuthenticated && <NoConnexionMain />}
      {isAuthenticated && <Main />}
      <Footer />
    </>
  );
};

export default Home;
