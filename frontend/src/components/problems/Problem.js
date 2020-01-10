import React from "react";
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import timeago from "epoch-timeago";
import Markdown from "../util/Markdown";
import TagsList from "../tags/TagsList";
import ItemInfo from "../util/ItemInfo";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { withFirebase } from "../firebase";

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

function Problem({ firebase }) {
  const classes = useStyles();
  const location = useLocation();

  const [problem, setProblem] = React.useState(
    location.state ? location.state.problem : null
  );

  React.useEffect(() => {
    if (!location.state) {
      const problemId = location.pathname.substr(9);
      firebase
        .problem(problemId)
        .get()
        .then(doc => {
          if (doc.exists) {
            setProblem(doc.data());
          }
        });
      setProblem();
    }
  }, []);

  return (
    <Container maxWidth="sm" className={classes.root}>
      {problem && (
        <div>
          <Typography variant="h6" gutterBottom>
            {problem.title}
          </Typography>
          <ItemInfo item={problem} />
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
        </div>
      )}
      {!problem && (
        <div>
          <Typography align="center" variant="h5">
            Problem not found
          </Typography>
        </div>
      )}
    </Container>
  );
}

export default withFirebase(Problem);
