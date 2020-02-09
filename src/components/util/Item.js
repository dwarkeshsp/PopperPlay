import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import TimelineIcon from "@material-ui/icons/Timeline";
import React from "react";
import CommentsList from "../comments/ConjectureCommentsList";
import CommentTextBox from "../comments/CommentTextBox";
import { withFirebase } from "../firebase";
import ProblemConjecturesList from "../problems/ProblemConjecturesList";
import { AuthUserContext } from "../session";
import Dialog from "../util/AlertDialog";
import TwitterShare from "./buttons/TwitterShare";
import VoteButton from "./buttons/Vote";
import CreatePost from "./CreatePost";
import Graph from "./Graph";
import ItemInfo from "./ItemInfo";
import Markdown from "./Markdown";
import MetaInfoList from "./MetaInfoList";

const useStyles = makeStyles(theme => ({
  root: {
    // marginTop: "1rem"
  },
  inline: {
    display: "inline"
  },
  markdown: {
    marginTop: "1rem",
    ...theme.typography.body1
  },
  create: {
    justifyContent: "center"
  },
  childrenTitle: {
    marginTop: "1rem"
  }
}));

export default function Item({ item }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      {item && (
        <div>
          <Container maxWidth="md" className={classes.root}>
            <Header item={item} />
            <GraphDialog item={item} />
            <Markdown className={classes.markdown}>{item.details}</Markdown>

            <PostButton item={item} />

            <Typography
              className={classes.childrenTitle}
              variant="h5"
              align="center"
              gutterBottom
            >
              {item.problem && "Conjectures"}
              {item.conjecture && "Comments"}
            </Typography>
            {item.problem && (
              <React.Fragment>
                <ProblemConjecturesList problem={item} />
              </React.Fragment>
            )}
            {item.conjecture && (
              <React.Fragment>
                <CommentTextBox conjecture={item} />
                <CommentsList conjecture={item} />
              </React.Fragment>
            )}
          </Container>
        </div>
      )}
      {!item && (
        <Grid container justify="center">
          <CircularProgress />
        </Grid>
      )}
    </React.Fragment>
  );
}

function Header({ item }) {
  return (
    <Grid container>
      <Grid item xs={10}>
        {item.problem && <MetaInfoList refList={item.parentConjectures} />}
        {item.conjecture && <MetaInfoList refList={item.parentProblems} />}
        <Typography variant="h5" gutterBottom>
          {item.title}
        </Typography>
        <ItemInfo item={item} />
      </Grid>
      <Grid item xs={2} align="right">
        {/* <Delete item={item} problem={problem} /> */}
        {/* <EditButton item={item} problem={problem} /> */}
        <TwitterShare item={item} />
        <VoteButton item={item} />
      </Grid>
    </Grid>
  );
}

function PostButtonBase({ item, firebase }) {
  const classes = useStyles();
  const alertRef = React.useRef();

  return (
    <Grid container className={classes.create}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => alertRef.current.handleOpen()}
      >
        {item.problem ? "conjecture" : "problem"}
      </Button>
      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? (
            <CreatePost
              ref={alertRef}
              firebase={firebase}
              problemItem={item.problem ? item : null}
              conjectureItem={item.conjecture ? item : null}
              problem={!item.problem}
            />
          ) : (
            <Dialog
              ref={alertRef}
              title="Not logged in"
              message={"You must login in order to perform this action."}
              button="Okay"
            />
          )
        }
      </AuthUserContext.Consumer>
    </Grid>
  );
}

function GraphDialog({ item }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Grid container justify="center">
        <Button
          variant="text"
          color="primary"
          size="large"
          startIcon={<TimelineIcon />}
          onClick={handleClickOpen}
        >
          See graph
        </Button>
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="xl">
        <DialogContent>
          <Graph item={item} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const PostButton = withFirebase(PostButtonBase);
