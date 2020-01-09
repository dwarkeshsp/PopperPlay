import React from "react";
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import timeago from "epoch-timeago";
import Markdown from "../util/Markdown";
import TagsList from "../tags/TagsList";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "5rem"
  },
  markdown: {
    ...theme.typography.caption,
    padding: theme.spacing(3, 0)
  },
  inline: {
    display: "inline"
  },
  solveButton: {
    justifyContent: "center"
  },
  conjectures: {
    marginTop: "2rem"
  }
}));

export default function Main(props) {
  const classes = useStyles();
  const location = useLocation();
  const problem = location.state.problem;
  // const { posts, title } = props;
  // console.log(problem.created.toDate());
  console.log(timeago(problem.created.seconds * 1000));
  //   React.useEffect(() => {
  //     // const date = problem.created.isEqual(true);
  // data = new
  //     // console.log(date);
  //   }, []);

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Typography variant="h6" gutterBottom>
        {problem.title}
      </Typography>

      {/* <Divider /> */}
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
      <Markdown className={classes.markdown}>{problem.details}</Markdown>
      <Grid container className={classes.solveButton}>
        <Button variant="text" color="primary">
          Solve
        </Button>
      </Grid>
      <Typography
        className={classes.conjectures}
        variant="h5"
        align="center"
        gutterBottom
      >
        Conjectures
      </Typography>
    </Container>
  );
}
