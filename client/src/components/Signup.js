import React, { Component } from "react";
import { FormGroup, FormControl, FormLabel, Button, Modal, Form, Row, Col } from "react-bootstrap";
import "./styles/Signup.css";
import fire from "../webConfig/Fire";
import axios from "axios";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      registrationError: "",
      error: false,
      show: false,
      companyName: "",
      name: "",
      jobPosition: "",
    };
  }

  validateForm() {
    return (
      this.state.name.length > 0 &&
      this.state.companyName.length > 0 &&
      this.state.email.length > 0 &&
      this.state.jobPosition.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  verification = async () => {
    this.setState({ 
      error: false,
      show: false,
      registrationError: "Need Verification" 
    });

    try{
      await fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      fire.auth().onAuthStateChanged(user => {          //user automatically logs in without the need for email verification
        if (user && !user.emailVerified) {              //this statement enforce the user to verified their email or else they'll be able to login 
          fire.auth().signOut();
        }
      })
    }catch (error) {
      console.log(error)
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    const { name, companyName, jobPosition, email, password } = this.state

    fire.auth().createUserWithEmailAndPassword(email, password)     //create a new user using Firebase function
      .then(() => {
        fire.auth().onAuthStateChanged((user) => {                  //once created, there will exist a user
          if (user) {
            fire.auth().currentUser.getIdToken(true)              //get user ID token
              .then(idToken => {
                axios.post("/createusers", {                    //This will update the database
                  "id": idToken,
                  "companyName": companyName,
                  "name": name,
                  "jobPosition": jobPosition
                })
              })
              .catch(function (error) {
                console.log(error)
              });
            if (!user.emailVerified) {                  //prompt user to verify their email
              user.sendEmailVerification();
              this.setState({ 
                error: true, 
                show: true,
                registrationError: "Need Verification" 
              });
            }
          }
        })
      })
      .catch((error) => {                                     //Display error when user entered wrong creditials
        let errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          this.setState({ registrationError: "Email Already Exist" })
        } else if (errorCode === 'auth/invalid-email') {
          this.setState({ registrationError: "Invalid Email" })
        } else if (errorCode === 'auth/weak-password') {
          this.setState({ registrationError: "Weak Password" })
        }
      });
  }

  render() {
    return (
      <div className="Signup">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="name">
            <FormLabel>Name</FormLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
              placeholder="Full name"
            />
          </FormGroup>
          <FormGroup controlId="email">
            <FormLabel>Email</FormLabel>
            <FormControl
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="Email"
            />
          </FormGroup>
          <FormGroup controlId="password" >
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              placeholder="Password"
            />
          </FormGroup>
          <FormGroup controlId="confirmPassword">
            <FormLabel>Confirm Password</FormLabel>
            <FormControl
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              type="password"
              placeholder="Password"
            />
          </FormGroup>
          <FormGroup controlId="companyName">
            <FormLabel>Company</FormLabel>
            <FormControl
              type="text"
              value={this.state.companyName}
              onChange={this.handleChange}
              placeholder="Company"
            />
          </FormGroup>
          <FormGroup as={Row} controlId="jobPosition ">
            <Form.Label column sm={5}>
              Job Position
            </Form.Label>
            <Col sm={7}>
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
          {/*After clicking submit button, errors will be shown if there's any */}
          <p className="Err">{this.state.registrationError}</p>

          {/*Prompt user to verify their email, or log them out when they clicked close button */}
          <Modal show={this.state.show}>
            <Modal.Header closeButton>
              <Modal.Title>Email Verification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Please verify your email</p>
              <p> Once you have verified, please click ok to continue </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.verification}>
                Ok
              </Button>
            </Modal.Footer>
          </Modal>
          
          <Button
            block
            disabled={!this.validateForm()}
            type="submit"
            onClick={this.handleSubmit}
          >
            Sign Up
            </Button>
        </form>
      </div>
    );
  }
}

export default Signup;