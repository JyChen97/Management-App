import React, { Component } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import fire from "../webConfig/Fire";

class ViewSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clockTimestamp: {},
      noData: false
    }
  }

  getTimestamp = () => {
    fire.auth().onAuthStateChanged(async (user) => {            //see if user still logged in
      if (user) {
        try {
          let idToken = await fire.auth().currentUser.getIdToken(true)        //get ID token
          let res = await axios.post('/getSchedule', {                //request for schedule
            "id": idToken
          })
          this.setState({
            clockTimestamp: res.data.timeStamp,
            noData: res.data.noData
          })
        } catch (error) {
          console.error(error)
        }
      }
    })
  }

  componentDidMount() {
    this.setState({})
    setInterval(() =>
      this.getTimestamp(), 1000                   //update the table every second so when user clock in or clock out, 
    )                                             //the schedule is displayed
  }

  componentWillMount() {
    this.getTimestamp()
  }

  render() {
    var data = Object.keys(this.state.clockTimestamp).map((schedule) => (               //seperate the array into divs
      <tr key={this.state.clockTimestamp[schedule].Date}>
        <td> {this.state.clockTimestamp[schedule].Date}</td>
        <td> {this.state.clockTimestamp[schedule].clockIn}</td>
        <td> {this.state.clockTimestamp[schedule].clockOut === 0 ? " " : this.state.clockTimestamp[schedule].clockOut}</td>
      </tr>
    ))

    return (
      <Table bordered >
        <thead>
          <tr>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
          </tr>
        </thead>
        <tbody>
          {this.state.noData
            ?
            (
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )
            :
            data
          }
        </tbody>
      </Table>
    );
  }
}

export default ViewSchedule;