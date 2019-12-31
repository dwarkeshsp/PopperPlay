import React from "react";
import { Link, useHistory } from "react-router-dom";
import BottomScrollListener from "react-bottom-scroll-listener";
import { AuthUserContext } from "../session";
import { withFirebase } from "../firebase";
import Dialog from "../util/AlertDialog";
import Markdown from "../util/Markdown";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import BuildIcon from "@material-ui/icons/Build";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

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

function ProblemsList({ firebase, tags }) {
  const [problems, setProblems] = React.useState([]);
  const [lastDoc, setLastDoc] = React.useState(null);
  const [filtering, setFiltering] = React.useState(false);

  const LOADSIZE = 10;

  React.useEffect(() => {
    firebase
      .problems()
      .orderBy("likes", "desc")
      .limit(LOADSIZE)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
        setProblems(data);
      })
      .catch(error => console.log(error));
  }, []);

  // * currently queries if array contains any of the tags
  React.useEffect(() => {
    if (tags.length) {
      firebase
        .problems()
        .where("tags", "array-contains-any", tags)
        .orderBy("likes", "desc")
        .limit(LOADSIZE)
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
          querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
          setProblems(data);
          setFiltering(true);
        })
        .catch(error => console.log(error));
    } else if (filtering) {
      // go back to default view
      firebase
        .problems()
        .orderBy("likes", "desc")
        .limit(LOADSIZE)
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
          querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
          setProblems(data);
          setFiltering(false);
        })
        .catch(error => console.log(error));
    }
  }, [tags]);

  function lazyLoad() {
    if (lastDoc) {
      firebase
        .problems()
        .orderBy("likes", "desc")
        .startAfter(lastDoc)
        .limit(LOADSIZE)
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
          querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
          setProblems(problems.concat(data));
        })
        .catch(error => console.log(error));
    }
  }

  return (
    <div>
      {problems.map(problem => {
        return <ProblemCard problem={problem} firebase={firebase} />;
      })}
      <BottomScrollListener onBottom={() => lazyLoad()} />
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
      <List className={classes.root}>
        <Link
          to={{
            pathname: "/problem/" + problem.id,
            state: { problem: problem }
          }}
          style={{ textDecoration: "none", color: "black" }}
        >
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
                  {/* {description()} */}
                </React.Fragment>
              }
            />
          </ListItem>
        </Link>

        <Divider variant="inset" component="li" />
      </List>
    </div>
  );
}

function Like({ problem, firebase }) {
  return (
    <AuthUserContext.Consumer>
      {authUser => {
        return authUser ? (
          <LikeLoggedIn problem={problem} firebase={firebase} />
        ) : (
          <LikeSignedOut />
        );
      }}
    </AuthUserContext.Consumer>
  );
}

function LikeSignedOut() {
  const alertRef = React.useRef();

  return (
    <React.Fragment>
      <Link onClick={e => e.preventDefault()}>
        <ListItemSecondaryAction>
          <Button color="primary" onClick={e => alertRef.current.handleOpen()}>
            Solve
          </Button>
          <IconButton
            edge="end"
            aria-label="delete"
            color="default"
            onClick={e => alertRef.current.handleOpen()}
          >
            <ThumbUpIcon />
          </IconButton>
        </ListItemSecondaryAction>
        <Dialog
          ref={alertRef}
          title="Not logged in"
          message={"You must login in order to interact with the problem"}
          button="Okay"
        />
      </Link>
    </React.Fragment>
  );
}

function LikeLoggedIn({ problem, firebase }) {
  const history = useHistory();

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

  function like() {
    if (likeIconColor === "default") {
      setlikeIconColor("primary");
      // increment likes
      firebase.problem(problem.id).update({
        likes: firebase.firestore.FieldValue.increment(1)
      });
      // add problem to user
      firebase.user(firebase.currentUser().displayName).update({
        problemsLiked: firebase.firestore.FieldValue.arrayUnion(
          firebase.db.doc(`problems/${problem.id}`)
        )
      });
      // add user to problem
      firebase.problem(problem.id).update({
        usersLiked: firebase.firestore.FieldValue.arrayUnion(
          firebase.currentUser().displayName
        )
      });
    } else {
      // reverse
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
  }

  return (
    <Link onClick={e => e.preventDefault()}>
      <ListItemSecondaryAction>
        <Button
          color="primary"
          component={Link}
          to={{
            pathname: "/problem/" + problem.id,
            state: { problem: problem }
          }}
          // onClick={() => history.push("/problem/" + problem.id)}
        >
          Solve
        </Button>
        <IconButton
          edge="end"
          aria-label="delete"
          color={likeIconColor}
          onClick={() => like()}
        >
          <ThumbUpIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </Link>
  );
}

export default withFirebase(ProblemsList);
