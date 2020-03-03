import React, { Component } from "react";
import { Button, Col } from "react-bootstrap";
import CreatePost from "./CreatePost";
import axios from "axios";
import Context from '../context/Context';
import "../styles/AnnouncementBoard.css";
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
      dateAndTime : null,
      loading: false
    }
  }

  setDateAndTime() {
    if (this._isMounted) {
      this.setState({ dateAndTime: new Date().toLocaleDateString().replace('/', '-').replace('/', '-') + ' ' + new Date().toLocaleTimeString()}) 
    }
  }

  getAnnouncements = async () => {
    try {
      let res = await axios.post("/getAnnouncement")
      if (this._isMounted) {
        this.setState({ loading: false })
        if (res.data.noData) {                      //If there is no data, update noData state
          this.setState({ noData: true })
        } else {
          this.setState({
            announcements: res.data.Announcements       //else update the announcement array
          })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.setState({ loading: true })
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
        this.setState({ createPost: false, loading: true })            //close the create post modal
        this.getAnnouncements()                       //get announcement after posting a new one
        this.setDateAndTime()
      }
    } catch (error) {
      console.log( error.response)
    }
  }

  render() {
    var announcements = this.state.announcements.map((announcement, i) => (        //Seperate the array into divs for render 
      <div key={i} className="post">
        <div className="title">{announcement.postTitle}</div>
        <div id="announcement_content">{announcement.postContent}</div>
        <br></br>
      </div>
    ))

    return this.state.loading ?
        <Spinner />
      : (
        <div>
          <Col sm={{ span: 2, offset: 10 }}>
            <Button
              hidden={this.props.Employee}          //if is employee, can't create new announcement
              type="submit"
              onClick={this.handlePostForm}
            >
              Create
          </Button>
          </Col>
          <CreatePost                                  //This component here is the window popup that creates new announcements
            show={this.state.createPost}               //Passes down the function and the require state for creating post
            close={this.handlePostForm}
            submit={this.handlePost}
            change={this.handleChange}
            post={this.state.post}
            title={this.state.title}
          />

          {this.state.announcements.length                  //checks if there are announcements
            ? announcements
            : this.state.noData                             //Check if the page is current loading or if there is no announcement 
              ? <div>No Announcements</div>
              : <div>Loading . . .</div>
          }
        </div>
      )
  }
}

const getUserInfo = (props) => (
  <Context.Consumer>
    {(value) => {
      const { user, idToken } = value;
      return <AnnouncementBoard user={user} idToken={idToken} {...props} />
    }
    }
  </Context.Consumer>
)

export default getUserInfo;