import React from "react";
import { useAppContext } from "../libs/contextLib";
import { signInWithRedirect } from "aws-amplify/auth";
import Nav from "react-bootstrap/Nav";

import "./AuthenticatedRoute.css";

export default function AuthenticatedRoute({ children, ...rest }) {
  const { user } = useAppContext();

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="lander">
      <h3>UMCCR Samplesheet Check</h3>
      <Nav.Link onClick={() => signInWithRedirect({ provider: "Google" })}>
        Please Login
      </Nav.Link>
    </div>
  );
}
