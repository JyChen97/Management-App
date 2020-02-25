import React, { Component } from "react";
import Routes from "./Routes";
import "./components/styles/App.css";
import fire from "./webConfig/Fire";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Context from './Context';
import CustomNavbar from './components/Navbar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      ID: null
    }
  }

  componentDidMount() {
    this.authListener();
  }

  //listens for user if they are authenticated
  authListener = event => {
    fire.auth().onAuthStateChanged(async (user) => {               //call api provided by Firebase, check to see if there is user 

      if (user) {
        user.reload();
        if (user.emailVerified) {                       //check to see if the user verified their email
          let idToken = await fire.auth().currentUser.getIdToken(true)      //get ID token
          this.setState(
            { 
              isAuthenticated: true, 
              ID: idToken 
            });
          let res = await axios.post("/login", { "id": idToken })
          let jobPosition = res.data
          if (jobPosition === "Worker") {
            this.props.history.push("/EmployeePage")
          } else {
            this.props.history.push("/EmployerPage")
          }
        }
      } else {
        this.setState({ isAuthenticated: false });
      }
    })
  }

  handleLogout = () => {
    fire.auth().signOut();
    this.props.history.push("/");
  }

  render() {
    return (
      <div id="app container">
        <CustomNavbar isAuthenticated={this.state.isAuthenticated} position={this.state.position} handleLogout={this.handleLogout} />
        <Context.Provider value={this.state.ID}>
          <Routes />
        </Context.Provider>
      </div>
    );
  }
}

export default withRouter(App);