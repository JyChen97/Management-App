import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel, Spinner } from "react-bootstrap";
import "../styles/Login.css";
import fire from "../webConfig/Fire";
import Context from '../context/Context';
import PasswordResetEmail from './PasswordResetEmail';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      err: "",
      jobPosition: null,
      loading: false,
      show: false,
      passwordResetMessage: ""
    }
  }

  handleForgetPassword = () => {
    this.setState({ show: !this.state.show })
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

  handleSubmitPasswordReset = async () => {
    try{
      await fire.auth().sendPasswordResetEmail(this.state.email)
      this.props.handleForgetPassword()
    } catch (error) {
      this.setState({passwordResetMessage: "Please enter a valid email"})
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    try {
      await fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      setTimeout(() => {                            //takes awhile for the state to update when firebase returns the user object
        const { user } = this.props;
        if (user) {
          if (!user.emailVerified) {
            user.sendEmailVerification();                 //if user didn't verified their email, send then verification email
            fire.auth().signOut();
            this.setState({ err: "Requires Verification", loading: false });
          } else {
            //setting state loading to false should be in the finally block of the try-catch-finally but because the finally block executed 
            //faster than the history.push("/UserPage") the state would be set to false, user won't be able to see the loading button before the page
            //gets pushed to the the user page  
            this.setState({ loading: false });
            this.props.history.push("/UserPage")
          }
        }
      }, 3000)
    } catch (error) {
      this.setState({ loading: false });
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
        <form>
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
                Login
              </Button>
            )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="link" onClick={this.handleForgetPassword} id='show'>Reset Password</Button>
          </div>
        </form>

        <PasswordResetEmail
          show={this.state.show}
          handleForgetPassword={this.handleForgetPassword}
          handleSubmitPasswordReset={this.handleSubmitPasswordReset}
          handleChange={this.handleChange}
          passwordResetMessage={this.state.passwordResetMessage}
        />

      </div>
    );
  }
}

const getUserInfo = (props) => (
  <Context.Consumer>
    {(value) => {
      const { user } = value.state;
      return <Login user={user} {...props} />
    }
    }
  </Context.Consumer>
)

export default getUserInfo;