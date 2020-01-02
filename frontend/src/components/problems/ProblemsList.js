import React from "react";
import { Link, useHistory } from "react-router-dom";
import BottomScrollListener from "react-bottom-scroll-listener";
import timeago from "epoch-timeago";
import { AuthUserContext } from "../session";
import { withFirebase } from "../firebase";
import Dialog from "../util/AlertDialog";
import Markdown from "../util/Markdown";
import TagsList from "../tags/TagsList";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
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

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  },
  markdown: {
    ...theme.typography.caption,
    padding: theme.spacing(3, 0)
  },
  card: {
    display: "flex"
  },
  cardDetails: {
    flex: 1
  }
}));

function ProblemsList({ firebase, tags, orderBy }) {
  const [problems, setProblems] = React.useState([]);
  const [lastDoc, setLastDoc] = React.useState(null);
  const [filtering, setFiltering] = React.useState(false);

  const LOADSIZE = 10;

  // React.useEffect(() => {
  //   firebase
  //     .problems()
  //     .orderBy(orderBy, "desc")
  //     .limit(LOADSIZE)
  //     .get()
  //     .then(querySnapshot => {
  //       console.log("mounted");
  //       const data = querySnapshot.docs.map(doc => doc.data());
  //       setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
  //       querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
  //       setProblems(data);
  //     })
  //     .catch(error => console.log(error));
  // }, []);

  // acts as component did mount as well
  React.useEffect(() => {
    firebase
      .problems()
      .orderBy(orderBy, "desc")
      .limit(LOADSIZE)
      .get()
      .then(querySnapshot => {
        console.log("order changed");
        const data = querySnapshot.docs.map(doc => doc.data());
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
        setProblems(data);
      })
      .catch(error => console.log(error));
  }, [orderBy]);

  // * currently queries if array contains any of the tags
  React.useEffect(() => {
    if (tags.length) {
      firebase
        .problems()
        .where("tags", "array-contains-any", tags)
        .orderBy(orderBy, "desc")
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
        .orderBy(orderBy, "desc")
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
        .orderBy(orderBy, "desc")
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
  const DETAILLENGTH = 400;

  function title() {
    let title = problem.title.substr(0, TITLELENGTH);
    if (problem.title.substr(TITLELENGTH)) {
      title += "...";
    }
    return title;
  }

  function details() {
    let details = problem.details.substr(0, DETAILLENGTH);
    if (problem.details.substr(DETAILLENGTH)) {
      details += "...";
    }
    return details;
  }

  return (
    <div>
      <Link
        to={{
          pathname: "/problem/" + problem.id,
          state: { problem: problem }
        }}
        style={{ textDecoration: "none" }}
      >
        <CardActionArea component="a" href="#">
          <Card className={classes.card}>
            <div className={classes.cardDetails}>
              <CardContent>
                <Typography component="h2" variant="h6">
                  {title()}
                </Typography>
                <Typography
                  variant="body2"
                  // className={classes.inline}
                  color="textPrimary"
                  component={Link}
                  to={"/person/" + problem.user}
                  // style={{ textDecoration: "none" }}
                >
                  {problem.user}
                </Typography>
                <Typography
                  variant="body2"
                  className={classes.inline}
                  style={{ textDecoration: "none" }}
                >
                  {" "}
                  {timeago(problem.created.seconds * 1000)}
                </Typography>
                <TagsList tags={problem.tags} />
              </CardContent>
            </div>
            <CardActions disableSpacing>
              <Like problem={problem} firebase={firebase} />
            </CardActions>
          </Card>
        </CardActionArea>
      </Link>
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
        <Dialog
          ref={alertRef}
          title="Not logged in"
          message={"You must login in order to perform this action"}
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
      problem.likedBy.includes(firebase.currentUser().displayName)
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
      // add problem to likedBy by user
      firebase.user(firebase.currentUser().displayName).update({
        problemsLiked: firebase.arrayUnion(
          firebase.db.doc(`problems/${problem.id}`)
        )
      });
      // add user to problem likers
      firebase.problem(problem.id).update({
        likedBy: firebase.arrayUnion(firebase.currentUser().displayName)
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
        likedBy: firebase.firestore.FieldValue.arrayRemove(
          firebase.currentUser().displayName
        )
      });
    }
  }

  return (
    <Link onClick={e => e.preventDefault()}>
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
    </Link>
  );
}

export default withFirebase(ProblemsList);
