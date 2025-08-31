import "./index.css";

import App from "./App.jsx";
import Auth0CartMergeWrapper from "./components/Auth0CartMergeWrapper";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import store from "./redux/store";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_API_IDENTIFIER;



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <Auth0Provider
          domain={domain}
          clientId={clientId}
          authorizationParams={{
            audience,
            redirect_uri: window.location.origin,
          }}
        >
          <Auth0CartMergeWrapper />
        </Auth0Provider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
