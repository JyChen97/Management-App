//File name: EmployeePage.js
//renders a sidebar, cant update announcements
import React, { Component } from "react";
import { Tab, ListGroup, Col, Row } from "react-bootstrap";
import "./styles/EmployeePage.css";
import ClockIn from "./ClockIn";
import AnnouncementBoard from "./AnnouncementBoard";
import ViewSchedule from "./ViewSchedule";
import UpdateInfo from "./UpdateInfo";

class EmployeePage extends Component {
  constructor(props){
    super(props);

    this.state={
      show: false
    };
  }

handleShow = event => {
  this.setState({show: true});
}

handleClose = event =>{
  this.setState({show: false});
}

  render(){
    return(
      <div className="sideBar">
      <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
        <Row>
          <Col sm={3}>
            <ListGroup>
              <ListGroup.Item action href="#link1" variant="primary">
                Announcement Board
              </ListGroup.Item>
              <ListGroup.Item action href="#link2" variant="primary">
                View Schedule
              </ListGroup.Item>
              <ListGroup.Item action href="#link3" onClick={this.handleShow} variant="primary">
                Timestamp
              </ListGroup.Item>
              <ListGroup.Item action href="#link4" variant="primary">
                Update Info
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col sm={8}>
            <Tab.Content>
              <Tab.Pane eventKey="#link1">
                <AnnouncementBoard Employee={true}/>  {/* Pass this property to Announcement board that this is user, can't create announcements*/}        
              </Tab.Pane>
              <Tab.Pane eventKey="#link2">
                <ViewSchedule />
              </Tab.Pane>
              <Tab.Pane eventKey="#link3">
                <ClockIn handleShow={this.state.show} handleClose={this.handleClose}/>
              </Tab.Pane>
              <Tab.Pane eventKey="#link4">
                <UpdateInfo />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      </div>
    );
  }
}

export default EmployeePage;