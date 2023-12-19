import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { download, sscheckFetchApi } from "../utils";

// AWS
import "./SampleSheetChecker.css";
import SyncMetadataRow from "../components/SyncMetadataRow";

import ShowError from "../components/Error";

const constant = {
  MAX_ATTACHMENT_SIZE: 512000000, //in bytes
  DEBUG_OPTIONS: ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"], // logging level in python
};

export default function SampleSheetChecker() {
  const [isLoading, setIsLoading] = useState(false);

  // Files variable
  const [fileSelected, setFileSelected] = useState(false);

  // Response Variable
  const [validationResponse, setValidationResponse] = useState({});
  const [isValidated, setIsValidated] = useState(false);

  const [logLevel, setLogLevel] = useState("ERROR");

  // State for error
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  function handleError(value) {
    setIsError(value);
  }

  // Reset Result Response
  function resetResponse() {
    setValidationResponse({});
    setIsValidated(false);
  }

  function resetFrom() {
    document.getElementById("samplesheet-form").reset();
    resetResponse();
  }

  // Handle Log Level Changes
  function logLevelChangeHandler(event) {
    resetResponse();
    setLogLevel(event.target.value);
  }

  // Handle File Changes
  function fileChangeHandler(event) {
    if (event.target.files[0]) {
      setFileSelected(event.target.files[0]);
      resetResponse();
    } else {
      setFileSelected(null);
    }
  }

  // Handle Submit Button
  async function handleSubmit(event) {
    event.preventDefault();

    // File Validation Size (Does not allow more than 512mb)
    if (fileSelected && fileSelected.size > constant.MAX_ATTACHMENT_SIZE) {
      alert(
        `File must be smaller than ${
          constant.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`,
      );
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", fileSelected);
    formData.append("logLevel", logLevel);

    try {
      const rawRes = await sscheckFetchApi({
        method: "post",
        additionalHeader: {},
        body: formData,
      });
      const jsonRes = await rawRes.json();

      setValidationResponse(jsonRes);
      setIsValidated(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      setErrorMessage(error.toString());
      resetFrom();
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
        <hr />
        <Row>
          <Col xs={12}>
            <SyncMetadataRow />
          </Col>
        </Row>

        <hr />
        <Row>
          <Col xs={12}>
            <Form id="samplesheet-form" onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Logger Option</Form.Label>
                <Form.Control
                  value={logLevel}
                  onChange={logLevelChangeHandler}
                  as="select"
                  disabled={isLoading}
                >
                  {constant.DEBUG_OPTIONS.map((item, idx) => (
                    <option key={idx} value={item}>
                      {item}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group id="formFile" className="mb-3">
                <Form.Label>Upload a csv file to be checked</Form.Label>
                <Form.Control
                  id="custom-file"
                  type="file"
                  onChange={fileChangeHandler}
                  disabled={isLoading}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <LoaderButton
              variant="primary"
              type="submit"
              onClick={handleSubmit}
              disabled={!fileSelected}
              isLoading={isLoading}
            >
              Check File
            </LoaderButton>
          </Col>
        </Row>

        {isValidated && (
          <Row>
            <DisplayResult validationResponse={validationResponse} />
          </Row>
        )}
        {/* {displayResult(validationResponse)} */}
        <ShowError
          handleError={handleError}
          isError={isError}
          errorMessage={errorMessage}
        />
      </Container>
    </div>
  );
}

// Helper function to display results
function DisplayResult({ validationResponse }) {
  // Parse data from response
  const alertVariant =
    validationResponse.check_status === "PASS" ? "success" : "danger";
  const errorMessage = validationResponse.error_message;
  const logFile = validationResponse.log_file;

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
              onClick={() => download(logFile)}
            >
              Download logs as a txt file
            </Button>
          </div>
        ) : (
          <></>
        )}
        <i>
          *If you want to see more logging, try changing logger option to INFO
          or DEBUG
        </i>
      </Col>
    </Row>
  );
}
