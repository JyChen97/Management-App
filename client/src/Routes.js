import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Popup from "./components/Popup";
import EmployerPage from "./components/EmployerPage";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={Login} />
    <Route path="/News" exact component={Popup} />
    <Route path="/signup" exact component={Signup} />
    <Route path="/EmployerPage" exact component={EmployerPage} />
    <Route component={NotFound} />
  </Switch>;