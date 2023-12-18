import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { signInWithRedirect } from "aws-amplify/auth";
import Nav from "react-bootstrap/Nav";
import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useAppContext();
  function renderLander() {
    return (
      <div className="lander">
        <h3>UMCCR Samplesheet Check</h3>
        <Nav.Link onClick={() => signInWithRedirect({ provider: "Google" })}>
          Please Login
        </Nav.Link>
      </div>
    );
  }

  function renderScripts() {
    return (
      <div>
        <ListGroup.Item as={Link} to="/sample-sheet-checker" action>
          <span className="fw-bold">Sample Sheet Checker</span>
        </ListGroup.Item>
      </div>
    );
  }

  return <div className="Home">{user ? renderScripts() : renderLander()}</div>;
}
