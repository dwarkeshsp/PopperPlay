import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";
import App from "./components/App";
import Philosophy from "./components/Philosophy";
import Conjectures from "./components/Conjectures";
import Problems from "./components/Problems";
import Feedback from "./components/Feedback";

const routing = (
  <Router>
    <Route path="/" component={App}></Route>
    <Route path="/philosophy" component={Philosophy} />
    <Route path="/conjectures" component={Conjectures} />
    <Route path="/problems" component={Problems} />
    <Route path="/feedback" component={Feedback} />
  </Router>
);

ReactDOM.render(<App />, document.getElementById("root"));
