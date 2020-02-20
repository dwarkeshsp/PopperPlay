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
import { Link } from "react-router-dom";
import { withFirebase } from "../firebase";
import ItemInfo from "../util/ItemInfo";
import MetaInfoList from "../util/MetaInfoList";
import CardActionArea from "@material-ui/core/CardActionArea";

function CommentCard({ comment, highlight, firebase }) {
  const [expanded, setExpanded] = React.useState(true);
  const [replying, setReplying] = React.useState(false);
  const [value, setValue] = React.useState("");

  const conjectureID = comment.path.split("/")[1];
  const conjectureRef = firebase.conjecture(conjectureID);

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
    firebase.conjecture(conjectureID).update({
      comments: firebase.firestore.FieldValue.increment(1)
    });
    setValue("");
    setReplying(false);
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Link
        to={"/conjecture/" + conjectureID}
        style={{ textDecoration: "none" }}
      > 
        <Card
          elevation={4}
          style={highlight ? { backgroundColor: "LightGray" } : {}}
        >
          <CardActionArea>
            <CardContent onClick={() => setExpanded(!expanded)}>
              <MetaInfoList refList={[conjectureRef]} type="conjecture" />
              <ItemInfo item={comment} />
              <Typography>{comment.content}</Typography>
            </CardContent>
            <CardActions disableSpacing>
              {/* <Delete item={comment} comment /> */}
              {/* <VoteButton item={comment} comment /> */}
              {!replying && (
                <IconButton
                  aria-label="comment"
                  onClick={() => setReplying(true)}
                >
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
            </CardActions>
          </CardActionArea>
        </Card>
      </Link>
    </div>
  );
}

export default withFirebase(CommentCard);
