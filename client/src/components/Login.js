import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./styles/Login.css";
import fire from "../webConfig/Fire";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      err: "",
      jobPosition: null
    }
  }

  validateForm() {
    let AtLocation = this.state.email.lastIndexOf('@');
    let DotLocation = this.state.email.lastIndexOf('.');
    return this.state.email.length > 0 && this.state.password.length > 0 &&
      (AtLocation < DotLocation && AtLocation > 0 && this.state.email.indexOf('@@') === -1 && DotLocation > 2 && (this.state.email.length - DotLocation) > 2)
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      fire.auth().onAuthStateChanged(user => {          //check if user is still logged in
        if (user && !user.emailVerified) {                         //checks if the user verified their email
          user.sendEmailVerification();                 //if user didn't verified their email, send then verification email
          fire.auth().signOut();
          this.setState({ err: "Requires Verification" })
        }
      })
    } catch (error) {
      let errorCode = error.code;
      if (errorCode === 'auth/wrong-password') {
        this.setState({ err: "Incorrect Password" })
      } else if (errorCode === 'auth/user-not-found') {
        this.setState({ err: "Account Does Not Exist" })
      } else if (errorCode === 'auth/invalid-email') {
        this.setState({ err: "Incorrect Email" })
      } else {
        this.setState({ err: "Your Account is Disabled" })
      }
    }
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email">
            <FormLabel>Email</FormLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password">
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <p className="Err">{this.state.err}</p>
          <Button
            block
            disabled={!this.validateForm()}
            type="submit"
            onClick={this.handleSubmit}
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}

export default Login;