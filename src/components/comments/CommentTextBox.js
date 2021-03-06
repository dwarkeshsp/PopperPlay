import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { withFirebase } from "../firebase";
import { AuthUserContext } from "../session";
import Dialog from "../util/AlertDialog";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  textbox: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  post: {
    padding: 10
  }
}));

function CommentTextBox({ conjecture, firebase }) {
  const classes = useStyles();
  const [value, setValue] = React.useState("");
  const alertRef = React.useRef();

  async function post() {
    const path = "conjectures/" + conjecture.id + "/comments/";
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
    firebase.person(person).update({
      comments: firebase.arrayUnion(commentRef)
    });
    firebase.conjecture(conjecture.id).update({
      comments: firebase.firestore.FieldValue.increment(1)
    });
    setValue("");
  }

  return (
    <React.Fragment>
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            <Paper component="form" className={classes.root}>
              <InputBase
                className={classes.textbox}
                placeholder="Criticize / Improve"
                inputProps={{ "aria-label": "comment-textbox" }}
                multiline
                rowsMax="10"
                variant="outlined"
                value={value}
                onChange={event => setValue(event.target.value)}
              />
              <Button
                className={classes.post}
                // variant="contained"
                color="primary"
                disabled={!value}
                onClick={authUser ? post : () => alertRef.current.handleOpen()}
              >
                Comment
              </Button>
            </Paper>
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
