import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import BottomScrollListener from "react-bottom-scroll-listener";
import { Link } from "react-router-dom";
import { withFirebase } from "../firebase";
import ItemInfo from "../util/ItemInfo";
import Markdown from "../util/Markdown";
import VoteButton from "../util/VoteButton";

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
    display: "flex"
  },
  cardDetails: {
    flex: 1
  }
}));

function CommentsList({ conjecture, firebase }) {
  const [comments, setComments] = React.useState([]);
  const [lastComment, setLastComment] = React.useState(null);

  const LOADSIZE = 5;
  const orderBy = "votes";

  React.useEffect(() => {
    const path =
      "problems/" +
      conjecture.problem.id +
      "/conjectures/" +
      conjecture.id +
      "/comments";
    firebase
      .collection(path)
      .orderBy("votes", "desc")
      .limit(LOADSIZE)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        console.log(data);
        querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
        setLastComment(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setComments(data);
      });
  }, []);

  function lazyLoad() {
    if (lastComment) {
      firebase
        .startAfterQuery(orderBy, LOADSIZE, lastComment)
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
    <div>
      {comments.map(comment => (
        <CommentCard comment={comment} />
      ))}
      <BottomScrollListener onBottom={lazyLoad} />
    </div>
  );
}

function CommentCard({ comment }) {
  const classes = useStyles();

  function content() {
    const DETAILLENGTH = 400;

    let content = comment.content.substr(0, DETAILLENGTH);
    if (comment.content.substr(DETAILLENGTH)) {
      content += "...";
    }
    return content;
  }

  console.log(comment);
  return (
    <div>
      <Link
        // to={{
        //   pathname: "/comment/" + comment.id
        //   // state: { comment: comment }
        // }}
        style={{ textDecoration: "none" }}
      >
        <div>
          <CardActionArea component="a" href="#">
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <ItemInfo item={comment} />
                  <Markdown className={classes.markdown}>{content()}</Markdown>
                </CardContent>
              </div>
              <CardActions disableSpacing>
                <VoteButton item={comment} comment />
              </CardActions>
            </Card>
          </CardActionArea>
        </div>
      </Link>
    </div>
  );
}

export default withFirebase(CommentsList);
