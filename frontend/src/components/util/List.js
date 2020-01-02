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

function List({ firebase, tags, orderBy, problem }) {
  const [items, setItems] = React.useState([]);
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

  const updateData = querySnapshot => {
    const data = querySnapshot.docs.map(doc => doc.data());
    querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));

    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    return data;
  };

  // acts as component did mount as well
  React.useEffect(() => {
    // if (!filtering) {
    firebase
      .query(orderBy, LOADSIZE, problem)
      .then(querySnapshot => {
        const data = updateData(querySnapshot);
        setItems(data);
      })
      .catch(error => console.log(error));
    // } else {
    //   firebase
    //     .tagsQuery(orderBy, LOADSIZE, tags, problem)
    //     .then(querySnapshot => {
    //       const data = updateData(querySnapshot);
    //       setItems(data);
    //       setFiltering(true);
    //     });
    // }
  }, [orderBy]);

  // * currently queries if array contains any of the tags
  React.useEffect(() => {
    if (tags.length) {
      firebase
        .tagsQuery(orderBy, LOADSIZE, tags, problem)
        .then(querySnapshot => {
          const data = updateData(querySnapshot);
          setItems(data);
          setFiltering(true);
        })
        .catch(error => console.log(error));
    } else if (filtering) {
      // go back to default view
      firebase
        .query(orderBy, LOADSIZE, problem)
        .then(querySnapshot => {
          const data = updateData(querySnapshot);
          setItems(data);
          setFiltering(false);
        })
        .catch(error => console.log(error));
    }
  }, [tags]);

  function lazyLoad() {
    if (lastDoc) {
      firebase
        .startAfterQuery(orderBy, LOADSIZE, lastDoc, problem)
        .then(querySnapshot => {
          const data = updateData(querySnapshot);
          setItems(items.concat(data));
        })
        .catch(error => console.log(error));
    }
  }

  return (
    <div>
      {items.map(item => {
        return <ItemCard item={item} firebase={firebase} problem={problem} />;
      })}
      <BottomScrollListener onBottom={lazyLoad} />
    </div>
  );
}

function ItemCard({ item, firebase, problem }) {
  const classes = useStyles();

  const TITLELENGTH = 250;
  const DETAILLENGTH = 400;

  function title() {
    let title = item.title.substr(0, TITLELENGTH);
    if (item.title.substr(TITLELENGTH)) {
      title += "...";
    }
    return title;
  }

  function details() {
    let details = item.details.substr(0, DETAILLENGTH);
    if (item.details.substr(DETAILLENGTH)) {
      details += "...";
    }
    return details;
  }

  return (
    <div>
      <Link
        to={
          problem
            ? {
                pathname: "/problem/" + item.id,
                state: { problem: item }
              }
            : {
                pathname: "/conjecture/" + item.id,
                state: { conjecture: item }
              }
        }
        style={{ textDecoration: "none" }}
      >
        <div>
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
                    to={"/person/" + item.user}
                    // style={{ textDecoration: "none" }}
                  >
                    {item.user}
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.inline}
                    style={{ textDecoration: "none" }}
                  >
                    {" "}
                    {timeago(item.created.seconds * 1000)}
                  </Typography>
                  <TagsList tags={item.tags} />
                </CardContent>
              </div>
              <CardActions disableSpacing>
                <Like item={item} firebase={firebase} />
              </CardActions>
            </Card>
          </CardActionArea>
        </div>
      </Link>
    </div>
  );
}

function Like({ item, firebase }) {
  return (
    <AuthUserContext.Consumer>
      {authUser => {
        return authUser ? (
          <LikeLoggedIn item={item} firebase={firebase} />
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

function LikeLoggedIn({ item, firebase }) {
  const history = useHistory();

  const [likeIconColor, setlikeIconColor] = React.useState(getLikeValue());

  function getLikeValue() {
    if (
      firebase.currentUser() &&
      item.likedBy.includes(firebase.currentUser().displayName)
    ) {
      console.log("liked", item);
      return "primary";
    } else {
      console.log("not liked", item);

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
    <Link onClick={e => e.preventDefault()}>
      <Button
        color="primary"
        component={Link}
        to={{
          pathname: "/problem/" + item.id,
          state: { problem: item }
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

export default withFirebase(List);
