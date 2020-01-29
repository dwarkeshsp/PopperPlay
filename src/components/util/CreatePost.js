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

const { forwardRef, useImperativeHandle } = React;

const CreatePost = forwardRef(
  ({ firebase, problem, problemItem, conjectureItem }, ref) => {
    const [title, setTitle] = React.useState("");
    const [tags, setTags] = React.useState([]);
    const [details, setDetails] = React.useState("");
    const [valid, setValid] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [fullScreen, setFullScreen] = React.useState(true);
    // only for conjectures
    const [parentProblemTitle, setParentProblemTitle] = React.useState("");

    const MINTITLELENGTH = 1;

    React.useEffect(() => {
      setValid(
        title.length >= MINTITLELENGTH &&
          (problem ||
            problemItem ||
            parentProblemTitle.length >= MINTITLELENGTH)
      );
    }, [title, parentProblemTitle, problem, problemItem]);

    useImperativeHandle(ref, () => ({
      handleOpen() {
        setOpen(true);
      }
    }));

    function handleClose() {
      setTitle("");
      setParentProblemTitle("");
      setTags([]);
      setDetails("");
      setValid(false);
      setOpen(false);
    }

    async function postProblem() {
      const timestamp = firebase.timestamp();
      const person = firebase.currentPerson().displayName;
      const problemRef = await firebase.problems().add({
        title: title,
        details: details,
        tags: tags,
        created: timestamp,
        lastModified: timestamp,
        creator: person,
        votedBy: [],
        votes: 0,
        parentConjectures: conjectureItem
          ? [firebase.db.doc(`conjectures/${conjectureItem.id}`)]
          : [],
        childConjectures: []
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
      await firebase.person(person).update({
        problems: firebase.arrayUnion(problemRef)
      });
      handleClose();
    }

    async function postConjecture() {
      const timestamp = firebase.timestamp();
      const person = firebase.currentPerson().displayName;
      if (!problemItem) {
        const problemRef = await postParentProblem();
        await post(problemRef.id);
      } else {
        await post(problemItem.id);
      }

      // post conjecture inside the problem
      async function post(problemID) {
        const conjectureRef = await firebase.conjectures().add({
          title: title,
          details: details,
          tags: tags,
          created: timestamp,
          lastModified: timestamp,
          creator: person,
          votedBy: [],
          votes: 0,
          parentProblems: [firebase.db.doc(`problems/${problemID}`)],
          childProblems: [],
          parentConjectures: [],
          childConjectures: []
        });
        firebase.problem(problemID).update({
          childConjectures: firebase.arrayUnion(conjectureRef)
        });
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
      // post parent problem
      async function postParentProblem() {
        const problemRef = firebase.problems().add({
          title: parentProblemTitle,
          tags: tags,
          details: "",
          created: timestamp,
          lastModified: timestamp,
          creator: person,
          votedBy: [],
          votes: 0
        });
        await firebase.person(person).update({
          problems: firebase.arrayUnion(problemRef)
        });
        tags.forEach(tag => {
          const tagRef = firebase.tag(tag);
          tagRef.set({}, { merge: true });
          tagRef.update({
            problems: firebase.arrayUnion(problemRef)
          });
        });
        return problemRef;
      }
      handleClose();
    }

    const ProblemHeader = () =>
      conjectureItem ? (
        <DialogContentText variant="h6">
          {conjectureItem.title}
        </DialogContentText>
      ) : (
        <DialogContentText>
          To identify a problem with an already posted conjecture, please find
          it on the conjectures page.
        </DialogContentText>
      );

    const ConjectureHeader = () =>
      problemItem ? (
        <DialogContentText variant="h6">{problemItem.title}</DialogContentText>
      ) : (
        <React.Fragment>
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
      );

    const Actions = () => (
      <DialogActions>
        <Button
          onClick={() =>
            fullScreen ? setFullScreen(false) : setFullScreen(true)
          }
          color="primary"
        >
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
        aria-labelledby="create-title"
        maxWidth="md"
        fullWidth
        fullScreen={fullScreen}
      >
        <Container maxWidth="md">
          <DialogTitle id="create-title">
            {problem ? "A New Problem!" : "A New Conjecture"}
          </DialogTitle>
          <DialogContent>
            {problem ? <ProblemHeader /> : <ConjectureHeader />}
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
            <TagsMenu
              setValue={setTags}
              defaultValue={problemItem ? problemItem.tags : []}
              variant="outlined"
            />
            <Typography variant="caption">
              {tags.length} {tags.length === 1 ? "tag" : "tags"}
            </Typography>
            <Editor setDetails={setDetails} />
          </DialogContent>
          <Actions />
        </Container>
      </Dialog>
    );
  }
);

const Editor = ({ setDetails }) => {
  function changeText(state) {
    const details = draftjsToMd(convertToRaw(state.getCurrentContent()));
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
        // "link",
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
