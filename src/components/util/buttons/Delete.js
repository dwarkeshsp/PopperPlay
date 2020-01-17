import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { withFirebase } from "../../firebase";

function Delete({ item, problem, comment, firebase }) {
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

  function deleteItem() {
    if (problem) {
      deleteProblem();
    } else if (comment) {
      deleteComment();
    } else {
      deleteConjecture();
    }
  }

  function deleteProblem() {}

  function deleteConjecture() {}

  function deleteComment() {}

  return (
    <React.Fragment>
      {authorized && (
        <Fab color="secondary" aria-label="edit" onClick={deleteItem}>
          <DeleteIcon />
        </Fab>
      )}
    </React.Fragment>
  );
}

export default withFirebase(Delete);
