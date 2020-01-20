import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "../../firebase";

function editButton({ item, firebase, problem, comment, newDetails }) {
  function edit() {
    if (problem) {
      editProblem();
    } else if (comment) {
      editComment();
    } else {
      editConjecture();
    }
  }

  function editProblem() {
    const timestamp = firebase.timestamp();
    firebase.problem(item.id).update({
      details: newDetails,
      lastModified: timestamp
    });
  }

  function editComment() {}

  function editConjecture() {
    const timestamp = firebase.timestamp();
    firebase.conjecture(item.problem.id, item.id).update({
      details: newDetails,
      lastModified: timestamp
    });
  }

  return (
    <React.Fragment>
      {firebase.currentPerson().displayName === item.creator && (
        <IconButton
          //   edge="end"
          aria-label="edit"
          color="secondary"
          onClick={edit}
        >
          <EditIcon />
        </IconButton>
      )}
    </React.Fragment>
  );
}

export default withFirebase(editButton);
