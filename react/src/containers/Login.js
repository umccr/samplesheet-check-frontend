import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { Auth } from "aws-amplify";
import "./Login.css";
import { onError } from "../libs/errorLib";
import { useFormFields } from "../libs/hooksLib";

export default function Login() {
  const { setIsAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      // await Auth.signIn(email, password);
      setIsAuthenticated(true)
      alert("Logged in");
      setIsLoading(false);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }


    
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
        >
          Login
        </LoaderButton>
      </Form>
    </div>
  );
}