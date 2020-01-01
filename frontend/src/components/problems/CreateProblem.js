import React from "react";
import Editor from "../util/Editor";
import TagsMenu from "../tags/TagsMenu";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

const { forwardRef, useImperativeHandle } = React;

const CreateProblem = forwardRef((props, ref) => {
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState([]);
  const [details, setDetails] = React.useState("");
  const [valid, setValid] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setValid(title !== "");
  }, [title]);

  useImperativeHandle(ref, () => ({
    handleOpen() {
      setOpen(true);
    }
  }));

  function handleClose() {
    setOpen(false);
  }

  function post() {
    const timestamp = props.firebase.timestamp();
    const user = props.firebase.currentUser().displayName;
    let problemRef;
    props.firebase
      .problems()
      .add({
        title: title,
        details: details,
        tags: tags,
        created: timestamp,
        lastModified: timestamp,
        user: user,
        liked: [],
        // points: 100,
        likes: 0
      })
      .then(docRef => (problemRef = docRef))
      .then(() => {
        tags.forEach(tag => {
          const tagRef = props.firebase.tag(tag);
          tagRef.set({}, { merge: true });
          tagRef.update({
            problems: props.firebase.arrayUnion(problemRef)
          });
        });
        props.firebase.user(user).update({
          problems: props.firebase.arrayUnion(problemRef)
        });
      })
      .catch(error => console.log("Error: ", error));
    handleClose();
  }

  return (
    <div>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">A New Problem!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have discovered where existing conjectures are inadequate!
            Bravo!
          </DialogContentText>
          <TextField
            required
            autoFocus
            multiline
            margin="dense"
            id="title"
            label="Problem"
            fullWidth
            onChange={event => setTitle(event.target.value)}
          />
          <TagsMenu setValue={setTags} variant="outlined" />
          <Editor text={details} setText={setDetails} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={post} color="primary" disabled={!valid}>
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default CreateProblem;
