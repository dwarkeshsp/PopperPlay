import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import React from "react";
import ReactPlayer from "react-player";
import { Link as RouterLink } from "react-router-dom";
import Feedback from "../feedback/Feedback";
import { withFirebase } from "../firebase";
import Vote from "../util/buttons/Vote";
import ItemInfo from "../util/ItemInfo";

const useStyles = makeStyles(theme => ({
  root: {
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
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(6),
    padding: theme.spacing(2, 0)
  }
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <Feedback />
      {/* <Video /> */}

      {/* <Feedback /> */}
      {/* <Grid container spacing={3} justify="center">
          <Grid item sm={6}> */}
      {/* <Problems /> */}
      {/* </Grid>
          <Grid item sm={6}> */}
      {/* <Conjectures /> */}
      {/* </Grid>
        </Grid> */}
      {/* <Footer /> */}
    </div>
  );
}

function Header() {
  const classes = useStyles();

  return (
    <div>
      <Container maxWidth="sm">
        <Typography
          variant="h5"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Discovery: first a problem, then conjecture, then criticism, then new
          problem
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          David Deutsch
        </Typography>
        <Grid container justify="center">
          <Video />
        </Grid>
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
      </Container>
    </div>
  );
}

function Video() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="text"
        color="primary"
        size="large"
        onClick={handleClickOpen}
      >
        <PlayArrowIcon />
        {" Watch video"}
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xl">
        <DialogContent>
          <ReactPlayer
            controls
            playing="true"
            url="https://www.youtube.com/watch?v=sD9gTAFDq40"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FeedbackHome() {
  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h" align="center" color="textPrimary" gutterBottom>
        Help me improve PopperPlay
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="textSecondary"
        component="p"
      >
        Quickly build an effective pricing table for your potential customers
        with this layout. It&apos;s built with default Material-UI components
        with little customization.
      </Typography>
      <Grid
        style={{ marginTop: "2rem" }}
        container
        spacing={5}
        alignItems="flex-end"
      >
        <Grid item xs={12} sm={6} md={4}>
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
  );
}

function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          PopperPlay
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          Please feel free to contact me for any reason at
        </Typography>
        <Link
          color="inherit"
          href="mailto:dwarkesh@popperplay.com"
          target="_blank"
        >
          <Typography
            variant="subtitle1"
            align="center"
            color="textPrimary"
            component="p"
          >
            dwarkesh@popperplay.com
          </Typography>
        </Link>
        <Link
          color="inherit"
          href="https://gitlab.com/dwarkeshsp/popperplay"
          target="_blank"
        >
          <Typography
            variant="subtitle1"
            align="center"
            color="textPrimary"
            component="p"
            gutterBottom
          >
            Source Code
          </Typography>
        </Link>
        {/* <Copyright /> */}
      </Container>
    </footer>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://popperplay.com/">
        PopperPlay
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
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
        style={{ marginTop: "3rem", marginBottom: "1rem" }}
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
                    <ItemInfo item={problem} />
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
        <Card item={conjecture} problem={false} comment />
      ))}
    </div>
  );
}
