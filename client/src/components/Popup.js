import React from "react";
import { Modal, Button } from "react-bootstrap";

function Popup(props){
    return(
      <div>
        <Modal show={props.handleShow} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Email Verification</Modal.Title>
          </Modal.Header>
          <Modal.Body>Fill this with data!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        </div>
    );
}

export default Popup;