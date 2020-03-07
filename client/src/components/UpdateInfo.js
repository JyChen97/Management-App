import React, { Component } from "react";
import { Form, Button, FormControl, Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import Context from '../context/Context';

class UpdateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      updateSuccess: "",
      updatedEmail: false,
      notification: false,
      Worker: "",
      Manager: "",
      loading: false,
      errorMessage: ""
    }
  }

  validateForm() {
    return (
      this.state.name.length > 0 &&
      this.state.companyName.length > 0 &&
      (this.state.Worker.length > 0 || this.state.Manager.length > 0) &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleClose = () => {                        //after updates, when user close the window pop up
    this.setState({                               //all fields will be reset 
      notification: false,
      name: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      Worker: "",
      Manager: "",
      loading: false
    });
  }

  handleChange = event => {
    if (event.target.id === "Manager") {
      this.setState({ Worker: "" })
    } else if (event.target.id === "Worker") {
      this.setState({ Manager: "" })
    }

    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true })
    const { idToken, user } = this.props
    let { name, companyName, password } = this.state
    let jobPosition = this.state.Manager.length > 0 ? this.state.Manager : this.state.Worker
    try {
      let res = await axios.post("/updateInfo", {                   //sends update to server
        "id": idToken,
        "companyName": companyName,
        "name": name,
        "jobPosition": jobPosition,
      })
      await user.updatePassword(password)
      this.props.setJobPosition(jobPosition)
      this.setState({
        updateSuccess: res.data.success,
        notification: true,
      })
    } catch (error) {
      this.setState({ loading: false, errorMessage: error.message })
    }
  }

  render() {
    return (
      <div style={{padding: "0 5% 5%"}}>
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <FormControl
              autoFocus
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
              placeholder="Full name"
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <FormControl
              type="password"
              placeholder="Password"
              onChange={this.handleChange}
              value={this.state.password}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <FormControl
              type="password"
              placeholder="Confirm Password"
              onChange={this.handleChange}
              value={this.state.confirmPassword}
            />
          </Form.Group>

          <Form.Group controlId="companyName">
            <Form.Label>Company Name</Form.Label>
            <FormControl
              type="text"
              placeholder="Company"
              onChange={this.handleChange}
              value={this.state.companyName}
            />
          </Form.Group>

          <Form.Group controlId="jobPosition" style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Label>Job Position</Form.Label>
            <div>
              <Form.Check
                inline
                id="Manager"
                onChange={this.handleChange}
                value="Manager"
                name="jobPosition"
                label="Manager"
                type="radio"
                checked={this.state.Manager}
              />
              <Form.Check
                inline
                id="Worker"
                onChange={this.handleChange}
                value="Worker"
                name="jobPosition"
                label="Staff"
                type="radio"
                checked={this.state.Worker}
              />
            </div>
          </Form.Group>
          <p style={{color: "red"}}>{this.state.errorMessage}</p>
          {this.state.loading ? (
            <Button variant="primary" type="submit" block disabled>
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
                variant="primary"
                type="submit"
                block
                disabled={!this.validateForm()}
                onClick={this.handleSubmit}
              >
                Submit Update
            </Button>
            )}
        </Form>

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

      </div>
    )
  }
}

const getUserInfo = (props) => (
  <Context.Consumer>
    {(value) => {
      const { user, idToken } = value.state;
      return <UpdateInfo user={user} idToken={idToken} {...props} />
    }}
  </Context.Consumer>
)

export default getUserInfo;