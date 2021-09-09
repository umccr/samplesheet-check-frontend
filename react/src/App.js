import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { Auth, Hub } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";

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
      .catch(() => console.log("Not signed in"));
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
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              UMCCR
            </Navbar.Brand>
          </LinkContainer>
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
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
