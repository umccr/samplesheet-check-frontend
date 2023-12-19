import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Accordion from "react-bootstrap/Accordion";

import { download } from "../utils";

// Helper function to display results
export default function DisplayResult({ validationResponse }) {
  // Parse data from response
  const alertVariant =
    validationResponse.check_status === "PASS" ? "success" : "danger";
  const errorMessage = validationResponse.error_message;
  const logFile = validationResponse.log_file;
  const ssv2 = validationResponse.v2_samplesheet_str;

  function DisplayFile({ strFile, filename }) {
    const arrayInput = strFile.split("\n");

    return (
      <>
        <pre
          className="overflow-auto pe-4 bg-light"
          style={{ height: "300px" }}
        >
          {arrayInput.map((val, index) => (
            <Row key={index}>{val}</Row>
          ))}
        </pre>
        <div className="d-grid mt-2">
          <Button
            variant="outline-secondary"
            onClick={() => download({ filename, content: strFile })}
          >
            Save as file
          </Button>
        </div>
      </>
    );
  }
  function DisplayErrorMessage({ errorMessage }) {
    return (
      <div className="my-4">
        <b>Error: </b> {errorMessage} <br />
      </div>
    );
  }

  return (
    <>
      <Alert variant={alertVariant}>
        <Alert.Heading>
          Check Result: <b>{validationResponse.check_status}</b>
        </Alert.Heading>

        <hr />

        {errorMessage && <DisplayErrorMessage errorMessage={errorMessage} />}

        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Samplesheet Check Logs</Accordion.Header>
            <Accordion.Body>
              {logFile ? (
                <DisplayFile strFile={logFile} filename={"log.txt"} />
              ) : (
                <div className="fst-italic">None</div>
              )}
              <div className="mt-3 fw-bold">
                *If you want to see more logging, try changing logger option to
                INFO or DEBUG
              </div>
            </Accordion.Body>
          </Accordion.Item>
          {ssv2 && (
            <Accordion.Item eventKey="1">
              <Accordion.Header>Samplesheet V2</Accordion.Header>
              <Accordion.Body>
                <DisplayFile strFile={ssv2} filename={"samplesheet-v2.csv"} />
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
      </Alert>
    </>
  );
}
