import React, { useState, useEffect } from "react";
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
        <h1>UMCCR Samplesheet Check</h1>
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
  // TODO: change on authentication
  return (
    <div className="Home">
      {isAuthenticated ? renderScripts() : renderLander()}
    </div>
  );
}
