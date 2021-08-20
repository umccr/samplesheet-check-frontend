import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import SampleSheetChecker from "./containers/SampleSheetChecker";

import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

// Declaring Routes
// Route: can be access regardless auth/unauth
// AuthenticatedRoute: must be autheneticated to access
// UnauthenticatedRoute: must be Unauthenticated to access
export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <AuthenticatedRoute exact path="/sample-sheet-checker">
        <SampleSheetChecker />
      </AuthenticatedRoute>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
