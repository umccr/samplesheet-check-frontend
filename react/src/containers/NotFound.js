import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="NotFound text-center">
      <h3>Sorry, page not found!</h3>
      <LinkContainer to="/">
        <Nav.Link>
          Click to homepage
        </Nav.Link>
        
      </LinkContainer>
    </div>
  );
}