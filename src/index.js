import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "../src/style/index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const domain =
  process.env.REACT_APP_AUTH0_DOMAIN || "dev-s4cqy56nmufsd1nf.us.auth0.com";
const clientId =
  process.env.REACT_APP_AUTH0_CLIENT_ID || "wu1hMC3jEzhtP8te5ChZ08FpuCfV8C17";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>
);
