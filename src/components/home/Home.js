import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import ItemCard from "../util/Card";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { withFirebase } from "../firebase";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Vote from "../util/buttons/Vote";

const useStyles = makeStyles(theme => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4, 0, 0)
  },
  buttons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardContent: {
    flexGrow: 1
  }
}));

export default function Home() {
  return (
    <div>
      <Container maxWidth="sm">
        <Header />
      </Container>
      <Container maxWidth="md">
        {/* <Grid container spacing={3} justify="center">
          <Grid item sm={6}> */}
        <Problems />
        {/* </Grid>
          <Grid item sm={6}> */}
        {/* <Conjectures /> */}
        {/* </Grid>
        </Grid> */}
      </Container>
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
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        paragraph
      >
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
  const classes = useStyles();

  const [problems, setProblems] = React.useState([]);
  const orderBy = "votes";
  const LOADSIZE = 3;

  React.useEffect(() => {
    firebase.query(orderBy, LOADSIZE, true).then(querySnapshot => {
      const problems = querySnapshot.docs.map(doc => doc.data());
      querySnapshot.docs.map((doc, index) => (problems[index].id = doc.id));
      setProblems(problems);
    });
  }, []);

  function title(problem) {
    const TITLELENGTH = 100;

    let title = problem.title.substr(0, TITLELENGTH);
    if (problem.title.substr(TITLELENGTH)) {
      title += "...";
    }
    title = title.replace(/(\r\n|\n|\r)/gm, "");
    return title;
  }

  function details(problem) {
    const DETAILLENGTH = 150;

    let details = problem.details.substr(0, DETAILLENGTH);
    if (problem.details.substr(DETAILLENGTH)) {
      details += "...";
    }
    details = details.replace(/(\r\n|\n|\r)/gm, "");
    return details;
  }

  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        style={{ marginTop: "2.5rem", marginBottom: "1rem" }}
      >
        Top Problems
      </Typography>
      <Grid container spacing={4}>
        {problems.map(problem => (
          <Grid item key={problem} xs={12} sm={6} md={4}>
            <RouterLink
              to={"/problem/" + problem.id}
              style={{ textDecoration: "none" }}
            >
              <CardActionArea component="a" href="#" className={classes.card}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {title(problem)}
                    </Typography>
                    <Typography variant="caption">
                      {details(problem)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Solve
                    </Button>
                    <Vote item={problem} problem />
                  </CardActions>
                </Card>
              </CardActionArea>
            </RouterLink>
          </Grid>
        ))}
      </Grid>
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
