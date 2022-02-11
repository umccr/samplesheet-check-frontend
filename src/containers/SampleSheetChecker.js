import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { QuestionCircle, ArrowRepeat } from "react-bootstrap-icons";

// AWS
import { API, Auth } from "aws-amplify";
import "./SampleSheetChecker.css";

import ShowError from "../components/Error";
import ShowModal from "../components/Modal";

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

  // Show Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({title:"",body:""});
  function handleIsModalOpen(value){
    setIsModalOpen(value)
  }

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

  // Invoke lambda function
  async function invokeLambdaFunction() {
    console.log("Action Invoke to sync metadata");
  }


  // Handle Submit Button
  async function handleSubmit(event) {
    event.preventDefault();

    // File Validation Size (Does not allow more than 512mb)
    if (fileSelected && fileSelected.size > constant.MAX_ATTACHMENT_SIZE) {
      alert(
        `File must be smaller than ${
          constant.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", fileSelected);
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
        setErrorMessage(error.toString());
        resetFrom();
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

  function handleInfoMetadataSyncButton(){
    const message = {
      title: "Metadata Sync Button",
      body:"This button will sync metadata in Google Drive into the Data Portal API. By default, the portal will sync periodically once a day. \nNOTE: sync will take up to 3 minutes."
    }


    setModalMessage(message)
    setIsModalOpen(true)
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
        <Row className="row-metadata-sync">
          <div className="div-metadata-sync-text">
            <p className="p-metadata-sync">Sync Portal Metadata</p>
            <Button variant="circle" onClick={handleInfoMetadataSyncButton}>
              <QuestionCircle />
            </Button>
          </div>
          <div>
            <Button size="sm" variant="outline-primary" className="btn-sync">
              <ArrowRepeat size={20} />
            </Button>
          </div>
        </Row>

        <hr />

        <Form id="samplesheet-form" onSubmit={handleSubmit}>
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
              label={fileSelected ? fileSelected.name : "File input"}
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
            disabled={!fileSelected}
            isLoading={isLoading}
            block
          >
            Check File
          </LoaderButton>
        </Row>

        {displayResult(validationResponse)}
        <ShowError
          handleError={handleError}
          isError={isError}
          errorMessage={errorMessage}
        />

        <ShowModal
        handleIsOpen={handleIsModalOpen}
        isOpen={isModalOpen}
        message={modalMessage}
        />
      </Container>
    </div>
  );
}
