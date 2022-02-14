import React from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ShowModal({title, handleIsOpen, isOpen, message }) {

  const handleClose = () => handleIsOpen(false);
  const arrayMessage = message.split("\n");

  return (
    <>
      <Modal animation={false} show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
        {title}
        </Modal.Header>
        {arrayMessage.map((message, i) => (
          <Modal.Body key={i}>
            <p>{message}</p>
          </Modal.Body>
        ))}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
