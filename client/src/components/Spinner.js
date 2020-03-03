import React, { Fragment } from 'react';
import spinner from '../images/spinner.gif';
import '../styles/Spinner.css';

export default () => (
  <Fragment >
    <img src={spinner} 
          style={{}}
          alt='Loading...'
          className="overlay"
    />
  </Fragment>
)