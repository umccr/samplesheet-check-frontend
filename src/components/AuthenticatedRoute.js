import React from "react";
import { Route } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
import { Auth } from "aws-amplify";
import Nav from "react-bootstrap/Nav";

import "./AuthenticatedRoute.css";

export default function AuthenticatedRoute({ children, ...rest }) {
  const { user } = useAppContext();
  return (
    <Route {...rest}>
      {user ? (
        children
      ) : (
        <div className="lander" >
          <h3>UMCCR Samplesheet Check</h3>
          <Nav.Link
            onClick={() => Auth.federatedSignIn({ provider: "Google" })}
          >
            Please Login
          </Nav.Link>
        </div>
      )}
    </Route>
  );
}
