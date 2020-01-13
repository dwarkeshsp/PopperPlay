import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import TagsMenu from "../tags/TagsMenu";
import Editor from "./Editor";
const { forwardRef, useImperativeHandle } = React;

const CreatePost = forwardRef(({ firebase, problem, problemItem }, ref) => {
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState([]);
  const [details, setDetails] = React.useState("");
  const [valid, setValid] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  // only for conjectures
  const [parentProblemTitle, setParentProblemTitle] = React.useState("");

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

  function postProblem() {
    const timestamp = firebase.timestamp();
    const person = firebase.currentPerson().displayName;
    let problemRef;
    firebase
      .problems()
      .add({
        title: title,
        details: details,
        tags: tags,
        created: timestamp,
        lastModified: timestamp,
        creator: person,
        votedBy: [],
        votes: 0
      })
      .then(docRef => (problemRef = docRef))
      .then(() => {
        tags.forEach(tag => {
          const tagRef = firebase.tag(tag);
          tagRef.set({}, { merge: true });
          tagRef.update({
            problems: firebase.arrayUnion(problemRef)
          });
        });
        firebase.person(person).update({
          problems: firebase.arrayUnion(problemRef)
        });
      })
      .catch(error => console.log(error));
    handleClose();
  }

  function postConjecture() {
    const timestamp = firebase.timestamp();
    const person = firebase.currentPerson().displayName;
    if (!problemItem) {
      postParentProblem()
        .then(problemRef => post(problemRef.id))
        .catch(error => console.log(error));
    } else {
      post(problemItem.id);
    }

    // post conjecture inside the problem
    function post(problemID) {
      let conjectureRef;
      firebase
        .problemConjectures(problemID)
        .add({
          title: title,
          details: details,
          tags: tags,
          problem: firebase.db.doc(`problems/${problemID}`),
          created: timestamp,
          lastModified: timestamp,
          creator: person,
          votedBy: [],
          votes: 0
        })
        .then(docRef => (conjectureRef = docRef))
        .then(() => {
          tags.forEach(tag => {
            const tagRef = firebase.tag(tag);
            tagRef.set({}, { merge: true });
            tagRef.update({
              conjectures: firebase.arrayUnion(conjectureRef)
            });
          });
          firebase.person(person).update({
            conjectures: firebase.arrayUnion(conjectureRef)
          });
        })
        .catch(error => console.log(error));
    }

    // post parent problem
    function postParentProblem() {
      let problemRef;
      return firebase
        .problems()
        .add({
          title: parentProblemTitle,
          tags: tags,
          details: "",
          created: timestamp,
          lastModified: timestamp,
          creator: person,
          votedBy: [],
          votes: 0
        })
        .then(docRef => (problemRef = docRef))
        .then(() => {
          tags.forEach(tag => {
            const tagRef = firebase.tag(tag);
            tagRef.set({}, { merge: true });
            tagRef.update({
              problems: firebase.arrayUnion(problemRef)
            });
          });
          firebase.person(person).update({
            problems: firebase.arrayUnion(problemRef)
          });
          return problemRef;
        })
        .catch(error => console.log(error));
    }
    handleClose();
  }

  return (
    <Dialog
      open={open}
      // onClose={handleClose}
      aria-labelledby="create-title"
    >
      <DialogTitle id="create-title">
        {problem ? "A New Problem!" : "A New Conjecture"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {problem
            ? "You have discovered where existing conjectures are inadequate! Bravo!"
            : "You are solving a problem by making a creative conjecture. Bravo!"}
        </DialogContentText>

        {!problem && !problemItem && (
          <React.Fragment>
            <DialogContentText>
              To solve an already posted problem, please find it on the problems
              page
            </DialogContentText>
            <TextField
              required
              autoFocus
              multiline
              margin="dense"
              id="title"
              label="Problem"
              fullWidth
              onChange={event => setParentProblemTitle(event.target.value)}
            />
          </React.Fragment>
        )}
        <TextField
          required
          autoFocus
          multiline
          margin="dense"
          id="title"
          label={problem ? "Problem" : "Conjecture"}
          fullWidth
          onChange={event => setTitle(event.target.value)}
        />
        <TagsMenu setValue={setTags} variant="outlined" />
        <Typography variant="caption">
          {tags.length} {tags.length === 1 ? "tag" : "tags"}
        </Typography>
        <a
          href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
          target="_blank"
        >
          <Typography variant="body2">Markdown is supported below</Typography>
        </a>
        <Editor text={details} setText={setDetails} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={problem ? postProblem : postConjecture}
          color="primary"
          disabled={!valid}
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default CreatePost;
