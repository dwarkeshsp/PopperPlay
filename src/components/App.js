import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import AppBar from "./AppBar"
import Header from "./Header";
import Philosophy from "./Philosophy";
import Conjectures from "./Conjectures";
import Problems from "./Problems";
import Feedback from "./Feedback";
import Login from "./login/Login"
import Signup from "./login/Signup";

export default function App() {
  return (
    <Router>
      <div>
        <AppBar />
        {/* <Header /> */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/philosophy">
            <Philosophy />
          </Route>
          <Route path="/conjectures">
            <Conjectures />
          </Route>
          <Route path="/problems">
            <Problems />
          </Route>
          <Route path="/feedback">
            <Feedback />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
