import "./index.css";

import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_API_IDENTIFIER;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience,
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
