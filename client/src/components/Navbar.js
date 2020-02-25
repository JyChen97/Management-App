import React, { Fragment } from "react";
import { Navbar, Nav } from "react-bootstrap";

const CustomNavbar = (props) => (
  <Navbar bg="light" expand="md">
    <Navbar.Brand href="/" >C-W</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        {props.isAuthenticated ?
          <Nav.Link href={props.position}>Dashboard</Nav.Link> : null}
      </Nav>
      {props.isAuthenticated
        ? <Nav.Item >
          <Nav.Link onClick={props.handleLogout}>Logout</Nav.Link>
        </Nav.Item>
        : <Fragment>
          <Nav>
            <Nav.Item>
              <Nav.Link href="/signup">Register</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/Login">Sign In</Nav.Link>
            </Nav.Item>
          </Nav>
        </Fragment>
      }
    </Navbar.Collapse>
  </Navbar>
)

export default CustomNavbar;