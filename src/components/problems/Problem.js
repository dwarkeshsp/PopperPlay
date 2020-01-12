import React from "react";
import { useLocation } from "react-router";
import { withFirebase } from "../firebase";
import Item from "../util/Item";

function Problem({ firebase }) {
  const [problem, setProblem] = React.useState(null);

  const location = useLocation();
  const path = location.pathname.split("/");
  const problemID = path[path.length - 1];

  React.useEffect(() => {
    firebase
      .problem(problemID)
      .get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data();
          data.id = problemID;
          setProblem(data);
        }
      })
      .catch(error => console.log(error));
  }, []);

  return <Item item={problem} problemID={problemID} problem />;
}

export default withFirebase(Problem);
