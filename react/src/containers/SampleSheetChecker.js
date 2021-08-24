import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./SampleSheetChecker.css";

const constant = {
  MAX_ATTACHMENT_SIZE: 512000000, //in bytes
  DEBUG_OPTIONS: ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"], // logging level in python
};

export default function SampleSheetChecker() {
  const [isLoading, setIsLoading] = useState(false);

  // Files variable
  const fileRef = useRef(null);
  const [isFileSelected, setIsFileSelected] = useState(false);

  // Response Variable
  const [validationResponse, setValidationResponse] = useState({});
  const [isValidated, setIsValidated] = useState(false);

  const [logLevel, setLogLevel] = useState("ERROR");

  // Reset Result Response
  function resetResponse() {
    setValidationResponse({});
    setIsValidated(false);
  }

  // Handle Log Level Changes
  function logLevelChangeHandler(event) {
    resetResponse();
    setLogLevel(event.target.value);
  }

  // Handle File Changes
  function fileChangeHandler(event) {
    fileRef.current = event.target.files[0];
    if (fileRef.current) {
      setIsFileSelected(true);
      resetResponse();
    } else {
      setIsFileSelected(false);
    }
  }

  // Handle Submit Button
  async function handleSubmit(event) {
    event.preventDefault();

    // File Validation Size (Does not allow more than 512mb)
    if (
      fileRef.current &&
      fileRef.current.size > constant.MAX_ATTACHMENT_SIZE
    ) {
      alert(
        `File must be smaller than ${
          constant.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", fileRef.current);
    formData.append("logLevel", logLevel);
    const dataRequest = {
      headers: {
        "content-type": "multipart/form-data",
      },
      body: formData,
    };

    API.post("spreadsheet-check", "/", dataRequest)
      .then((response) => {
        setValidationResponse(response);
        setIsValidated(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }

  function displayResult(validationResponse) {
    if (isValidated) {
      if (validationResponse.checkStatus === "PASS") {
        return (
          <Row>
            <Col xs={12}>
              <Alert variant="success">
                The CSV file has passed the validation
              </Alert>
            </Col>
          </Row>
        );
      } else {
        const log_file_array = validationResponse.log_file.split("\n");
        return (
          <Row>
            <Col xs={12}>
              <Alert variant="danger">
                <Alert.Heading>
                  <b>Error: </b>
                  {validationResponse.errorMessage}. [See logs below]
                </Alert.Heading>
                <hr />

                {log_file_array.map((val, index) => (
                  <Row key={index}>{val}</Row>
                ))}
              </Alert>
            </Col>
          </Row>
        );
      }
    }
  }

  return (
    <div className="SampleSheet">
      <Container>
        <Row>
          <Col xs={12}>
            <h3>A Sample Sheet Check </h3>
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Logger Option</Form.Label>
            <Form.Control
              value={logLevel}
              onChange={logLevelChangeHandler}
              as="select"
              label="debug option input"
              custom
            >
              {constant.DEBUG_OPTIONS.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload a csv file to be checked</Form.Label>
            <Form.File
              id="custom-file"
              label={isFileSelected ? fileRef.current.name : "File input"}
              onChange={fileChangeHandler}
              custom
            />
          </Form.Group>
        </Form>

        <Row>
          <LoaderButton
            variant="primary"
            type="submit"
            onClick={handleSubmit}
            disabled={!isFileSelected}
            isLoading={isLoading}
            block
          >
            Check File
          </LoaderButton>
        </Row>

        {displayResult(validationResponse)}
      </Container>
    </div>
  );
}
