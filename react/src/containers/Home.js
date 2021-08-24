import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";
import Nav from "react-bootstrap/Nav";
import "./Home.css";

export default function Home() {
  const { isAuthenticated } = useAppContext();
  function renderLander() {
    return (
      <div className="lander">
        <h3>UMCCR Samplesheet Check</h3>
        <Nav.Link onClick={() => Auth.federatedSignIn({ provider: "Google" })}>
          Please Login
        </Nav.Link>
      </div>
    );
  }

  function renderScripts() {
    return (
      <div>
        <LinkContainer to="/sample-sheet-checker">
          <ListGroup.Item action>
            <span className="font-weight-bold">Sample Sheet Checker</span>
          </ListGroup.Item>
        </LinkContainer>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderScripts() : renderLander()}
    </div>
  );
}
