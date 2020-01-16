//File name: SIgnup.js
//renders the sign up form
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
      showErr: false,
      companyName: "",
      name: "",
      jobPosition: "",
    };
  }

  componentDidMount(){
    this.authListener();
  }

  authListener = event => {
    var jobPosition
    fire.auth().onAuthStateChanged((user) => {
      if(user){                                         //check to see if there's an user
        if(user.emailVerified){                         //check if user validated their email
          fire.auth().currentUser.getIdToken(true)
          .then(idToken => {
            axios.post("/login", {"id": idToken})
            .then(res =>{                                 //redirect user based on their job position
              jobPosition = res.data
              if(jobPosition === "Worker"){
                this.props.history.push("/EmployeePage")
              }else if(jobPosition === "Manager"){
                this.props.history.push("/EmployerPage")
              }
            })})
            .catch(error =>{
              console.log(error)
            })
        }else{
          this.setState({registrationError: "Requires Verification"});        //prompt user for email verification if they have no verified
          this.setState({showErr: true});
        }
      }
    })
  }

  handleClose = event => {                          //handle the pop up modal after user sign up that prompt them to verified email
    this.setState({showErr: false});
    fire.auth().onAuthStateChanged((user) => {            
      if(user)         
        fire.auth().signOut();              //sign out is require because whenever user creates a new account they are automated logged in
    })                                      //This is caused by firebase createUserWithEmailAndPassword() function
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

  //Below would refresh firebase.user object, and users would be guided to their user page (the object does not automatically update)
  //if they have verified their email
  //Or else force them to log out
  refreshPage = event => {
    window.location.reload(); 
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
    var email = this.state.email
    var password = this.state.password
    fire.auth().createUserWithEmailAndPassword(email, password)     //create a new user using Firebase function
    .then(()=>{
      fire.auth().onAuthStateChanged((user) => {                  //once created, there will exist a user
        if(user){ 
          fire.auth().currentUser.getIdToken(true)              //get user ID token
          .then( idToken => {
            axios.post("/createusers", {                    //This will update the database
              "id":          idToken,
              "companyName": companyName,
              "name":        name,
              "jobPosition": jobPosition
            })
          })
          .catch(function(error) {
              console.log(error)
          });
          if(!user.emailVerified){                  //prompt user to verify their email
            user.sendEmailVerification();
            this.setState({showErr: true});
          }
        }
      })
    })
    .catch((error) => {                                     //Display error when user entered wrong creditials
      var errorCode = error.code;
      if (errorCode === 'email-already-in-use') {
          this.setState({registrationError: "Email Already Exist"})
      } else if (errorCode === 'auth/invalid-email') {
          this.setState({registrationError: "Invalid Email"})
      } else if (errorCode === 'auth/weak-password') {
          this.setState({registrationError: "Weak Password"})
      }else {
          this.setState({registrationError: "Need Verification"})
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
              placeholder = "Full name"
            />
            </FormGroup>
          <FormGroup controlId="email">
            <FormLabel>Email</FormLabel>
            <FormControl
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder = "Email"
            />
          </FormGroup>
          <FormGroup controlId="password" >
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              placeholder = "Password"
            />
          </FormGroup>
          <FormGroup controlId="confirmPassword">
            <FormLabel>Confirm Password</FormLabel>
            <FormControl
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              type="password"
              placeholder = "Password"
            />
          </FormGroup>
          <FormGroup controlId="companyName">
            <FormLabel>Company</FormLabel>
            <FormControl
              type="text"
              value={this.state.companyName}
              onChange={this.handleChange}
              placeholder = "Company"
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
          <p className= "Err">{this.state.registrationError}</p>

          {/*Prompt user to verify their email, or log them out when they clicked close button */}
          <Modal show={this.state.showErr} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Email Verification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Please verify your email</p>
              <p> Once you have verified, please click ok to continue </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button onClick={this.refreshPage}>
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