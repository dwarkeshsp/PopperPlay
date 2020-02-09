import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import React from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "../../firebase";
import { AuthUserContext } from "../../session";
import Dialog from "../AlertDialog";

function VoteButton({ item, firebase }) {
  const { votedBy, id } = item;
  const alertRef = React.useRef();
  const [voteIconColor, setVoteIconColor] = React.useState("default");

  React.useEffect(() => {
    setVoteIconColor(votedByCurrentPerson());
  }, [id]);

  function votedByCurrentPerson() {
    if (
      firebase.currentPerson() &&
      votedBy.includes(firebase.currentPerson().displayName)
    ) {
      return "primary";
    } else {
      return "default";
    }
  }

  // *** Not synced across devices
  function vote() {
    if (item.problem) voteProblem();
    if (item.conjecture) voteConjecture();
    if (item.comment) voteComment();
  }

  function voteComment() {}

  function voteConjecture() {
    if (voteIconColor === "default") {
      setVoteIconColor("primary");
      // increment votes and add user to item voters
      firebase.conjecture(id).update({
        votes: firebase.firestore.FieldValue.increment(1),
        votedBy: firebase.arrayUnion(firebase.currentPerson().displayName)
      });
      // add item to votedBy by user
      firebase.person(firebase.currentPerson().displayName).update({
        conjecturesVoted: firebase.arrayUnion(
          firebase.db.doc("/conjectures/" + id)
        )
      });
    } else {
      // reverse
      setVoteIconColor("default");
      firebase.conjecture(id).update({
        votes: firebase.firestore.FieldValue.increment(-1),
        votedBy: firebase.firestore.FieldValue.arrayRemove(
          firebase.currentPerson().displayName
        )
      });
      firebase.person(firebase.currentPerson().displayName).update({
        conjecturesVoted: firebase.firestore.FieldValue.arrayRemove(
          firebase.db.doc("/conjectures/" + id)
        )
      });
    }
  }

  function voteProblem() {
    if (voteIconColor === "default") {
      setVoteIconColor("primary");
      // increment votes and add user to item voters
      firebase.problem(id).update({
        votes: firebase.firestore.FieldValue.increment(1),
        votedBy: firebase.arrayUnion(firebase.currentPerson().displayName)
      });
      // add item to votedBy by user
      firebase.person(firebase.currentPerson().displayName).update({
        problemsVoted: firebase.arrayUnion(firebase.db.doc(`problems/${id}`))
      });
    } else {
      // reverse
      setVoteIconColor("default");
      firebase.problem(id).update({
        votes: firebase.firestore.FieldValue.increment(-1),
        votedBy: firebase.firestore.FieldValue.arrayRemove(
          firebase.currentPerson().displayName
        )
      });
      firebase.person(firebase.currentPerson().displayName).update({
        problemsVoted: firebase.firestore.FieldValue.arrayRemove(
          firebase.db.doc(`problems/${id}`)
        )
      });
    }
  }

  return (
    <Link onClick={e => e.preventDefault()} style={{ textDecoration: "none" }}>
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            <IconButton
              edge="end"
              aria-label="vote"
              color={voteIconColor}
              onClick={() =>
                authUser ? vote() : alertRef.current.handleOpen()
              }
            >
              <ThumbUpIcon />
            </IconButton>
            <Dialog
              ref={alertRef}
              title="Not logged in"
              message={"You must login in order to perform this action"}
              button="Okay"
            />
          </React.Fragment>
        )}
      </AuthUserContext.Consumer>
    </Link>
  );
}

export default withFirebase(VoteButton);
