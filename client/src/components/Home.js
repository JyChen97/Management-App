import React from "react";
import "../styles/Home.css";
import { Link } from 'react-router-dom';
import Context from '../context/Context';

const Home = (props) => (
  <div className="Home">
    <div className="lander">
      <h1>C-W</h1>
      <p>An employee management application</p>
      {props.user ? (
        "You are sign in"
      ) : (
        <div >
          <Link to="/signup" className="button">Sign Up</Link>
          <Link to="/login" className="button">Login</Link>
        </div>
      )}
    </div>
  </div>
);

const getUser = (props) => (
  <Context.Consumer>
    {(value) => {
      const { user } = value.state;
      return <Home user={user} {...props} />
    }}
  </Context.Consumer>
)

export default getUser;