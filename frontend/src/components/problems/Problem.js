import React from "react";
import { useLocation } from "react-router";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Markdown from "../util/Markdown";

const useStyles = makeStyles(theme => ({
  markdown: {
    ...theme.typography.caption,
    padding: theme.spacing(3, 0)
  }
}));

export default function Main(props) {
  const classes = useStyles();
  const location = useLocation();
  const problem = location.state.problem;
  // const { posts, title } = props;

  return (
    <Grid item xs={12} md={8}>
      <Typography variant="h6" gutterBottom>
        {problem.title}
      </Typography>
      <Divider />
      <Markdown className={classes.markdown}>{problem.description}</Markdown>
    </Grid>
  );
}

Main.propTypes = {
  posts: PropTypes.array,
  title: PropTypes.string
};
