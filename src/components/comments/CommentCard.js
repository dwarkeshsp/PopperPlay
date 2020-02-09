import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ReplyIcon from "@material-ui/icons/Reply";
import clsx from "clsx";
import React from "react";
import { withFirebase } from "../firebase";
import ItemInfo from "../util/ItemInfo";

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
    ...theme.typography.body1
  },
  card: {
    // display: "flex"
    maxWidth: "100%"
  },
  cardDetails: {
    flex: 1
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  }
}));

function CommentCard({ comment, firebase }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(true);
  const [replying, setReplying] = React.useState(false);
  const [value, setValue] = React.useState("");
  const margin = (comment.level * 2).toString() + "rem";

  async function post() {
    const path = comment.path + comment.id + "/comments/";
    const level = comment.level + 1;
    const timestamp = firebase.timestamp();
    const person = firebase.currentPerson().displayName;
    const commentRef = await firebase.collection(path).add({
      content: value,
      creator: person,
      votedBy: [],
      votes: 0,
      created: timestamp,
      lastModified: timestamp,
      path: path,
      level: level,
      tags: comment.tags
    });
    firebase.person(person).update({
      comments: firebase.arrayUnion(commentRef)
    });
    const conjectureID = comment.path.split("/")[1];
    firebase.conjecture(conjectureID).update({
      comments: firebase.firestore.FieldValue.increment(1)
    });
    setValue("");
    setReplying(false);
  }

  return (
    <div style={{ marginLeft: margin }}>
      <Card className={classes.card} raised={comment.level}>
        <CardContent onClick={() => setExpanded(!expanded)}>
          <ItemInfo item={comment} />
          <Typography>{comment.content}</Typography>
        </CardContent>
        <CardActions disableSpacing>
          {/* <Delete item={comment} comment /> */}
          {/* <VoteButton item={comment} comment /> */}
          {!replying && (
            <IconButton aria-label="comment" onClick={() => setReplying(true)}>
              <ReplyIcon />
            </IconButton>
          )}
          {replying && (
            <React.Fragment>
              <TextField
                id="reply"
                label="Reply"
                multiline
                rowsMax="10"
                value={value}
                fullWidth
                onChange={event => setValue(event.target.value)}
              />
              <IconButton
                aria-label="comment"
                onClick={post}
                color="primary"
                disabled={!value}
              >
                <ReplyIcon />
              </IconButton>
            </React.Fragment>
          )}
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Children comment={comment} expanded={expanded} />
      </Card>
    </div>
  );
}

function ChildrenBase({ comment, expanded, firebase }) {
  const [comments, setComments] = React.useState([]);
  const [lastComment, setLastComment] = React.useState(null);

  const LOADSIZE = 5;
  const orderBy = "created";
  const path = comment.path + comment.id + "/comments/";

  React.useEffect(() => {
    firebase
      .collection(path)
      .orderBy(orderBy, "desc")
      .limit(LOADSIZE)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
        setLastComment(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setComments(data);
      });
  }, [expanded]);

  function lazyLoad() {
    if (lastComment) {
      firebase
        .commentStartAfterQuery(orderBy, LOADSIZE, lastComment, path)
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
          setLastComment(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setComments(comments.concat(data));
        })
        .catch(error => console.log(error));
    }
  }

  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <div>
        {comments.map(child => (
          <CommentCard comment={child} />
        ))}
      </div>
    </Collapse>
  );
}

const Children = withFirebase(ChildrenBase);

export default withFirebase(CommentCard);
