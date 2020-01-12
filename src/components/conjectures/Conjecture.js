import React from "react";
import { useLocation } from "react-router";
import { withFirebase } from "../firebase";
import Item from "../util/Item";

function Conjecture({ firebase }) {
  const [conjecture, setConjecture] = React.useState(null);
  const [problem, setProblem] = React.useState(null);

  const location = useLocation();
  const path = location.pathname.split("/");
  const problemID = path[path.length - 2];
  const conjectureID = path[path.length - 1];

  React.useEffect(() => {
    firebase
      .conjecture(problemID, conjectureID)
      .get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data();
          data.id = conjectureID;
          setConjecture(data);
        }
      })
      .then(() => {
        firebase
          .problem(problemID)
          .get()
          .then(doc => {
            const data = doc.data();
            data.id = problemID;
            setProblem(data);
          });
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <Item item={conjecture} problemItem={problem} />
    </div>
  );
}

export default withFirebase(Conjecture);
