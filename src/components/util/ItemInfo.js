import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import timeago from "epoch-timeago";
import React from "react";
import { Link } from "react-router-dom";
import TagsList from "../tags/TagsList";

// https://github.com/mui-org/material-ui/issues/10075
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
        to={"/person/" + item.creator}
        // style={{ textDecoration: "none" }}
      >
        {item.creator}
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
