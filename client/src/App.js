import React, { Component } from "react";
import Routes from "./routes/Routes";
import "./App.css";
import fire from "./webConfig/Fire";
import CustomNavbar from './components/CustomNavbar';
import SetAuthToken from './Auth/SetAuthToken';
import Context from './context/Context';
import { withRouter } from "react-router-dom";
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: null,
      idToken: null,
      jobPosition: ""
    }
  }

  componentDidMount() {
    SetAuthToken();
    this.authListener();
  }

  componentWillUnmount() {
    this.handleLogout();
  }

  //need fix
  getJobPosition = async () => {      //This function should only be called after user login
    try{
      let res = await axios.get('/getJobPosition')
      this.setState({jobPosition: res.data.userPosition})
    } catch(error) {
      console.log(error)
    }
  }

  //listens for user if they are authenticated
  authListener = () => {
    fire.auth().onAuthStateChanged(async (user) => {               //call api provided by Firebase, check to see if there is user 
      if(user){
        let idToken = await fire.auth().currentUser.getIdToken(true)
        sessionStorage.setItem('idToken', idToken)
        SetAuthToken();
        this.setState({user, idToken, isAuthenticated: true});
      }else{
        this.setState({user: null, idToken: null, isAuthenticated: false});
      }
    })
  }

  handleLogout = () => {
    fire.auth().signOut();
    sessionStorage.removeItem('idToken')
    SetAuthToken()
    this.props.history.push("/");
  }

  render() {
    return (
      <div id="app container">
        <CustomNavbar isAuthenticated={this.state.isAuthenticated} handleLogout={this.handleLogout} />
        <Context.Provider value={{state: this.state, getJobPosition: this.getJobPosition}}>
          <Routes />
        </Context.Provider>
      </div>
    );
  }
}

export default withRouter(App);