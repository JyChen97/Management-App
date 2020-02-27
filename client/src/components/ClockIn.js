import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import fire from "../webConfig/Fire";
import axios from "axios";

class ClockIn extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false       //prevent state being updated when components are unmounted
    this.state = {
      clockedIn: false,
      // is problematic to use "/", which would create a new directory in the database so the following will modified the date string
      currentDate: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'),
      currentTime: new Date().toLocaleTimeString()
    }
  }

  currentTime() {
    if (this._isMounted) {    //check to see if this component is still mounted
      this.setState({ currentTime: new Date().toLocaleTimeString() })
    }
  }

  getClockStatuts = event => {
    fire.auth().onAuthStateChanged(async (user) => {                  //if user still logged in
      if (user) {
        if (user.emailVerified) {
          try {
            let res = await axios.post('/getClockStatus', {                     //request if user had clocked in or not
              "date": this.state.currentDate
            })
            if (this._isMounted) {                        //prevent state updating when component is unmounted
              this.setState({ clockedIn: res.data.clockIn })
            }
          } catch (error) {
            console.error(error)
          }

        }
      }
    }
    )
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillMount() {
    setInterval(() =>
      this.currentTime(), 1000
    )
    this.getClockStatuts()
  }

  handleSubmit = () => {
    fire.auth().onAuthStateChanged(async (user) => {
      if (user) {
        if (user.emailVerified) {
          try {
            await (this.state.clockedIn                           //If user already clocked in, then they are clocking out now
              ? axios.post('/clockOut', {
                "date": this.state.currentDate,
                "time": this.state.currentTime
              })
              : axios.post('/clockIn', {                    //else user has no clocked in, prompt user to clock in
                "date": this.state.currentDate,
                "time": this.state.currentTime
              })
            )
            if (this._isMounted) {
              this.getClockStatuts()
            }
          } catch (error) {
            console.error(error)
          }
        }
      }
    })
    this.props.handleClose();
  }

  render() {
    return (
      <div>
        <Modal show={this.props.handleShow} onHide={this.props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.currentDate}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.clockedIn ? "Would you like to clock out?" : "Would you like to clock in?"}
            <p>
              {"Current Time: " + this.state.currentTime}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ClockIn;