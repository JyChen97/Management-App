//File name: ViewSchedule.js
//render the view Schedule table
import React, { Component } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import fire from "../webConfig/Fire";

class ViewSchedule extends Component{
  constructor(props){
    super(props);
    this.state = {
      clockTimestamp: [],
      noData: false
    }
  }

  //get schedules from the server
  getTimestamp = event =>{
    fire.auth().onAuthStateChanged((user) => {            //see if user still logged in
      if(user){       
        fire.auth().currentUser.getIdToken(true)        //get ID token
        .then( idToken => {
            axios.post('/getSchedule', {                //request for schedule
              "id": idToken
            })
            .then(res =>{
              this.setState({
                noData          : res.data.noData,
                clockTimestamp  : res.data.timeStamp
              })
            })
        })
      }
    })
  }

  componentDidMount(){
    this.setState({})
    setInterval( () => 
      this.getTimestamp(), 1000                   //update the table every second so when user clock in or clock out, 
    )                                             //the schedule is displayed
  }

  componentWillMount(){
    this.getTimestamp()
  }

  render(){

    var data = this.state.clockTimestamp.map((schedule) =>(               //seperate the array into divs
          <tr key = {schedule.Date}> 
            <td> {schedule.Date}</td>
            <td> {schedule.clockIn}</td>
            <td> {schedule.clockOut === 0?  " " : schedule.clockOut }</td>
          </tr>
    ))

    return(
      <Table bordered >
        <thead>
          <tr>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
          </tr>
        </thead>
        <tbody>
            {this.state.clockTimestamp.length
            ? data
            : (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )
            } 
        </tbody>
      </Table> 
    );
  }
}

export default ViewSchedule;