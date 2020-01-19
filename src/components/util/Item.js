import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import BuildIcon from "@material-ui/icons/Build";
import React from "react";
import { Link } from "react-router-dom";
import CommentsList from "../conjectures/CommentsList";
import CommentTextBox from "../conjectures/CommentTextBox";
import { withFirebase } from "../firebase";
import ProblemConjecturesList from "../problems/ProblemConjecturesList";
import { AuthUserContext } from "../session";
import Dialog from "../util/AlertDialog";
import CreatePost from "./CreatePost";
import ItemInfo from "./ItemInfo";
import MaterialLink from "@material-ui/core/Link";
import Markdown from "./Markdown";
import VoteButton from "./buttons/Vote";
import Delete from "./buttons/Delete";

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
    justifyContent: "center",
    marginTop: "3rem"
  },
  childrenTitle: {
    marginTop: "1rem"
  }
}));

function Item({ item, problem, firebase }) {
  const classes = useStyles();
  const alertRef = React.useRef();

  return (
    <Container maxWidth="md" className={classes.root}>
      {item && (
        <div>
          {!problem && <ProblemMetaData item={item} />}
          <Header item={item} problem={problem} />
          <Markdown className={classes.markdown}>{item.details}</Markdown>
          <Grid container className={classes.create}>
            {problem ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<BuildIcon />}
                onClick={() => alertRef.current.handleOpen()}
              >
                Solve
              </Button>
            ) : (
              <CommentTextBox conjecture={item} />
            )}
          </Grid>
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? (
                <CreatePost
                  ref={alertRef}
                  firebase={firebase}
                  problemItem={problem ? item : null}
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
          <Typography
            className={classes.childrenTitle}
            variant="h5"
            align="center"
            gutterBottom
          >
            {problem ? "Conjectures" : "Comments"}
          </Typography>
          {problem ? (
            <ProblemConjecturesList problem={item} />
          ) : (
            <CommentsList conjecture={item} />
          )}
        </div>
      )}
      {!item && (
        <Grid container justify="center">
          <CircularProgress />
        </Grid>
      )}
    </Container>
  );
}

function ProblemMetaData({ item }) {
  return (
    <div>
      <Link
        to={"/problem/" + item.problem.id}
        style={{ textDecoration: "none" }}
      >
        <MaterialLink
          component="h3"
          variant="h5"
          color="textSecondary"
          gutterBottom
        >
          {item.problem.title}
        </MaterialLink>
      </Link>
      {/* <ItemInfo item={problem} /> */}
    </div>
  );
}

function Header({ item, problem }) {
  const classes = useStyles();
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

        <VoteButton item={item} problem={problem} />
      </Grid>
    </Grid>
  );
}

export default withFirebase(Item);
