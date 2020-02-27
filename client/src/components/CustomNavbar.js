import React, { Fragment } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const CustomNavbar = (props) => (
  <Navbar bg="light" expand="md">
    <Navbar.Brand as={Link} to="/" href="/" >C-W</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        {props.isAuthenticated ?
          <Nav.Link as={Link} to="/EmployerPage" href="/EmployerPage">Dashboard</Nav.Link> : null}
      </Nav>
      {props.isAuthenticated
        ? <Nav.Item >
          <Nav.Link onClick={props.handleLogout}>Logout</Nav.Link>
        </Nav.Item>
        : <Fragment>
          <Nav className="navItem">
            <Nav.Item>
              <Nav.Link as={Link} to="/signup" href="/signup">Register</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/Login" href="/Login">Sign In</Nav.Link>
            </Nav.Item>
          </Nav>
        </Fragment>
      }
    </Navbar.Collapse>
  </Navbar>
)

export default CustomNavbar;