import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/logbutton.css";
import Logout from "../assets/log-out.svg";

const LogButton = ({ IsLogged, setIsLogged }) => {
  const { logout } = useAuth0();
  const { loginWithRedirect } = useAuth0();

  const { user, getAccessTokenSilently } = useAuth0();

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
        localStorage.setItem("login", true);
        setIsLogged(true);
      } catch (e) {
        console.log(e.message);
      }
    };

    getUserMetadata();
  }, [setIsLogged, getAccessTokenSilently, user?.sub]);

  return (
    <div className="Log">
      {IsLogged ? (
        <button
          className="btn-out"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("login");
            setIsLogged(false);
            logout({
              logoutParams: {
                returnTo: "http://localhost:3000/",
              },
            });
          }}
        >
          <img className="logo-logout" src={Logout} alt="logp-logout" />
          Log Out
        </button>
      ) : (
        <button className="btn-in" onClick={() => loginWithRedirect()}>
          Log In
        </button>
      )}
    </div>
  );
};

export default LogButton;
