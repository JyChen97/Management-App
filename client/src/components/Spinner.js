import React, { Fragment } from 'react';
import spinner from '../images/spinner.gif';

export default () => (
  <Fragment >
    <img src={spinner} 
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            left: "0",
            bottom: "0",
            width: "200px", 
            margin: "auto", 
            display: "block"
          }}
          alt='Loading...'
    />
  </Fragment>
)