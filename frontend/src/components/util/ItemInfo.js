import React from "react";
import { Link, useHistory } from "react-router-dom";
import BottomScrollListener from "react-bottom-scroll-listener";
import timeago from "epoch-timeago";
import { AuthUserContext } from "../session";
import { withFirebase } from "../firebase";
import Dialog from "./AlertDialog";
import TagsList from "../tags/TagsList";
import ListActions from "./ListActions";
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

const useStyles = makeStyles(theme => ({
  inline: {
    display: "inline"
  },
  markdown: {
    ...theme.typography.caption,
    padding: theme.spacing(3, 0)
  }
}));

export default function ItemInfo({ item }) {
  const classes = useStyles();

  return (
    <div>
      <Typography
        variant="body1"
        className={classes.inline}
        style={{ textDecoration: "none" }}
      >
        {item.votes}
      </Typography>
      <Typography
        variant="body2"
        className={classes.inline}
        style={{ textDecoration: "none" }}
      >
        {" votes "}
      </Typography>
      <Typography
        variant="body1"
        // className={classes.inline}
        color="textPrimary"
        component={Link}
        to={"/person/" + item.person}
        // style={{ textDecoration: "none" }}
      >
        {item.person}
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
    </div>
  );
}
