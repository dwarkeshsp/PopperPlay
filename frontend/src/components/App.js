import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthentication } from "./session";
import Home from "./Home";
import AppBar from "./navigation/Navigation";
import Philosophy from "./Philosophy";
import Conjectures from "./conjectures/Conjectures";
import Problems from "./problems/Problems";
import Feedback from "./Feedback";
import Login from "./login/Login";
import Signup from "./login/Signup";
import Container from "@material-ui/core/Container";

function App() {
  return (
    <Router>
      <div>
        <AppBar />
        {/* <Header /> */}
        <Container maxWidth="md">
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
        </Container>
      </div>
    </Router>
  );
}

export default withAuthentication(App);
