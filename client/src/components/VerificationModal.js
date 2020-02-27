import React from 'react';
import { Button, Modal } from "react-bootstrap";

const VerificationModal = (props) => (
      <Modal show={props.show} onHide={props.verification}>
        <Modal.Header closeButton>
          <Modal.Title>Email Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please verify your email</p>
          <p> Once you have verified, please click ok to continue </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.verification}>
            Ok
      </Button>
        </Modal.Footer>
      </Modal>
    )

export default VerificationModal;