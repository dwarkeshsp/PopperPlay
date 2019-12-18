import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import Philosophy from "./Philosophy";
import Conjectures from "./Conjectures";
import Problems from "./Problems";
import Feedback from "./Feedback";
import Home from "./Home";

export default function App() {
  return (
    <Router>
      <div>
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
          <Route path="/problems">
            <Problems />
          </Route>
          <Route path="/feedback">
            <Feedback />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
