import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "../src/style/index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain="dev-lebgjej6s0dj2ob8.eu.auth0.com"
    clientId="7wLRQRjPWURMPvrq3CLViNhPaIf1rRmM"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://dev-lebgjej6s0dj2ob8.eu.auth0.com/api/v2/",
      scope: "read:current_user update:current_user_metadata",
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>
);
