//File name: App.js
//Contains the navbar for my application
import React, { Component, Fragment } from "react";
import { Navbar, Nav} from "react-bootstrap";
import Routes from "./Routes";
import "./components/styles/App.css";
import fire from "./webConfig/Fire";
import { withRouter } from "react-router-dom";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      position: ""
    }
  }

  //React lifecycle Method
  //Once this component is mounted on the DOM, authListener will be executed 
  componentDidMount(){
    this.authListener();
  }

  //listens for user if they are authenticated
  authListener = event => {
    fire.auth().onAuthStateChanged( user => {               //call cloud functions provided by Firebase, check to see if there is user 
      if(user && user.emailVerified){                       //check to see if the user verified their email
        this.setState({isAuthenticated: true});             //change the state isAuthenthicated to true
        fire.auth().currentUser.getIdToken(true)            //get the Id token whenever user login
        .then(idToken => {
          axios.post("/login", {"id": idToken})             //pass it to server for validation so user can be redirected
          .then(res =>{
            if(res.data === "Worker"){
              this.setState({position: "/EmployeePage"})
            }else if(res.data === "Manager"){
              this.setState({position: "/EmployerPage"})
            }
          })
          .catch(error =>{
            console.log(error)
          })
        })
      }else{
        this.setState({isAuthenticated: false});
      }
    });
  }

  handleLogout = event => {
    fire.auth().signOut();
    this.props.history.push("/");
  }

  render() {
    return (
      //This section is the navbar:
      <div id = "app container">
        <Navbar bg="light" expand="md">
        <Navbar.Brand  href="/">C-W</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
           {this.state.isAuthenticated?
            <Nav.Link href={this.state.position}>Dashboard</Nav.Link> : null}
          </Nav>
          {this.state.isAuthenticated
          ? <Nav.Item >
              <Nav.Link onClick={this.handleLogout}>Logout</Nav.Link>
            </Nav.Item>
          : <Fragment>
              <Nav>
              <Nav.Item>
                <Nav.Link href ="/signup">Register</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href ="/Login">Sign In</Nav.Link>
              </Nav.Item>
              </Nav>
            </Fragment>
          }
          </Navbar.Collapse>
        </Navbar>
        <Routes />
      </div>
    );
  }

}

export default withRouter(App);