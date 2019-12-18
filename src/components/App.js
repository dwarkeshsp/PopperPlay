import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import Header from "./Header";
import Philosophy from "./Philosophy";
import Conjectures from "./Conjectures";
import Problems from "./Problems";
import Feedback from "./Feedback";


function App() {
  return (
    <div>
      <Header />
    </div>
  );
}

export default App;
