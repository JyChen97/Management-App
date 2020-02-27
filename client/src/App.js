import React, { Component } from "react";
import Routes from "./Routes";
import "./components/styles/App.css";
import fire from "./webConfig/Fire";
import { withRouter } from "react-router-dom";
import CustomNavbar from './components/CustomNavbar';
import SetAuthToken from './SetAuthToken';
import Context from './Context';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    }
  }

  componentDidMount() {
    //this.authListener();
  }

  //listens for user if they are authenticated
  authListener = event => {
    fire.auth().onAuthStateChanged(async (user) => {               //call api provided by Firebase, check to see if there is user 
      if (user) {
        user.reload();
        if (user.emailVerified) {                       //check to see if the user verified their email
          try {
            let idToken = await fire.auth().currentUser.getIdToken(true)      //get ID token
            this.setState({ isAuthenticated: true });
            SetAuthToken(idToken);
            this.props.history.push("/EmployerPage")
          } catch (error) {
            console.error(error)
          }
        } else {
          console.log('app.js signout')
          fire.auth().signOut();
        }
      } else {
        this.setState({ isAuthenticated: false });
      }
    })
  }

  handleLogout = () => {
    SetAuthToken()
    fire.auth().signOut();
    this.props.history.push("/");
  }

  render() {
    return (
      <div id="app container">
        <CustomNavbar isAuthenticated={this.state.isAuthenticated} handleLogout={this.handleLogout} />
        <Context.Provider value={this.authListener}>
          <Routes />
        </Context.Provider>
      </div>
    );
  }
}

export default withRouter(App);