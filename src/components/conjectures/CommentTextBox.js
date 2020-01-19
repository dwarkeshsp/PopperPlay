import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { withFirebase } from "../firebase";
import Button from "@material-ui/core/Button";
import { AuthUserContext } from "../session";
import Dialog from "../util/AlertDialog";

const useStyles = makeStyles(theme => ({
  textbox: {
    width: "100%"
  },
  post: {
    marginTop: "1rem"
  }
}));

function CommentTextBox({ conjecture, firebase }) {
  const classes = useStyles();
  const [value, setValue] = React.useState("");
  const alertRef = React.useRef();

  async function post() {
    const path =
      "problems/" +
      conjecture.problem.id +
      "/conjectures/" +
      conjecture.id +
      "/comments/";
    const timestamp = firebase.timestamp();
    const person = firebase.currentPerson().displayName;
    const commentRef = await firebase.collection(path).add({
      content: value,
      creator: person,
      votedBy: [],
      votes: 0,
      created: timestamp,
      lastModified: timestamp,
      path: path,
      level: 0,
      tags: conjecture.tags
    });
    await conjecture.tags.forEach(tag => {
      const tagRef = firebase.tag(tag);
      tagRef.set({}, { merge: true });
      tagRef.update({
        comments: firebase.arrayUnion(commentRef)
      });
    });
    await firebase.person(person).update({
      comments: firebase.arrayUnion(commentRef)
    });
    setValue("");
  }

  return (
    <React.Fragment>
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            <TextField
              className={classes.textbox}
              id="comment-textbox"
              label="Criticize / Improve"
              multiline
              rowsMax="4"
              variant="outlined"
              value={value}
              onChange={event => setValue(event.target.value)}
            />
            <Button
              className={classes.post}
              variant="contained"
              color="primary"
              disabled={!value}
              onClick={authUser ? post : () => alertRef.current.handleOpen()}
            >
              Post
            </Button>
            <Dialog
              ref={alertRef}
              title="Not logged in"
              message={"You must login in order to perform this action."}
              button="Okay"
            />
          </React.Fragment>
        )}
      </AuthUserContext.Consumer>
    </React.Fragment>
  );
}

export default withFirebase(CommentTextBox);
