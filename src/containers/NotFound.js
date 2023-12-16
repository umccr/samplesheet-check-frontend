import React from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="NotFound text-center">
      <h3>Sorry, page not found!</h3>
      <Nav.Link as={Link} to={"/"}>
        Click to homepage
      </Nav.Link>
    </div>
  );
}
