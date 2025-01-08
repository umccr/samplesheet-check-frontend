import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { QuestionCircle, ArrowRepeat, SendCheck } from "react-bootstrap-icons";
import { post as amplifyPost } from "aws-amplify/api";
import ShowModal from "./Modal";
import ShowError from "./Error";
import "./SyncMetadataRow.css";

const startYear = 2017;
const currentYear = new Date().getFullYear();
const years = [];

// Create an array of years from 2017 to current year
for (let year = startYear; year <= currentYear; year++) {
  years.push(year.toString());
}

export default function SyncMetadataRow() {
  const [isSyncAnimation, setIsSyncAnimation] = useState(false);

  const [modalProps, setModalProps] = useState({
    isOpen: false,
    title: "",
    titleIcon: <></>,
    message: "",
  });

  const [errorString, setErrorString] = useState("");

  async function setSyncLoading() {
    // Set timer 3 minutes for loading button
    setIsSyncAnimation(true);
    await new Promise((r) => setTimeout(r, 3 * 60 * 1000)); // Set for 3 minutes
    setIsSyncAnimation(false);
  }

  // Handle sync api
  async function handleSyncMetadataButton() {
    setSyncLoading();

    try {
      const _res = await amplifyPost({
        apiName: "metadataSync",
        path: "/metadata/sync",
        options: {
          body: {
            sheets: years,
            truncate: true,
          },
        },
      }).response;
      console.debug("sync response: ", _res);

      const message =
        "This may take some times and could take up to 3 minutes. Please wait for a moment before checking the samplesheet again.";

      setModalProps((p) => ({
        ...p,
        title: "Sync Metadata Triggered",
        titleIcon: <SendCheck />,
        message: message,
      }));
    } catch (error) {
      setIsSyncAnimation(false);
      setErrorString(error.toString());
    }
  }

  function handleInfoMetadataSyncButton() {
    setModalProps((p) => ({
      ...p,
      isOpen: true,
      title: "Sync Metadata Button",
      message:
        "The metadata at Data Portal API may not be up to date with the recent data. " +
        "Metadata sync will import metadata from Goole Drive into the Data Portal, and currently is being triggered once a day. " +
        "On demand, this button will sync immediately. \n" +
        "NOTE: Sync may take up to 3 minutes.",
    }));
  }

  return (
    <div>
      <div className="row-metadata-sync">
        <ShowModal
          handleIsOpen={(value) => {
            setModalProps((p) => ({ ...p, isOpen: value }));
          }}
          isOpen={modalProps.isOpen}
          title={modalProps.title}
          message={modalProps.message}
        />
        <ShowError
          handleError={() => {
            setErrorString("");
          }}
          isError={!!errorString}
          errorMessage={errorString}
        />
        <div className="div-metadata-sync-text">
          <div>
            <p className="p-metadata-sync">Sync Portal Metadata</p>
          </div>
          <Button variant="circle" onClick={handleInfoMetadataSyncButton}>
            <QuestionCircle />
          </Button>
        </div>
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
      <small
        style={{
          marginTop: "1rem",
          marginBottom: "0",
          fontSize: "12px",
          color: "gray",
        }}
      >
        {`from the year 2017 to ${currentYear}`}
      </small>
    </div>
  );
}
