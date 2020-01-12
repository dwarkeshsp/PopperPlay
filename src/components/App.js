import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthentication } from "./session";
import Home from "./Home";
import AppBar from "./navigation/Navigation";
import Conjectures from "./conjectures/Conjectures";
import Conjecture from "./conjectures/Conjecture";
import Problems from "./problems/Problems";
import Problem from "./problems/Problem";
import People from "./people/People";
import Person from "./people/Person";
import Tags from "./tags/Tags";
import Tag from "./tags/Tag";
import Philosophy from "./philosophy/Philosophy";
import Feedback from "./feedback/Feedback";
import Login from "./login/Login";
import Signup from "./login/Signup";

function App() {
  return (
    <Router>
      <div>
        <AppBar />
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
          <Route path="/conjecture/:id">
            <Conjecture />
          </Route>
          <Route path="/problems">
            <Problems />
          </Route>
          <Route path="/problem/:id">
            <Problem />
          </Route>
          <Route path="/people">
            <People />
          </Route>
          <Route path="/person/:username">
            <Person />
          </Route>
          <Route path="/tags">
            <Tags />
          </Route>
          <Route path="/tag/:tag">
            <Tag />
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

export default withAuthentication(App);
