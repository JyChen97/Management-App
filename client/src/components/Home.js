//Home.js
//The front page that user see when they first visit the application
import React, { Component } from "react";
import "./styles/Home.css";
import { Link } from 'react-router-dom';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>C-W</h1>
          <p>An employee management application</p>
          <div >
            <Link to="/signup" className='button'>Sign Up</Link>
            <Link to="/login" className='button'>Login</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;