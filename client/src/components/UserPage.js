import React, { Component } from "react";
import { Tab, ListGroup, Col, Row } from "react-bootstrap";
import "../styles/UserPage.css";
import ClockIn from "./ClockIn";
import AnnouncementBoard from "./AnnouncementBoard";
import ViewSchedule from "./ViewSchedule";
import UpdateInfo from "./UpdateInfo";

class UserPage extends Component {
  constructor(props){
    super(props);

    this.state={
      showClock: false,
      updateSchedule: false
    };
  }

  shouldUpdateSchedule = () =>{
  this.setState({updateSchedule: !this.state.updateSchedule})
}

displayClock = () => {
  this.setState({showClock: !this.state.showClock});
}

  render(){
    return(
      <div className="sideBar">
      <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
        <Row>
          <Col sm={3}>
            <ListGroup>
              <ListGroup.Item action href="#link1" variant="secondary">
                Announcement Board
              </ListGroup.Item>
              <ListGroup.Item action href="#link2" variant="secondary">
                View Schedule
              </ListGroup.Item>
              <ListGroup.Item action href="#link3" onClick={this.displayClock} variant="secondary">
                Timestamp
              </ListGroup.Item>
              <ListGroup.Item action href="#link4" variant="secondary">
                Update Info
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col sm={8}>
            <Tab.Content>
              <Tab.Pane eventKey="#link1">
                <AnnouncementBoard />
              </Tab.Pane>
              <Tab.Pane eventKey="#link2">
                <ViewSchedule updateSchedule={this.state.updateSchedule} shouldUpdateSchedule={this.shouldUpdateSchedule}/>
              </Tab.Pane>
              <Tab.Pane eventKey="#link3">
                <ClockIn handleShow={this.state.showClock} handleClose={this.displayClock} shouldUpdateSchedule={this.shouldUpdateSchedule}/>
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

export default UserPage;