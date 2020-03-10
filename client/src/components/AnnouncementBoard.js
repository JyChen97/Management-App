import React, { Component } from "react";
import { Button, Accordion, Card, } from "react-bootstrap";
import CreatePost from "./CreatePost";
import axios from "axios";
import Context from '../context/Context';
import Spinner from './Spinner';

class AnnouncementBoard extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false         //prevent state from updating when the component is unmounted
    this.state = {
      noData: false,
      announcements: [],
      createPost: false,
      title: "",
      post: "",
      dateAndTime: null,
      loading: false
    }
  }

  setDateAndTime() {
    if (this._isMounted) {
      this.setState({ dateAndTime: new Date().toLocaleDateString().replace('/', '-').replace('/', '-') + ' ' + new Date().toLocaleTimeString() })
    }
  }

  getAnnouncements = async () => {
    try {
      this.setState({loading: true})
      let res = await axios.post("/getAnnouncement")
      if (this._isMounted) {
        this.setState({loading: false})
        if (res.data.noData) {                      //If there is no data, update noData state
          this.setState({ noData: true })
        } else {
          this.setState({
            announcements: res.data.Announcements       //else update the announcement array
          })
        }
      }
    } catch (error) {
      if (error.response.status === 500){
      }
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.getAnnouncements()
    this.setDateAndTime();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handlePostForm = () => {
    this.setState({ createPost: !this.state.createPost })
  }

  handlePost = async event => {
    event.preventDefault();
    let { title, post, dateAndTime } = this.state;
    try {
      await axios.post("/createAnnouncement", {                 //Posting announcement
        "postTitle": title,
        "postContent": post,
        dateAndTime
      })
      if (this._isMounted) {
        this.setState({ createPost: false })            //close the create post modal
        this.getAnnouncements()                       //get announcement after posting a new one
        this.setDateAndTime()
      }
    } catch (error) {
      console.log(error.response)
    }
  }

  render() {
    var announcements = this.state.announcements.map((announcement, i) => (        //Seperate the array into divs for render 
      <Card key={i}>
        <Accordion.Toggle as={Card.Header} eventKey={i}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>{announcement.postTitle} </div>
            <div>{announcement.dateAndTime}</div>
          </div>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={i}>
          <Card.Body>{announcement.postContent}</Card.Body>
        </Accordion.Collapse>
      </Card>
    ))

    return this.state.loading ? (
      <Spinner />
    ) : (
        <div>
          <div
            style={{
              textAlign: "center",
              fontSize: "1.5rem",
            }}
            className="p-3 mb-2 bg-secondary text-white"
          >
            Announcements
          </div>
          <CreatePost                                  //This component here is the window popup that creates new announcements
            show={this.state.createPost}               //Passes down the function and the require state for creating post
            close={this.handlePostForm}
            submit={this.handlePost}
            change={this.handleChange}
            post={this.state.post}
            title={this.state.title}
          />
          {this.state.announcements.length                  //checks if there are announcements
            ? <Accordion defaultActiveKey="0">
              {announcements}
            </Accordion>
            : this.state.noData                             //Check if the page is current loading or if there is no announcement 
              ? <div>No Announcements</div>
              : <div> Loading . . . </div>
          }
          <div style={{ display: "flex", justifyContent: "flex-end" }} >
            <Button
              type="submit"
              onClick={this.handlePostForm}
              variant="secondary"
              size="lg"
              style={{ margin: "auto !important", display: this.props.jobPosition === "Manager"? "block" : "none" }}
              active
            >
              Create Announcement
          </Button>
          </div>
        </div>
      )
  }
}

const getUserInfo = (props) => (
  <Context.Consumer>
    {(value) => {
      const { user, idToken } = value.state;
      return <AnnouncementBoard user={user} idToken={idToken} {...props} />
    }
    }
  </Context.Consumer>
)

export default getUserInfo;