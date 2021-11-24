import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import "./SampleSheetChecker.css";

import ShowError from "../components/Error";

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

  // State for error
  const [isError, setIsError] = useState(false);
  function handleError(value) {
    setIsError(value);
  }

  // Reset Result Response
  function resetResponse() {
    setValidationResponse({});
    setIsValidated(false);
  }

  function resetFileRef(){
    fileRef.current = null
    setIsFileSelected(false)
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
        setIsLoading(false);
        setIsError(true);
        resetResponse();
        resetFileRef();
      });
  }
  function displayLog(logFile) {
    const arrayInput = logFile.split("\n");
    return (
      <>
        <b>Logs:</b>
        {arrayInput.map((val, index) => (
          <Row key={index}>{val}</Row>
        ))}
      </>
    );
  }
  function displayErrorMessage(errorMessage) {
    return (
      <>
        <b>Error: </b> {errorMessage} <br />
      </>
    );
  }

  function download(text) {
    // parameter take a text to be downloaded
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", "log.txt");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function displayResult(validationResponse) {
    if (isValidated) {
      // Parse data from response
      const alertVariant =
        validationResponse.check_status === "PASS" ? "success" : "danger";
      const errorMessage = validationResponse.error_message;
      const logFile = validationResponse.log_file;

      return (
        <Row>
          <Col xs={12}>
            <Alert variant={alertVariant}>
              <Alert.Heading>
                Check Result: <b>{validationResponse.check_status}</b>
              </Alert.Heading>
              {errorMessage || logFile ? (
                <>
                  <hr />
                  {errorMessage ? displayErrorMessage(errorMessage) : <></>}
                  {logFile ? displayLog(logFile) : <></>}
                </>
              ) : (
                <></>
              )}
            </Alert>
            {logFile ? (
              <div className="d-grid">
                <Button
                  variant="outline-secondary"
                  block
                  onClick={() => download(logFile)}
                >
                  Download logs as a txt file
                </Button>
              </div>
            ) : (
              <></>
            )}
          </Col>
        </Row>
      );
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
        <ShowError handleError={handleError} isError={isError} />
      </Container>
    </div>
  );
}
