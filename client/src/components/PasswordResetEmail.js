import React from 'react';
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";

const PasswordResetEmail = (props) => {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.handleForgetPassword}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Password Reset Email
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 style={{ textAlign: "center" }}>We'll send you an email to reset your password</h4>
        <label></label>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default" >Your Email:</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="Default"
            onChange={props.handleSubmitPasswordReset}
            id="email"
            aria-describedby="inputGroup-sizing-default"
          />
        </InputGroup>
        <p style={{ color: "red" }}> {props.passwordResetMessage} </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.handleSubmitPasswordReset}>Send</Button>
      </Modal.Footer>
    </Modal>
  )
};

export default PasswordResetEmail;