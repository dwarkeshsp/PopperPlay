import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { convertToRaw } from "draft-js";
import { draftjsToMd } from "draftjs-md-converter";
import MUIRichTextEditor from "mui-rte";
import React from "react";
import TagsMenu from "../tags/TagsMenu";
import ProblemsMenu from "../problems/ProblemsMenu";

const { forwardRef, useImperativeHandle } = React;

const CreatePost = forwardRef((props, ref) => {
  console.log(props);
  const { firebase, problem, problemItem, conjectureItem } = props;

  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState(
    problemItem ? problemItem.tags : conjectureItem ? conjectureItem.tags : []
  );
  const [details, setDetails] = React.useState("");
  const [valid, setValid] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [fullScreen, setFullScreen] = React.useState(true);
  // only for conjectures
  const [parentProblemTitle, setParentProblemTitle] = React.useState("");
  // const [parentProblems, setParentProblems] = React.useState([]);

  const MINTITLELENGTH = 1;

  React.useEffect(() => {
    let valid =
      title.length >= MINTITLELENGTH &&
      (problemItem ||
        conjectureItem ||
        problem ||
        parentProblemTitle.length >= MINTITLELENGTH);
    setValid(valid);
  }, [title, parentProblemTitle]);

  useImperativeHandle(ref, () => ({
    handleOpen() {
      setOpen(true);
    }
  }));

  function handleClose() {
    setTitle("");
    setParentProblemTitle("");
    setDetails("");
    setValid(false);
    if (!problemItem && !conjectureItem) {
      setTags([]);
    }
    setOpen(false);
  }

  async function postProblemBase(
    problemTitle,
    problemDetails,
    parentConjectures,
    childConjectures
  ) {
    const timestamp = firebase.timestamp();
    const person = firebase.currentPerson().displayName;
    const problemRef = await firebase.problems().add({
      title: problemTitle,
      details: problemDetails,
      tags: tags,
      created: timestamp,
      lastModified: timestamp,
      creator: person,
      votedBy: [],
      votes: 0,
      parentConjectures: parentConjectures,
      childConjectures: childConjectures
    });
    tags.forEach(tag => {
      const tagRef = firebase.tag(tag);
      tagRef.set({}, { merge: true });
      tagRef.update({
        problems: firebase.arrayUnion(problemRef)
      });
    });
    conjectureItem &&
      (await firebase.conjecture(conjectureItem.id).update({
        childProblems: firebase.arrayUnion(problemRef)
      }));
    firebase.person(person).update({
      problems: firebase.arrayUnion(problemRef)
    });
    return problemRef.id;
  }

  async function postProblem() {
    const parentConjectures = conjectureItem
      ? [firebase.db.doc(`conjectures/${conjectureItem.id}`)]
      : [];
    await postProblemBase(title, details, parentConjectures, []);
    handleClose();
  }

  async function postConjectureBase(problemIDs) {
    const timestamp = firebase.timestamp();
    const person = firebase.currentPerson().displayName;
    const parentProblemsID = problemIDs.map(id =>
      firebase.db.doc(`problems/${id}`)
    );
    const conjectureRef = await firebase.conjectures().add({
      title: title,
      details: details,
      tags: tags,
      created: timestamp,
      lastModified: timestamp,
      creator: person,
      votedBy: [],
      votes: 0,
      parentProblems: parentProblemsID,
      childProblems: [],
      parentConjectures: [],
      childConjectures: [],
      comments: 0
    });
    problemIDs.map(problemID =>
      firebase.problem(problemID).update({
        childConjectures: firebase.arrayUnion(conjectureRef)
      })
    );
    firebase.person(person).update({
      conjectures: firebase.arrayUnion(conjectureRef)
    });
    tags.forEach(tag => {
      const tagRef = firebase.tag(tag);
      tagRef.set({}, { merge: true });
      tagRef.update({
        conjectures: firebase.arrayUnion(conjectureRef)
      });
    });
  }

  async function postConjecture() {
    let problemIDs;
    if (problemItem) {
      problemIDs = problemItem.id;
    } else {
      problemIDs = await postProblemBase(parentProblemTitle, "", [], []);
    }
    await postConjectureBase([problemIDs]);

    handleClose();
  }
  // post conjecture inside the problem

  const ProblemHeader = () =>
    conjectureItem ? (
      <DialogContentText variant="h6">{conjectureItem.title}</DialogContentText>
    ) : (
      <DialogContentText>
        To identify a problem with an already posted conjecture, please find it
        on the conjectures page.
      </DialogContentText>
    );

  const Actions = () => (
    <DialogActions>
      <Button onClick={() => setFullScreen(!fullScreen)} color="primary">
        {fullScreen ? "Minimize" : "Maximize"}
      </Button>
      <Button onClick={handleClose} color="secondary">
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
  );

  return (
    <Dialog
      open={open}
      // onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
    >
      <Container maxWidth="md">
        <DialogTitle id="create-title">
          {problem ? "A New Problem!" : "A New Conjecture"}
        </DialogTitle>
        <DialogContent>
          {problem ? (
            <ProblemHeader />
          ) : problemItem ? (
            <DialogContentText variant="h6">
              {problemItem.title}
            </DialogContentText>
          ) : (
            <React.Fragment>
              <DialogContentText>
                To solve an already posted problem, please find it on the
                problems page.
              </DialogContentText>
              <TextField
                required
                multiline
                helperText={
                  parentProblemTitle.length < MINTITLELENGTH &&
                  "Problem title does not meet minimum length"
                }
                margin="dense"
                id="title"
                label="Problem Title"
                fullWidth
                onChange={event => setParentProblemTitle(event.target.value)}
              />
            </React.Fragment>
          )}
          <TextField
            required
            multiline
            helperText={
              title.length < MINTITLELENGTH &&
              "Title does not meet minimum length"
            }
            margin="dense"
            id="title"
            label={problem ? "Problem Title" : "Conjecture Title"}
            fullWidth
            onChange={event => setTitle(event.target.value)}
          />
          <TagsMenu setValue={setTags} defaultValue={tags} variant="outlined" />
          <Typography variant="caption">
            {tags.length} {tags.length === 1 ? "tag" : "tags"}
          </Typography>
          <Editor setDetails={setDetails} />
        </DialogContent>
        <Actions />
      </Container>
    </Dialog>
  );
});

const Editor = ({ setDetails }) => {
  function changeText(state) {
    let details = draftjsToMd(convertToRaw(state.getCurrentContent()));
    // convert single line breaks into double
    details = details.replace(/(^|[^\n])\n([^\n]|$)/g, "$1\n\n$2");
    setDetails(details);
  }

  return (
    <MUIRichTextEditor
      label="Text (optional)..."
      onChange={changeText}
      draftEditorProps={{ spellCheck: true }}
      controls={[
        "title",
        "bold",
        "italic",
        "underline",
        // "strikethrough",
        // "highlight",
        "undo",
        "redo",
        "link",
        "numberList",
        "bulletList",
        "quote",
        "code",
        "clear"
      ]}
    />
  );
};

export default CreatePost;
