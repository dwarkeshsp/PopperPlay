import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { Link } from "react-router-dom";
import CommentsList from "../conjectures/CommentsList";
import CommentTextBox from "../conjectures/CommentTextBox";
import { withFirebase } from "../firebase";
import ProblemConjecturesList from "../problems/ProblemConjecturesList";
import { AuthUserContext } from "../session";
import TwitterIcon from "@material-ui/icons/Twitter";
import Dialog from "../util/AlertDialog";
import Fab from "@material-ui/core/Fab";
import CreatePost from "./CreatePost";
import ItemInfo from "./ItemInfo";
import MaterialLink from "@material-ui/core/Link";
import Markdown from "./Markdown";
import VoteButton from "./buttons/Vote";
import EditButton from "./buttons/Edit";
import Delete from "./buttons/Delete";
import Graph from "./Graph";
import TwitterShare from "./buttons/TwitterShare";

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

function Item({ item, problem, firebase }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      {item && (
        <Container maxWidth="md" className={classes.root}>
          <Header item={item} problem={problem} firebase={firebase} />
          <Graph item={item} problem={problem} />
          <Markdown className={classes.markdown}>{item.details}</Markdown>
          {problem ? (
            <PostButton item={item} problem={problem} />
          ) : (
            <PostButton item={item} problem={problem} />
          )}
          <Typography
            className={classes.childrenTitle}
            variant="h5"
            align="center"
            gutterBottom
          >
            {problem ? "Conjectures" : "Comments"}
          </Typography>
          {problem ? (
            <React.Fragment>
              <ProblemConjecturesList problem={item} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <CommentTextBox conjecture={item} />
              <CommentsList conjecture={item} />
            </React.Fragment>
          )}
        </Container>
      )}
      {!item && (
        <Grid container justify="center">
          <CircularProgress />
        </Grid>
      )}
    </React.Fragment>
  );
}

function Header({ item, problem }) {
  return (
    <Grid container>
      <Grid item xs={10}>
        <Typography variant="h5" gutterBottom>
          {item.title}
        </Typography>
        <ItemInfo item={item} />
      </Grid>
      <Grid item xs={2} align="right">
        {/* <Delete item={item} problem={problem} /> */}
        {/* <EditButton item={item} problem={problem} /> */}
        <TwitterShare item={item} problem={problem} />
        <VoteButton item={item} problem={problem} />
      </Grid>
    </Grid>
  );
}

function PostButtonBase({ item, problem, firebase }) {
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
        {problem ? "conjecture" : "problem"}
      </Button>
      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? (
            <CreatePost
              ref={alertRef}
              firebase={firebase}
              problemItem={problem ? item : null}
              conjectureItem={problem ? null : item}
              problem={!problem}
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

const PostButton = withFirebase(PostButtonBase);

export default withFirebase(Item);
