import React from "react";
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import timeago from "epoch-timeago";
import { withFirebase } from "../firebase";
import ProblemConjecturesList from "./ProblemConjecturesList";
import CreatePost from "../util/CreatePost";
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
import BuildIcon from "@material-ui/icons/Build";

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
    marginTop: "0.5rem"
  }
}));

function Problem({ firebase }) {
  const classes = useStyles();
  const location = useLocation();
  const problemID = location.pathname.substr(9);
  const alertRef = React.useRef();

  const [problem, setProblem] = React.useState(
    location.state ? location.state.problem : null
  );

  React.useEffect(() => {
    if (!location.state) {
      firebase
        .problem(problemID)
        .get()
        .then(doc => {
          if (doc.exists) {
            setProblem(doc.data());
          }
        });
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
            <Button
              variant="contained"
              color="primary"
              startIcon={<BuildIcon />}
              onClick={() => alertRef.current.handleOpen()}
            >
              Solve
            </Button>
            <CreatePost
              ref={alertRef}
              firebase={firebase}
              problemID={problemID}
            />
          </Grid>
          <Typography
            className={classes.conjectures}
            variant="h6"
            align="center"
            gutterBottom
          >
            Conjectures
          </Typography>
          <ProblemConjecturesList problemID={problemID} />
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
