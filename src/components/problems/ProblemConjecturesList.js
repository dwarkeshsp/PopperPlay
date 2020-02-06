import React from "react";
import BottomScrollListener from "react-bottom-scroll-listener";
import { withFirebase } from "../firebase";
import Card from "../util/Card";

function ProblemConjecturesList({ problem, firebase }) {
  const [conjectures, setConjectures] = React.useState([]);
  const [lastConjecture, setLastConjecture] = React.useState(null);
  const problemID = problem.id;

  const LOADSIZE = 5;
  const orderBy = "votes";

  React.useEffect(() => {
    firebase
      .conjectures()
      .where(
        "parentProblems",
        "array-contains",
        firebase.db.doc(`problems/${problemID}`)
      )
      .orderBy("votes", "desc")
      .limit(LOADSIZE)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
        setLastConjecture(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setConjectures(data);
      });
  }, []);

  function lazyLoad() {
    if (lastConjecture) {
      firebase
        .startAfterQuery(orderBy, LOADSIZE, lastConjecture)
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
          setLastConjecture(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setConjectures(conjectures.concat(data));
        })
        .catch(error => console.log(error));
    }
  }

  return (
    <div>
      {conjectures.map(conjecture => (
        <Card item={conjecture} />
      ))}
      <BottomScrollListener onBottom={lazyLoad} />
    </div>
  );
}

export default withFirebase(ProblemConjecturesList);
