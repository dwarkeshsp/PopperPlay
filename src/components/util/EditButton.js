import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import { withFirebase } from "../firebase";

function EditButton({ item, problem, comment, firebase }) {
  const [authorized, setAuthorized] = React.useState(checkAuthorized());
  function checkAuthorized() {
    return (
      firebase.currentPerson() &&
      item.creator === firebase.currentPerson().displayName
    );
  }

  React.useEffect(() => {
    setAuthorized(checkAuthorized());
  }, [firebase.currentPerson()]);

  function editItem() {
    if (problem) {
      editProblem();
    } else if (comment) {
      editComment();
    } else {
      editConjecture();
    }
  }

  function editProblem() {}

  function editConjecture() {}

  function editComment() {}

  return (
    <React.Fragment>
      {authorized && (
        <Fab color="secondary" aria-label="edit" onClick={editItem}>
          <EditIcon />
        </Fab>
      )}
    </React.Fragment>
  );
}

export default withFirebase(EditButton);
