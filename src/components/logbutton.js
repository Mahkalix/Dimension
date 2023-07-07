import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/logbutton.css";
import arrow from "../assets/svg/arrow-right.svg";
import { useParams } from "react-router-dom";

const LogButton = () => {
  const params = useParams();

  const { logout, loginWithRedirect, isAuthenticated, getAccessTokenSilently } =
    useAuth0();

  useEffect(() => {
    const redirectUser = async () => {
      if (isAuthenticated) {
        const domain = "dev-lebgjej6s0dj2ob8.eu.auth0.com";
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        });

        localStorage.setItem("token", accessToken);
      }
    };

    redirectUser();
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleRedirect = () => {
    const destinationId = params.id; // Récupérer l'ID à partir des paramètres d'URL
    const destinationUrl = `/destination/${destinationId}`; // Construire l'URL de destination en utilisant l'ID récupéré

    window.location.href = destinationUrl; // Rediriger l'utilisateur vers l'URL de destination
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout({
      returnTo: window.location.origin,
    });
  };

  const handleLogin = () => {
    loginWithRedirect();
    handleRedirect();
  };

  return (
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
  );
};

export default LogButton;
