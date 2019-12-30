import React from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import { AuthUserContext } from "../session";
import { withFirebase } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
}));

function ProblemsList({ firebase }) {
  const [problems, setProblems] = React.useState([]);
  const [lastDoc, setLastDoc] = React.useState(null);

  React.useEffect(() => {
    firebase
      .problems()
      .orderBy("likes")
      .limit(25)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1])
        querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
        setProblems(data);
      });
  }, []);

  return (
    <div>
      {problems.map(problem => (
        <ProblemCard problem={problem} firebase={firebase} />
      ))}
    </div>
  );
}

function ProblemCard({ problem, firebase }) {
  const classes = useStyles();

  const TITLELENGTH = 250;
  const DESCRIPTIONLENGTH = 400;

  function title() {
    let title = problem.title.substr(0, TITLELENGTH);
    if (problem.title.substr(TITLELENGTH)) {
      title += "...";
    }
    return title;
  }

  function description() {
    let description = problem.description.substr(0, DESCRIPTIONLENGTH);
    if (problem.description.substr(DESCRIPTIONLENGTH)) {
      description += "...";
    }
    return description;
  }

  return (
    <div>
      <Link to={"/problem/" + problem.id} style={{ textDecoration: "none", color: "black" }} >
        <List className={classes.root}>
          <ListItem alignItems="flex-start">
            <Like problem={problem} firebase={firebase} />
            <ListItemText
              primary={title()}
              secondary={
                <React.Fragment>
                  <Typography
                    variant="body2"
                    // className={classes.inline}
                    color="textPrimary"
                    component={Link}
                    to={"/person/" + problem.user}
                    style={{ textDecoration: "none" }}
                  >
                    {problem.user}
                  </Typography>
                  <div>
                    {problem.tags.map(tag => (
                      <React.Fragment>
                        <Typography
                          component={Link}
                          to={"/tag/" + tag.replace(" ", "-")}
                          variant="overline"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {tag}
                        </Typography>
                        <Typography
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {" "}
                        </Typography>
                      </React.Fragment>
                    ))}
                  </div>

                  {description()}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      </Link>
    </div>
  );
}

function Like({ problem, firebase }) {
  const [likeIconColor, setlikeIconColor] = React.useState(getLikeValue());

  function getLikeValue() {
    if (
      firebase.currentUser() &&
      problem.usersLiked.includes(firebase.currentUser().displayName)
    ) {
      return "primary";
    } else {
      return "default";
    }
  }

  return (
    <AuthUserContext.Consumer>
      {authUser => {
        return authUser ? (
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              color={likeIconColor}
              onClick={() => {
                if (likeIconColor === "default") {
                  setlikeIconColor("primary");
                  firebase.problem(problem.id).update({
                    likes: firebase.firestore.FieldValue.increment(1)
                  });
                  firebase.user(firebase.currentUser().displayName).update({
                    problemsLiked: firebase.firestore.FieldValue.arrayUnion(
                      firebase.db.doc(`problems/${problem.id}`)
                    )
                  });
                  firebase.problem(problem.id).update({
                    usersLiked: firebase.firestore.FieldValue.arrayUnion(
                      firebase.currentUser().displayName
                    )
                  });
                } else {
                  setlikeIconColor("default");
                  firebase.problem(problem.id).update({
                    likes: firebase.firestore.FieldValue.increment(-1)
                  });
                  firebase.user(firebase.currentUser().displayName).update({
                    problemsLiked: firebase.firestore.FieldValue.arrayRemove(
                      firebase.db.doc(`problems/${problem.id}`)
                    )
                  });
                  firebase.problem(problem.id).update({
                    usersLiked: firebase.firestore.FieldValue.arrayRemove(
                      firebase.currentUser().displayName
                    )
                  });
                }
              }}
            >
              <ThumbUpIcon />
            </IconButton>
          </ListItemSecondaryAction>
        ) : (
          <div></div>
        );
      }}
    </AuthUserContext.Consumer>
  );
}

export default withFirebase(ProblemsList);
