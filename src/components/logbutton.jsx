import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/logbutton.css";

const LogButton = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  const handleLogin = () => {
    // Ne rien faire si l'utilisateur est déjà connecté
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <div className="btn-container">
      {!isAuthenticated && (
        <button className="btn-in" to="/Accueil" onClick={handleLogin}>
          <span className="text">Log in</span>
        </button>
      )}

      {isAuthenticated && (
        <button className="btn-out" onClick={handleLogout}>
          <span className="text">Log out</span>
        </button>
      )}
    </div>
  );
};

export { LogButton };
