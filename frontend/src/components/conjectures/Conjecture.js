import React from "react";
import { useLocation } from "react-router";
import { withFirebase } from "../firebase";
import Item from "../util/Item";

function Conjecture({ firebase }) {
  const [conjecture, setConjecture] = React.useState(null);

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
      .catch(error => console.log(error));
  }, []);

  return <Item item={conjecture} />;
}

export default withFirebase(Conjecture);
