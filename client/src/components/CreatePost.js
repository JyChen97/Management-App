//File name: CreatePost.js
//Contains the window popup modal that creates announcements
import React, { Component } from "react";
import { Button, Modal} from "react-bootstrap";

class CreatePost extends Component{
    render(){
    return(
        <div>
        <Modal show={this.props.show} onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>
            <input 
            placeholder="Title" 
            onChange={this.props.change} 
            id="title"
            value={this.props.title}
            >
            </input>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea 
          rows="5" 
          cols="45" 
          placeholder="Post" 
          onChange={this.props.change} 
          id="post"
          value={this.props.post}
          > 
          </textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.close}>
            Close
          </Button>
          <Button onClick={this.props.submit}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
        );
    }
}
export default CreatePost;