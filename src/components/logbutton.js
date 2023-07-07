import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/logbutton.css";
import arrow from "../assets/svg/arrow-right.svg";

const LogButton = () => {
  const { logout, loginWithRedirect, isAuthenticated, getAccessTokenSilently } =
    useAuth0();

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "dev-lebgjej6s0dj2ob8.eu.auth0.com";

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: "read:current_user",
          },
        });

        // Enregistrement du token d'authentification dans le stockage local
        localStorage.setItem("token", accessToken);
      } catch (e) {
        console.log(e.message);
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout({
      returnTo: window.location.origin,
    });
  };

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <>
      <div className="btn-container">
        {isAuthenticated ? (
          <div>
            <button className="btn-out" onClick={handleLogout}>
              <span className="text">Log out</span>
              <div className="icon-container">
                <div className="icon icon--left">
                  <img className="arrow" src={arrow} alt="arrow" />
                </div>
                <div className="icon icon--right">
                  <img className="arrow" src={arrow} alt="arrow" />
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div>
            <button className="btn-in" onClick={handleLogin}>
              <span className="text">Log in</span>
              <div className="icon-container">
                <div className="icon icon--left">
                  <img className="arrow" src={arrow} alt="arrow" />
                </div>
                <div className="icon icon--right">
                  <img className="arrow" src={arrow} alt="arrow" />
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LogButton;
