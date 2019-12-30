import React from "react";
import Editor from "../util/Editor";
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
  const [description, setDescription] = React.useState("");
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
    const timestamp = props.firebase.firestore.FieldValue.serverTimestamp();
    let problemRef;
    props.firebase
      .problems()
      .add({
        title: title,
        description: description,
        tags: tags,
        created: timestamp,
        lastModified: timestamp,
        user: props.firebase.currentUser().displayName,
        usersLiked: [],
        rank: 100,
        likes: 0
      })
      .then(docRef => (problemRef = docRef))
      .then(() => {
        tags.forEach(tag => {
          const tagRef = props.firebase.tag(tag);
          tagRef.set({}, { merge: true });
          tagRef.update({
            problems: props.firebase.firestore.FieldValue.arrayUnion(problemRef)
          });
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
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            fullWidth
            onChange={event => setTitle(event.target.value)}
          />
          <Tags setValue={setTags} firebase={props.firebase} />
          <Editor text={description} setText={setDescription} />
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

function Tags(props) {
  const [options, setOptions] = React.useState(allTags());

  function allTags() {
    let options = [];
    props.firebase
      .tags()
      .get()
      .then(querySnapshot =>
        querySnapshot.forEach(doc => options.push(doc.id))
      );
    return options;
  }

  return (
    <div>
      <Autocomplete
        id="tags"
        freeSolo
        multiple
        options={options}
        // options={top100Films.map(option => option.title)}
        renderInput={params => (
          <TextField {...params} label="Tags" margin="dense" fullWidth />
        )}
        onChange={(event, value) => props.setValue(value)}
      />
    </div>
  );
}

export default CreateProblem;
