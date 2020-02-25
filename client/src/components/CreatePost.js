import React from "react";
import { Button, Modal } from "react-bootstrap";

const CreatePost = (props) => (
  <div>
    <Modal show={props.show} onHide={props.close}>
      <Modal.Header closeButton>
        <Modal.Title>
          <input
            placeholder="Title"
            onChange={props.change}
            id="title"
            value={props.title}
          >
          </input>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          rows="5"
          cols="45"
          placeholder="Post"
          onChange={props.change}
          id="post"
          value={props.post}
        >
        </textarea>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.close}>
          Close
          </Button>
        <Button onClick={props.submit}>
          Ok
          </Button>
      </Modal.Footer>
    </Modal>
  </div>
);

export default CreatePost;