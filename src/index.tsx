import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import config from "./config.ts";



Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: config.cognito.USER_POOL_ID,
        userPoolClientId: config.cognito.APP_CLIENT_ID,
        loginWith: {
          oauth: config.cognito.OAUTH,
        },
      },
    },
    API: {
      REST: {
        metadataSync: {
          endpoint: config.dataPortalAPI.API,
          region: config.apiGateway.REGION,
        },
        sscheckAPI: {
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION,
        },
      },
    },
  },
  {
    API: {
      REST: {
        headers: async () => {
          const authToken = (
            await fetchAuthSession()
          ).tokens?.idToken?.toString();
          return { Authorization: `${authToken!}` };
        },
      },
    },
  },
);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
