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
        sscheck: {
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION,
        },
        metadataSync: {
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION,
        },
      },
    },
    // API: {
    //   REST: {
    //     YourAPIName: {
    //       endpoint: config.apiGateway.URL,
    //       region: config.apiGateway.REGION,
    //     },
    //   },
    // endpoints: [
    //   {
    //     name: "samplesheet-check",
    //     endpoint: config.apiGateway.URL,
    //     region: config.apiGateway.REGION,
    //     custom_header: async () => {
    //       return {
    //         Authorization: `Bearer ${(await Auth.currentSession())
    //           .getIdToken()
    //           .getJwtToken()}`,
    //       };
    //     },
    //   },
    //   {
    //     name: "metadata-sync-api",
    //     endpoint: config.dataPortalAPI.API,
    //     region: config.dataPortalAPI.REGION,
    //     custom_header: async () => {
    //       return {
    //         Authorization: `Bearer ${(await Auth.currentSession())
    //           .getIdToken()
    //           .getJwtToken()}`,
    //       };
    //     },
    //   },
    // ],
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
