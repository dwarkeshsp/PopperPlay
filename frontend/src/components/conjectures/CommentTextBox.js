import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { withFirebase } from "../firebase";
import Button from "@material-ui/core/Button";

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

  function post() {
    const path =
      "problems/" +
      conjecture.problem.id +
      "/conjectures/" +
      conjecture.id +
      "/comments/";
    const timestamp = firebase.timestamp();
    const person = firebase.currentPerson().displayName;
    let commentRef;
    firebase
      .comments(path)
      .add({
        content: value,
        creator: person,
        votedBy: [],
        votes: 0,
        created: timestamp,
        lastModified: timestamp,
        path: path,
        tags: conjecture.tags
      })
      .then(docRef => (commentRef = docRef))
      .then(() => {
        conjecture.tags.forEach(tag => {
          const tagRef = firebase.tag(tag);
          tagRef.set({}, { merge: true });
          tagRef.update({
            comments: firebase.arrayUnion(commentRef)
          });
        });
        firebase.person(person).update({
          comments: firebase.arrayUnion(commentRef)
        });
      })
      .then(() => setValue(""))
      .catch(error => console.log(error));
  }

  return (
    <React.Fragment>
      <TextField
        className={classes.textbox}
        id="comment-textbox"
        label="Comment"
        multiline
        rowsMax="4"
        //   variant="outlined"
        value={value}
        onChange={event => setValue(event.target.value)}
      />
      {/* {value && ( */}
      <Button
        className={classes.post}
        variant="contained"
        color="primary"
        disabled={!value}
        onClick={post}
      >
        Post
      </Button>
      {/* )} */}
    </React.Fragment>
  );
}

export default withFirebase(CommentTextBox);
