import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import AppRoutes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { Auth, Hub } from "aws-amplify";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const [user, setUser] = useState(null);

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "cognitoHostedUI":
          getUser().then((userData) => setUser(userData));
          break;
        case "signOut":
          setUser(null);
          break;
        case "signIn_failure":
        case "cognitoHostedUI_failure":
        default:
      }
    });

    getUser().then((userData) => {
      setUser(userData);
    });
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then((userData) => userData)
      .catch(() => console.debug("Not signed in"));
  }

  async function handleLogout() {
    await Auth.signOut({ global: true });
    setUser(false);
  }

  useEffect(() => {
    async function onLoad() {
      try {
        await Auth.currentSession();
        getUser().then((userData) => setUser(userData));
      } catch (e) {
        if (e !== "No current user") {
        }
      }

      setIsAuthenticating(false);
    }
    onLoad();
  }, []);

  return (
    !isAuthenticating && (
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
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            ) : (
              <Nav.Link
                onClick={() => Auth.federatedSignIn({ provider: "Google" })}
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
    )
  );
}

export default App;
