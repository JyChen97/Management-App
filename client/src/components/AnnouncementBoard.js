//File name: AnnouncementBoard.js
//This renders the announcement board page
import React, { Component } from "react";
import { Button, Col} from "react-bootstrap";
import CreatePost from "./CreatePost";
import fire from "../webConfig/Fire";
import axios from "axios";
import "./styles/AnnouncementBoard.css";

class AnnouncementBoard extends Component {
  constructor(props){
    super(props);

    this._isMounted = false         //prevent state from updating when the component is unmounted
    this.state={
      noData: false,
      announcements: [],
      createPost: false,
      title: "",
      post: "",
      currentDate: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // is problematic to use "/", which would create a new directory in the database
      currentTime: new Date().toLocaleTimeString()
    }
  }

  currentTime(){
    if(this._isMounted){        //Check if the component is still mounted
      this.setState({currentTime: new Date().toLocaleTimeString()})     //update the time and date for every second
    }
  }

  getAnnouncements = event =>{
    fire.auth().onAuthStateChanged((user) => {              //check if user is logged in
      if(user){
        fire.auth().currentUser.getIdToken(true)            //get user ID token
        .then( idToken => {                                 //request for announcements from the server attached with the ID token
            axios.post("/getAnnouncement", {
              "id": idToken
            })
            .then( res => {
              if(this._isMounted){                        //Check if the component is still mounted
                if(res.data.noData){                      //If there is no data, update noData state
                  this.setState({noData: true})
                }else{
                  this.setState({
                    announcements: res.data.Announcements       //else update the announcement array
                  })  
                }
              }      
            })
        })
      }
    })
  }

  componentDidMount(){        //Hook that update state
    this._isMounted = true;
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  componentWillMount(){
   this.getAnnouncements()
  }

  handleChange = event =>{
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleCreatePost = event =>{
    this.setState({createPost: true})
  }

  handleClose = event =>{
    this.setState({createPost: false})
  }

  handlePost = event =>{
    event.preventDefault();
    var titlePost = this.state.title
    var newPost = this.state.post
    var date = this.state.currentDate
    var time = this.state.currentTime
    fire.auth().onAuthStateChanged((user) => {                  //check if user is still logged in
      if(user){
        fire.auth().currentUser.getIdToken(true)                //get ID token
        .then( idToken => {
            axios.post("/createAnnouncement", {                 //Posting announcement
              "id"         : idToken,
              "titlePost"  : titlePost,
              "newPost"    : newPost,
              "date"       : date,
              "time"       : time
            })
            .then(res => {
              if(this._isMounted){
                this.setState({createPost: false})            //close the create post modal
                this.getAnnouncements()                       //get announcement after posting a new one
              }
            })
          }
        )
      }
    })
  }

  render(){
    var announcements = this.state.announcements.map((announcement)=>(        //Seperate the array into divs for render 
      <div key={announcement.postTitle} className="post">
        <div className="title">{announcement.postTitle}</div>
        <div id="announcement_content">{announcement.postContent}</div>
        <br></br>
      </div>
    ))
    return(
      <div>
        <Col sm={{ span: 2, offset: 10  }}>
          <Button 
            hidden={this.props.Employee}          //if is employee, can't create new announcement
            type="submit" 
            onClick={this.handleCreatePost}
            >
            Create
          </Button>
        </Col>
        <CreatePost                                  //This component here is the window popup that creates new announcements
          show={this.state.createPost}               //Passes down the function and the require state for creating post
          close={this.handleClose} 
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

export default AnnouncementBoard;