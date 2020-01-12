import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import BuildIcon from "@material-ui/icons/Build";
import React from "react";
import CommentsList from "../conjectures/CommentsList";
import { withFirebase } from "../firebase";
import ProblemConjecturesList from "../problems/ProblemConjecturesList";
import { AuthUserContext } from "../session";
import Dialog from "../util/AlertDialog";
import CreatePost from "./CreatePost";
import ItemInfo from "./ItemInfo";
import Markdown from "./Markdown";
import VoteButton from "./VoteButton";
import CommentTextBox from "../conjectures/CommentTextBox";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "5.5rem"
  },

  inline: {
    display: "inline"
  },
  markdown: {
    ...theme.typography.body1
  },
  createButton: {
    justifyContent: "center",
    marginTop: "1rem"
  },
  childrenTitle: {
    marginTop: "2rem"
  }
}));

function Item({ item, problem, firebase }) {
  const classes = useStyles();
  const alertRef = React.useRef();

  return (
    <React.Fragment>
      {item && (
        <div>
          <Container maxWidth="md" className={classes.root}>
            <Grid container>
              <Grid item xs={11}>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <ItemInfo item={item} />
              </Grid>
              <Grid item xs={1}>
                <VoteButton item={item} problem={problem} />
              </Grid>
            </Grid>
            <Markdown className={classes.markdown}>{item.details}</Markdown>
            <Grid container className={classes.createButton}>
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
              variant="h6"
              className={classes.childrenTitle}
              variant="h5"
              gutterBottom
            >
              {problem ? "Conjectures" : "Comments"}
            </Typography>
          </Container>
          <Container maxWidth="md">
            {problem ? (
              <ProblemConjecturesList problem={item} />
            ) : (
              <CommentsList conjecture={item} />
            )}
          </Container>
        </div>
      )}
      {!item && (
        <div>
          <Typography align="center" variant="h5">
            Item not found
          </Typography>
        </div>
      )}
    </React.Fragment>
  );
}

export default withFirebase(Item);
