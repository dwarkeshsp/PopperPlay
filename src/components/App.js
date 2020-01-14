import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Conjecture from "./conjectures/Conjecture";
import Conjectures from "./conjectures/Conjectures";
import Feedback from "./feedback/Feedback";
import Home from "./home/Home";
import Login from "./login/Login";
import Signup from "./login/Signup";
import Header from "./navigation/Header";
import AppBar from "./navigation/Navigation";
import People from "./people/People";
import Person from "./people/Person";
import Philosophy from "./philosophy/Philosophy";
import Problem from "./problems/Problem";
import Problems from "./problems/Problems";
import { withAuthentication } from "./session";
import Tag from "./tags/Tag";
import Tags from "./tags/Tags";
import NotFound from "./util/NotFound";

function App() {
  return (
    <Router>
      <div>
        <AppBar />
        <Header />
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
          <Route exact path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default withAuthentication(App);
