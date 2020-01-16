import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Card from "../util/Card";
import { withFirebase } from "../firebase";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(theme => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(5, 0, 0)
  },
  buttons: {
    marginTop: theme.spacing(4)
  }
}));

export default function Home() {
  return (
    <div>
      <Container maxWidth="md">
        <Header />
      </Container>
      {/* <Container maxWidth="md">
        <Grid container spacing={3} justify="center">
          <Grid item sm={6}>
            <Problems />
          </Grid>
          <Grid item sm={6}>
            <Conjectures />
          </Grid>
        </Grid>
      </Container> */}
    </div>
  );
}

function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
        Discovery: first a problem, then conjecture, then criticism, then new
        problem
      </Typography>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        David Deutsch
      </Typography>
      <div className={classes.buttons}>
        <Grid container spacing={2} justify="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/problems"
            >
              Solve Problems
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/conjectures"
            >
              Create Conjectures
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

const Problems = withFirebase(ProblemsBase);

function ProblemsBase({ firebase }) {
  const [problems, setProblems] = React.useState([]);
  const orderBy = "votes";
  const LOADSIZE = 5;

  React.useEffect(() => {
    firebase.query(orderBy, LOADSIZE, true).then(querySnapshot => {
      const problems = querySnapshot.docs.map(doc => doc.data());
      setProblems(problems);
    });
  }, []);
  return (
    <div>
      <Typography
        variant="h5"
        align="center"
        style={{ marginTop: "2.5rem", marginBottom: "1rem" }}
      >
        Top Problems
      </Typography>
      {problems.map(problem => (
        <Card item={problem} problem={true} noDetails />
      ))}
    </div>
  );
}

const Conjectures = withFirebase(ConjecturesBase);

function ConjecturesBase({ firebase }) {
  const [conjectures, setConjectures] = React.useState([]);
  const orderBy = "votes";
  const LOADSIZE = 5;

  React.useEffect(() => {
    firebase.query(orderBy, LOADSIZE, false).then(querySnapshot => {
      const conjectures = querySnapshot.docs.map(doc => doc.data());
      setConjectures(conjectures);
    });
  }, []);
  return (
    <div>
      <Typography
        variant="h5"
        align="center"
        style={{ marginTop: "2.5rem", marginBottom: "1rem" }}
      >
        Top Conjectures
      </Typography>
      {conjectures.map(conjecture => (
        <Card item={conjecture} problem={false} noDetails />
      ))}
    </div>
  );
}
