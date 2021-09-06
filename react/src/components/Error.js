import React, { useState } from "react";

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function ShowError({handleError, isError}) {

  const handleClose = () => handleError(false);
  const handleShow = () => handleError(true);

  return (
    <>
      <Modal animation={false} show={isError} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sorry, An error has occured. Please try again!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
