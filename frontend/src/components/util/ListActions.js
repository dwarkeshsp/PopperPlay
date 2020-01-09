import React from "react";
import { Link, useHistory } from "react-router-dom";
import BottomScrollListener from "react-bottom-scroll-listener";
import timeago from "epoch-timeago";
import { AuthUserContext } from "../session";
import { withFirebase } from "../firebase";
import Dialog from "../util/AlertDialog";
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
import { Grid } from "@material-ui/core";

function Actions({ item, firebase, problem }) {
  const alertRef = React.useRef();
  const [likeIconColor, setlikeIconColor] = React.useState(getLikeValue());

  function getLikeValue() {
    if (
      firebase.currentUser() &&
      item.likedBy.includes(firebase.currentUser().displayName)
    ) {
      return "primary";
    } else {
      return "default";
    }
  }

  function like() {
    if (likeIconColor === "default") {
      setlikeIconColor("primary");
      // increment likes and add user to item likers
      firebase.problem(item.id).update({
        likes: firebase.firestore.FieldValue.increment(1),
        likedBy: firebase.arrayUnion(firebase.currentUser().displayName)
      });
      // add item to likedBy by user
      firebase.user(firebase.currentUser().displayName).update({
        problemsLiked: firebase.arrayUnion(
          firebase.db.doc(`problems/${item.id}`)
        )
      });
    } else {
      // reverse
      setlikeIconColor("default");
      firebase.problem(item.id).update({
        likes: firebase.firestore.FieldValue.increment(-1),
        likedBy: firebase.firestore.FieldValue.arrayRemove(
          firebase.currentUser().displayName
        )
      });
      firebase.user(firebase.currentUser().displayName).update({
        problemsLiked: firebase.firestore.FieldValue.arrayRemove(
          firebase.db.doc(`problems/${item.id}`)
        )
      });
    }
  }

  return (
    <CardActions disableSpacing>
      <Link
        onClick={e => e.preventDefault()}
        style={{ textDecoration: "none" }}
      >
        <AuthUserContext.Consumer>
          {authUser => {
            return (
              <React.Fragment>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Button
                      color="secondary"
                      component={authUser ? Link : null}
                      to={
                        authUser
                          ? {
                              pathname: "/problem/" + item.id,
                              state: { problem: item }
                            }
                          : null
                      }
                      onClick={e => {
                        if (!authUser) {
                          alertRef.current.handleOpen();
                        }
                      }}

                      // onClick={() => history.push("/problem/" + problem.id)}
                    >
                      Solve
                    </Button>
                  </Grid>

                  <Grid item>
                    {/* <div> */}
                    <IconButton
                      edge="end"
                      aria-label="like"
                      color={likeIconColor}
                      onClick={() =>
                        authUser ? () => like() : alertRef.current.handleOpen()
                      }
                    >
                      <ThumbUpIcon />
                    </IconButton>
                    {/* </div>
          <div>
            <Typography variant="subtitle1" color="textPrimary" align="center">
              {item.likes}
            </Typography>
          </div> */}
                  </Grid>
                </Grid>
                <Dialog
                  ref={alertRef}
                  title="Not logged in"
                  message={"You must login in order to perform this action"}
                  button="Okay"
                />
              </React.Fragment>
            );
          }}
        </AuthUserContext.Consumer>
      </Link>
    </CardActions>
  );
}

function ActionsSignedOut() {
  const alertRef = React.useRef();

  return (
    <React.Fragment>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item>
          <Button
            color="secondary"
            onClick={e => alertRef.current.handleOpen()}
          >
            Solve
          </Button>
        </Grid>
        <Grid item>
          <IconButton
            edge="end"
            aria-label="like"
            color="default"
            onClick={e => alertRef.current.handleOpen()}
          >
            <ThumbUpIcon />
          </IconButton>
        </Grid>
      </Grid>

      <Dialog
        ref={alertRef}
        title="Not logged in"
        message={"You must login in order to perform this action"}
        button="Okay"
      />
    </React.Fragment>
  );
}

function ActionsLoggedIn({ item, firebase }) {
  const [likeIconColor, setlikeIconColor] = React.useState(getLikeValue());

  function getLikeValue() {
    if (
      firebase.currentUser() &&
      item.likedBy.includes(firebase.currentUser().displayName)
    ) {
      return "primary";
    } else {
      return "default";
    }
  }

  function like() {
    if (likeIconColor === "default") {
      setlikeIconColor("primary");
      // increment likes and add user to item likers
      firebase.problem(item.id).update({
        likes: firebase.firestore.FieldValue.increment(1),
        likedBy: firebase.arrayUnion(firebase.currentUser().displayName)
      });
      // add item to likedBy by user
      firebase.user(firebase.currentUser().displayName).update({
        problemsLiked: firebase.arrayUnion(
          firebase.db.doc(`problems/${item.id}`)
        )
      });
    } else {
      // reverse
      setlikeIconColor("default");
      firebase.problem(item.id).update({
        likes: firebase.firestore.FieldValue.increment(-1),
        likedBy: firebase.firestore.FieldValue.arrayRemove(
          firebase.currentUser().displayName
        )
      });
      firebase.user(firebase.currentUser().displayName).update({
        problemsLiked: firebase.firestore.FieldValue.arrayRemove(
          firebase.db.doc(`problems/${item.id}`)
        )
      });
    }
  }

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item>
        <Button
          color="secondary"
          component={Link}
          to={{
            pathname: "/problem/" + item.id,
            state: { problem: item }
          }}
          // onClick={() => history.push("/problem/" + problem.id)}
        >
          Solve
        </Button>
      </Grid>

      <Grid item>
        {/* <div> */}
        <IconButton
          edge="end"
          aria-label="like"
          color={likeIconColor}
          onClick={() => like()}
        >
          <ThumbUpIcon />
        </IconButton>
        {/* </div>
          <div>
            <Typography variant="subtitle1" color="textPrimary" align="center">
              {item.likes}
            </Typography>
          </div> */}
      </Grid>
    </Grid>
  );
}

export default withFirebase(Actions);
