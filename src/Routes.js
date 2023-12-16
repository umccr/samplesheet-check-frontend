import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import SampleSheetChecker from "./containers/SampleSheetChecker";

import AuthenticatedRoute from "./components/AuthenticatedRoute";

// Declaring Routes
// Route: can be access regardless auth/unauth
// AuthenticatedRoute: must be autheneticated to access
// UnauthenticatedRoute: must be Unauthenticated to access
export default function AppRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route
        exact
        path="/sample-sheet-checker"
        element={
          <AuthenticatedRoute>
            <SampleSheetChecker />
          </AuthenticatedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
