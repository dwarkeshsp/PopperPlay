import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  inline: {
    display: "inline"
  }
}));

export default function TagsList({ tags }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      {" "}
      {tags &&
        tags.map((tag, index) => (
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
            <Typography className={classes.inline} color="textPrimary">
              {index < tags.length - 1 ? ",  " : ""}
            </Typography>
          </React.Fragment>
        ))}
    </React.Fragment>
  );
}
