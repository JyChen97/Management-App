//File Name: UpdateInfo.js
//renders the update info page
import React, { Component } from "react";
import { Form, Col, Row, FormGroup, Button, FormControl, Modal} from "react-bootstrap";
import fire from "../webConfig/Fire";
import axios from "axios";
import "./styles/UpdateInfo.css";

class UpdateInfo extends Component{
  constructor(props){
    super(props);
    this.state = {
      name: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      jobPosition: "",
      updateSuccess: "",
      updatedEmail: false,
      notification: false
    }
  }

  validateForm() {                                        
    return (
      this.state.name.length > 0        &&
      this.state.companyName.length > 0 &&
      this.state.jobPosition.length > 0 &&
      this.state.password.length > 0    &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleClose = event => {                        //after updates, when user close the window pop up
    this.setState({                               //all fields will be reset 
      notification: false,
      name: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      jobPosition: "",
    });
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    var name = this.state.name
    var companyName = this.state.companyName
    var jobPosition = this.state.jobPosition
    var password = this.state.password
    fire.auth().onAuthStateChanged((user) => {            //check if user is still login
      if(user){
        fire.auth().currentUser.getIdToken(true)          //get Id Token
        .then( idToken => {
            axios.post("/updateInfo", {                   //sends update to server
              "id"         : idToken,
              "companyName": companyName,
              "name"       : name,
              "jobPosition": jobPosition,
              "password"   : password
            })
            .then(res => {
              this.setState({
                updateSuccess: res.data.success,
                notification : true
              })
            })
        })
        .catch(error => {
          console.log(error)
        });
      }
    })
  }

  render(){
    return(
      <div className="UpdateInfo">
        <Form>
          <Row>
            <Col sm={10}>
              <Form.Row>
                <Form.Group as={Col} controlId="name">
                  <Form.Label>Name</Form.Label>
                  <FormControl
                  autoFocus
                  type="text"
                  value={this.state.name}
                  onChange={this.handleChange}
                  placeholder = "Full name"
                />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="password">
                  <Form.Label>Password</Form.Label>
                  <FormControl 
                    type="password" 
                    placeholder="Password" 
                    onChange ={this.handleChange} 
                    value={this.state.password}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <FormControl 
                    type="password" 
                    placeholder="Confirm Password" 
                    onChange ={this.handleChange} 
                    value={this.state.confirmPassword}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="companyName">
                  <Form.Label >Company</Form.Label>
                  <FormControl 
                    type="text" 
                    placeholder="Company" 
                    onChange={this.handleChange} 
                    value={this.state.companyName}
                  />
                </Form.Group>
              </Form.Row>

              <FormGroup as={Row} controlId="jobPosition">
                  <Form.Label column sm={3}>
                  Job Position
                  </Form.Label>
                  <Col sm={9}>
                  <Form.Check
                        onChange={this.handleChange}
                        value="Manager"
                        name="jobPosition"
                        inline
                        label="Manager"
                        type="radio"
                        id="jobPosition"
                      />
                      <Form.Check
                        onChange={this.handleChange}
                        value="Worker"
                        name="jobPosition"
                        inline
                        label="Worker"
                        type="radio"
                        id="jobPosition"
                      />
                  </Col>
              </FormGroup>

                <Modal show={this.state.notification} onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Success</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>{this.state.updateSuccess}</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                      ok
                    </Button>
                  </Modal.Footer>
                </Modal>
              
            <Col sm={{ span: 2, offset: 10  }}>
            <Button
              block
              disabled={!this.validateForm()}
              type="submit"
              onClick={this.handleSubmit}
            >
              Update
            </Button>
            </Col>
          </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default UpdateInfo;