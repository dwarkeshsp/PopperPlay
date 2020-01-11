import React from "react";
import { Link, useHistory } from "react-router-dom";
import BottomScrollListener from "react-bottom-scroll-listener";
import timeago from "epoch-timeago";
import { AuthUserContext } from "../session";
import { withFirebase } from "../firebase";
import Dialog from "./AlertDialog";
import TagsList from "../tags/TagsList";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Typography from "@material-ui/core/Typography";
import ForumIcon from "@material-ui/icons/Forum";
import BuildIcon from "@material-ui/icons/Build";
import { Grid } from "@material-ui/core";

function VoteButton({ item, firebase, problem }) {
  const { votedBy, id } = item;
  const alertRef = React.useRef();
  const [voteIconColor, setVoteIconColor] = React.useState("default");

  React.useEffect(() => {
    setVoteIconColor(votedByCurrentPerson());
  }, [id]);

  function votedByCurrentPerson() {
    if (
      firebase.currentPerson() &&
      votedBy.includes(firebase.currentPerson().displayName)
    ) {
      return "primary";
    } else {
      return "default";
    }
  }

  function vote() {
    if (voteIconColor === "default") {
      console.log("forwards");
      setVoteIconColor("primary");
      // increment votes and add user to item voters
      firebase.problem(id).update({
        votes: firebase.firestore.FieldValue.increment(1),
        votedBy: firebase.arrayUnion(firebase.currentPerson().displayName)
      });
      // add item to votedBy by user
      firebase.person(firebase.currentPerson().displayName).update({
        problemsVoted: firebase.arrayUnion(firebase.db.doc(`problems/${id}`))
      });
    } else {
      // reverse
      setVoteIconColor("default");
      firebase.problem(id).update({
        votes: firebase.firestore.FieldValue.increment(-1),
        votedBy: firebase.firestore.FieldValue.arrayRemove(
          firebase.currentPerson().displayName
        )
      });
      firebase.person(firebase.currentPerson().displayName).update({
        problemsVoted: firebase.firestore.FieldValue.arrayRemove(
          firebase.db.doc(`problems/${id}`)
        )
      });
    }
  }

  return (
    <Link onClick={e => e.preventDefault()} style={{ textDecoration: "none" }}>
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            {/* <Grid */}
            {/* container direction="row" justify="center" alignItems="center" > */}
            {/* <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<BuildIcon />}
                  component={Link}
                  to={{
                    pathname: "/problem/" + id,
                    state: { problem: item }
                  }}
                  onClick={e => {
                    if (!authUser) {
                      alertRef.current.handleOpen();
                      e.preventDefault();
                    }
                  }}
                >
                  Solve
                </Button>
              </Grid> */}
            {/* <Grid item> */}
            <IconButton
              edge="end"
              aria-label="vote"
              color={voteIconColor}
              onClick={() =>
                authUser ? vote() : alertRef.current.handleOpen()
              }
            >
              <ThumbUpIcon />
            </IconButton>
            {/* </div>
          <div>
            <Typography variant="subtitle1" color="textPrimary" align="center">
              {votes}
            </Typography>
          </div> */}
            {/* </Grid> */}
            {/* </Grid> */}
            <Dialog
              ref={alertRef}
              title="Not logged in"
              message={"You must login in order to perform this action"}
              button="Okay"
            />
          </React.Fragment>
        )}
      </AuthUserContext.Consumer>
    </Link>
  );
}

export default withFirebase(VoteButton);
