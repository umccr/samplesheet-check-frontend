import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { QuestionCircle, ArrowRepeat, SendCheck } from "react-bootstrap-icons";

// AWS
import { API } from "aws-amplify";
import "./SampleSheetChecker.css";

import ShowError from "../components/Error";
import ShowModal from "../components/Modal";
import { Modal } from "react-bootstrap";

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
  const [modalTitle, setModatTitle] = useState(<Modal.Title></Modal.Title>);
  const [modalMessage, setModalMessage] = useState("");
  function handleIsModalOpen(value) {
    setIsModalOpen(value);
  }

  const [isSyncAnimation, setIsSyncAnimation] = useState(false);

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

  async function setSyncLoading() {
    // Set timer 3 minutes for loading button
    setIsSyncAnimation(true);
    await new Promise((r) => setTimeout(r, 2.5 * 60 * 1000)); // Set for 2.5 minutes
    setIsSyncAnimation(false);
  }

  // Handle sync api
  async function handleSyncMetadataButton() {
    API.post("metadata-sync-api", "/metadata/sync", {})
      .then((response) => {
        // Disable and show sync animation
        setSyncLoading();

        // Show modal of success invocation.
        const message =
          "This may take some times and could take up to 3 minutes. Please wait for a moment before checking the samplesheet again.";
        setModatTitle(
          <Modal.Title>
            Sync Metadata Triggered <SendCheck />
          </Modal.Title>
        );
        setModalMessage(message);
        setIsModalOpen(true);
      })
      .catch((error) => {
        setIsError(true);
        setErrorMessage(error.toString());
      });
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

    API.post("samplesheet-check", "/", dataRequest)
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
            <i>*If you want to see more logging, try changing logger option to INFO or DEBUG</i>
          </Col>
        </Row>
      );
    }
  }

  function handleInfoMetadataSyncButton() {
    setModatTitle(<Modal.Title>Sync Metadata Button</Modal.Title>);

    setModalMessage(
      "The metadata at Data Portal API may not be up to date with the recent data. " +
        "Metadata sync will import metadata from Goole Drive into the Data Portal, and currently is being triggered once a day. " +
        "On demand, this button will sync immediately. \n" +
        "NOTE: Sync may take up to 3 minutes."
    );

    setIsModalOpen(true);
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
            <Button
              size="sm"
              variant="outline-primary"
              className="btn-sync"
              disabled={isSyncAnimation}
              onClick={handleSyncMetadataButton}
            >
              <ArrowRepeat
                size={20}
                className={isSyncAnimation ? "spinning" : ""}
              />
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
              disabled={isLoading}
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
              disabled={isLoading}
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
          title={modalTitle}
          message={modalMessage}
        />
      </Container>
    </div>
  );
}
