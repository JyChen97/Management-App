import React, { Component } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import Context from '../context/Context';

class ViewSchedule extends Component {
  constructor(props) {
    super(props);

    this.setSchduleListener = null;
    this.isMount = false;
    this.state = {
      clockTimestamp: {},
      noData: false
    }
  }

  timelistener = () => { 
    this.setSchduleListener = setInterval(() => {
      if(this.props.updateSchedule){
        this.getTimestamp()
        this.props.shouldUpdateSchedule()
      }
    }, 1000)
  }

  getTimestamp = async () => {
    const { idToken } = this.props
    if (this.isMount) {           
      try {
        let res = await axios.post('/getSchedule', {                //request for schedule
          "id": idToken
        })
        if(this.isMount){
          this.setState({
            clockTimestamp: res.data.timeStamp,
            noData: res.data.noData
          })
        }
      } catch (error) {                    //only error here is when user log out, axios x-auth header is set to null. We clear interval.
        clearInterval(this.setSchduleListener);      
      }
    }
  }

  componentDidMount() {
    this.isMount = true;
    this.timelistener();
    this.getTimestamp();
  }

  componentWillUnmount() {
    this.isMount = false;
    clearInterval(this.setSchduleListener);
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

const getUserInfo = (props) => (
  <Context.Consumer>
    {(value) => {
      const { idToken } = value
      return <ViewSchedule idToken={idToken} {...props} />
    }
    }
  </Context.Consumer>
)

export default getUserInfo;