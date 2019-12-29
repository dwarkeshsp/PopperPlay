import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { AuthUserContext } from "../session";
import Dialog from "../util/AlertDialog";
import CreateProblem from "./CreateProblem";
import ProblemsList from "./ProblemsList";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { fade, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withFirebase } from "../firebase";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3)
  },
  heroButtons: {
    marginTop: theme.spacing(2)
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
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function Problems(props) {
  const classes = useStyles();

  const [tags, setTags] = React.useState([]);

  return (
    <div>
      <ProblemsHeader firebase={props.firebase} tags={tags} setTags={setTags} />
      <ProblemsList />
    </div>
  );
}

function ProblemsHeader(props) {
  const classes = useStyles();

  const alertRef = React.useRef();

  return (
    <div className={classes.heroContent}>
      <CssBaseline />

      <Container maxWidth="sm">
        <Typography
          variant="h5"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          All life is problem solving
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Karl Popper
        </Typography>
        <div className={classes.heroButtons}>
          <Grid container spacing={2} justify="center">
            <Grid item>
              <TextField id="search" label="Search" type="search" />
            </Grid>
            <Grid item>
              <TagFilter firebase={props.firebase} setValue={props.setTags} />
            </Grid>
          </Grid>
          <Grid container spacing={2} justify="center">
            <div className={classes.heroButtons}>
              <Grid item>
                {/* <Fab color="primary" aria-label="add">
                  <AddIcon />
                </Fab> */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    alertRef.current.handleOpen();
                  }}
                >
                  New problem
                </Button>
                <AuthUserContext.Consumer>
                  {authUser =>
                    authUser ? (
                      <CreateProblem ref={alertRef} firebase={props.firebase} />
                    ) : (
                        <Dialog
                          ref={alertRef}
                          title="Not logged in"
                          message={"You must login in order to post a problem."}
                          button="Okay"
                        />
                    )
                  }
                </AuthUserContext.Consumer>
              </Grid>
            </div>
          </Grid>
        </div>
      </Container>
    </div>
  );
}

function TagFilter(props) {
  const [options, setOptions] = React.useState(allTags());

  function allTags() {
    let options = [];
    props.firebase
      .tags()
      .get()
      .then(querySnapshot =>
        querySnapshot.forEach(doc => options.push(doc.id))
      );
    return options;
  }

  return (
    <div>
      <Autocomplete
        id="tags"
        freeSolo
        multiple
        options={options}
        // options={top100Films.map(option => option.title)}
        renderInput={params => (
          <TextField
            {...params}
            label="Tags"
            variant={"outlined"}
            margin="dense"
            fullWidth
          />
        )}
        onChange={(event, value) => props.setValue(value)}
      />
    </div>
  );
}

export default withFirebase(Problems);
