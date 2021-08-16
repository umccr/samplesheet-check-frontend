import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import "./Home.css";

export default function Home() {
  const { isAuthenticated } = useAppContext();
  function renderLander() {
    return (
      <div className="lander">
        <h1>UMCCR Script</h1>
        <a href="/login" className="text-muted">
          Please Login
        </a>
      </div>
    );
  }

  function renderScripts() {
    return (
      <div>
        <a href="/sample-sheet-checker">
          <ListGroup.Item action>
            <span className="font-weight-bold">Sample Sheet Checker</span>
          </ListGroup.Item>
        </a>
      </div>
    );
  }
  // TODO: change on authentication
  return <div className="Home">{true ? renderScripts() : renderLander()}</div>;
}
