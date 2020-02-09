import React from "react";
import { withFirebase } from "../firebase";
import CommentCard from "./CommentCard";

function CommentsList({ conjecture, firebase }) {
  const [comments, setComments] = React.useState([]);
  const [lastComment, setLastComment] = React.useState(null);

  // const LOADSIZE = 5;
  const orderBy = "created";
  const path = "conjectures/" + conjecture.id + "/comments";

  React.useEffect(() => {
    firebase
      .collection(path)
      .orderBy(orderBy, "desc")
      // .limit(LOADSIZE)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
        setLastComment(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setComments(data);
      });
  }, []);

  // function lazyLoad() {
  //   if (lastComment) {
  //     firebase
  //       .commentStartAfterQuery(orderBy, LOADSIZE, lastComment, path)
  //       .then(querySnapshot => {
  //         const data = querySnapshot.docs.map(doc => doc.data());
  //         querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
  //         setLastComment(querySnapshot.docs[querySnapshot.docs.length - 1]);
  //         setComments(comments.concat(data));
  //       })
  //       .catch(error => console.log(error));
  //   }
  // }

  return (
    <div style={{ marginBottom: "1rem" }}>
      {comments.map(comment => (
        <CommentCard comment={comment} />
      ))}
      {/* <BottomScrollListener onBottom={lazyLoad} /> */}
    </div>
  );
}

export default withFirebase(CommentsList);
