import React, { Component } from "react";
import { FormGroup, FormControl, FormLabel, Button, Form, Spinner } from "react-bootstrap";
import fire from "../webConfig/Fire";
import axios from "axios";
import VerificationModal from './VerificationModal';
import Context from '../context/Context';

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
      Manager: "",
      Worker: "",
      loading: false
    };
  }

  validateForm() {
    return (
      this.state.name.length > 0 &&
      this.state.companyName.length > 0 &&
      this.state.email.length > 0 &&
      (this.state.Manager.length > 0 || this.state.Worker.length > 0) &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  verification = async () => {
    const { user } = this.props;
    this.setState({
      error: false,
      show: false,
      loading: false
    })
    try {
      if (user) {
        await user.reload()
        if (!user.emailVerified) {              //this statement enforce the user to verified their email or else they'll be able to login 
          fire.auth().signOut();
          this.setState({ registrationError: "Need Verification" })
        } else {
          this.props.history.push("/UserPage")
        }
      }
    } catch (error) {
      console.log('problem with verification')
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true })
    const { name, companyName, email, password } = this.state;
    const jobPosition = this.state.Worker.length > 0 ? this.state.Worker : this.state.Manager
    try {
      await fire.auth().createUserWithEmailAndPassword(email, password)     //create a new user using Firebase function
      setTimeout(async () => {                                  //requies time to update the state after receiving the user object from firebase
        const { user, idToken } = this.props;
        if (user) {
          await axios.post("/createUser", {                    //This will update the database
            "ID": idToken,
            "companyName": companyName,
            "name": name,
            "jobPosition": jobPosition
          })
          user.sendEmailVerification();
          this.setState({
            error: true,
            show: true,
            registrationError: "Need Verification"
          });
        }
      }, 3000)
    } catch (error) {                                     //Display error when user entered wrong creditials
      this.setState({ loading: false })
      let errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        this.setState({ registrationError: "Email Already Exist" })
      } else if (errorCode === 'auth/invalid-email') {
        this.setState({ registrationError: "Invalid Email" })
      } else if (errorCode === 'auth/weak-password') {
        this.setState({ registrationError: "Password Need To Be Minimum of 6 Characters" })
      }
    };
  }

  render() {
    return (
      <div className="Signup">
        <form>
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
          <FormGroup controlId="jobPosition" style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Label> Job Position </Form.Label>
            <div>
              <Form.Check
                onChange={this.handleChange}
                value="Manager"
                name="jobPosition"
                inline
                label="Manager"
                type="radio"
                id="Manager"
              />
              <Form.Check
                onChange={this.handleChange}
                value="Worker"
                name="jobPosition"
                inline
                label="Staff"
                type="radio"
                id="Worker"
              />
            </div>
          </FormGroup>
          <p style={{ color: "red" }}>{this.state.registrationError}</p>
          
          {/*Prompt user to verify their email, or log them out when they clicked close button */}
          <VerificationModal show={this.state.show} verification={this.verification} />

          {this.state.loading ? (
            <Button type="submit" block disabled>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </Button>
          ) : (
              <Button
                block
                disabled={!this.validateForm()}
                type="submit"
                onClick={this.handleSubmit}
              >
                Sign Up
            </Button>
            )
          }

        </form>
      </div>
    );
  }
}

const getUserInfo = (props) => (
  <Context.Consumer>
    {(value) => {
      const { user, idToken } = value.state;
      return <Signup user={user} idToken={idToken} {...props} />
    }
    }
  </Context.Consumer>
)

export default getUserInfo;