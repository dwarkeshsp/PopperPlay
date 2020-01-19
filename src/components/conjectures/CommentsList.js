import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import clsx from "clsx";
import React from "react";
import BottomScrollListener from "react-bottom-scroll-listener";
import { withFirebase } from "../firebase";
import MessageIcon from "@material-ui/icons/Message";
import VoteButton from "../util/buttons/Vote";
import ItemInfo from "../util/ItemInfo";
import CardActionArea from "@material-ui/core/CardActionArea";

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

function CommentsList({ conjecture, firebase }) {
  const [comments, setComments] = React.useState([]);
  const [lastComment, setLastComment] = React.useState(null);

  const LOADSIZE = 5;
  const orderBy = "created";
  const path =
    "problems/" +
    conjecture.problem.id +
    "/conjectures/" +
    conjecture.id +
    "/comments";

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
  }, []);

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
    <div style={{ marginBottom: "1rem" }}>
      {comments.map(comment => (
        <CommentCard comment={comment} />
      ))}
      <BottomScrollListener onBottom={lazyLoad} />
    </div>
  );
}

function CommentCard({ comment }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [replying, setReplying] = React.useState(false);
  const [value, setValue] = React.useState("");
  let enableExpand = true;
  // function content() {
  //   const DETAILLENGTH = 1000;

  //   let content = comment.content.substr(0, DETAILLENGTH);
  //   if (comment.content.substr(DETAILLENGTH)) {
  //     content += "...";
  //   }
  //   return content;
  // }

  function handleExpandClick() {
    if (enableExpand) {
      setExpanded(!expanded);
    } else {
      enableExpand = true;
    }
  }

  function createChildComment(event) {
    function post() {}

    console.log("clicked");
    enableExpand = false;
    if (replying) {
      post();
      setValue("");
    }
    setReplying(!replying);
  }

  return (
    <div>
      <CardActionArea>
        <Card className={classes.card}>
          <CardContent onClick={() => setExpanded(!expanded)}>
            <ItemInfo item={comment} />
            <Typography>{comment.content}</Typography>
          </CardContent>
          <CardActions disableSpacing>
            {/* <Delete item={comment} comment /> */}
            {/* <VoteButton item={comment} comment /> */}
            {!replying && (
              <IconButton aria-label="comment" onClick={createChildComment}>
                <MessageIcon />
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
                  onClick={createChildComment}
                  color="primary"
                  disabled={!value}
                >
                  <MessageIcon />
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
      </CardActionArea>
    </div>
  );
}

function ChildrenBase({ comment, expanded, firebase }) {
  const [comments, setComments] = React.useState([]);
  const [lastComment, setLastComment] = React.useState(null);

  const LOADSIZE = 5;
  const orderBy = "created";
  const path = comment.path + comment.id + "/comments";

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
        console.log(data);
      });
  }, []);

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
      <CardContent>
        <Typography paragraph>Method:</Typography>
        <Typography paragraph>
          Heat 1/2 cup of the broth in a pot until simmering, add saffron and
          set aside for 10 minutes.
        </Typography>
        <Typography paragraph>
          Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet
          over medium-high heat. Add chicken, shrimp and chorizo, and cook,
          stirring occasionally until lightly browned, 6 to 8 minutes. Transfer
          shrimp to a large plate and set aside, leaving chicken and chorizo in
          the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
          pepper, and cook, stirring often until thickened and fragrant, about
          10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth;
          bring to a boil.
        </Typography>
        <Typography paragraph>
          Add rice and stir very gently to distribute. Top with artichokes and
          peppers, and cook without stirring, until most of the liquid is
          absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved
          shrimp and mussels, tucking them down into the rice, and cook again
          without stirring, until mussels have opened and rice is just tender, 5
          to 7 minutes more. (Discard any mussels that don’t open.)
        </Typography>
        <Typography>
          Set aside off of the heat to let rest for 10 minutes, and then serve.
        </Typography>
      </CardContent>
    </Collapse>
  );
}

const Children = withFirebase(ChildrenBase);

export default withFirebase(CommentsList);
