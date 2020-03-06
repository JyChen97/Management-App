import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import Context from '../context/Context';
import axios from "axios";

class ClockIn extends Component {
  constructor(props) {
    super(props)

    this.setTimeListener = null; 
    this._isMounted = false       //prevent state being updated when components are unmounted
    this.state = {
      clockedIn: false,
      // is problematic to use "/", which would create a new directory in the database so the following will modified the date string
      currentDate: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'),
      currentTime: new Date().toLocaleTimeString()
    }
  }
  getCurrentTime = () => this.setTimeListener = setInterval(()=>this.currentTime(), 1000)

  currentTime() {
    if (this._isMounted) {   
      this.setState({ currentTime: new Date().toLocaleTimeString() })
    }
  }

  getClockStatuts = async () => {
    try {
      let res = await axios.post('/getClockStatus', {               
        "date": this.state.currentDate
      })
      if (this._isMounted) {                       
        this.setState({ clockedIn: res.data.clockIn })
      }
    } catch (error) {
      console.error(error)
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.getCurrentTime();
    this.getClockStatuts();
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.setTimeListener);
  }

  handleSubmit = async () => {
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
        this.props.shouldUpdateSchedule()
      }
    } catch (error) {
      console.error(error)
    }
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

const getUserInfo = (props) => (
  <Context.Consumer>
    {(value) => {
      const { user, idToken } = value.state;
      return <ClockIn user={user} idToken={idToken} {...props} />
    }
    }
  </Context.Consumer>
)

export default getUserInfo;