import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import AppRoutes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { getCurrentUser, signInWithRedirect, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signedIn":
          getCurrentUser().then((userData) => setUser(userData));
          break;
        case "signedOut":
          setUser(null);
          break;
        default:
      }
    });

    getCurrentUser()
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => console.debug("Not signed in"));
  }, []);

  return (
    <div className="App container py-3">
      <Navbar
        collapseOnSelect
        bg="light"
        expand="md"
        className="bg-body-tertiary mb-3 py-2 px-3"
      >
        <Navbar.Brand href="/" className="fw-bold text-muted">
          UMCCR
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {user ? (
            <Nav.Link onClick={signOut}>Logout</Nav.Link>
          ) : (
            <Nav.Link
              onClick={() => signInWithRedirect({ provider: "Google" })}
            >
              Login
            </Nav.Link>
          )}
        </Navbar.Collapse>
      </Navbar>

      <AppContext.Provider value={{ user }}>
        <AppRoutes />
      </AppContext.Provider>
    </div>
  );
}

export default App;
