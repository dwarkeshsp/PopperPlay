import React from "react";
import { Link } from "react-router-dom";
import { AuthUserContext } from "../session";
import Dialog from "../util/AlertDialog";
import CreateProblem from "../util/CreatePost";
import TagsMenu from "../tags/TagsMenu";
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
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withFirebase } from "../firebase";

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

function Problems(props) {
  const [tags, setTags] = React.useState([]);
    const [orderBy, setOrderBy] = React.useState("created");


  return (
    <div>
      <Container maxWidth="md">
        <ProblemsHeader
          firebase={props.firebase}
          tags={tags}
          setTags={setTags}
          setOrderBy={setOrderBy}
        />
        <ProblemsList tags={tags} orderBy={orderBy}/>
      </Container>
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
              <OrderByMenu setOrderBy={props.setOrderBy}/>
            </Grid>
            <Grid item>
              <TextField id="search" label="Search" type="search" />
            </Grid>
            <Grid item>
              <TagsMenu setValue={props.setTags} variant="outlined" />
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
                  onClick={() => alertRef.current.handleOpen()}
                >
                  New problem
                </Button>
                <AuthUserContext.Consumer>
                  {authUser =>
                    authUser ? (
                      <CreateProblem ref={alertRef} firebase={props.firebase} problem/>
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

function OrderByMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Order By
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            props.setOrderBy("created");
            handleClose();
          }}
        >
          Most Recent
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.setOrderBy("likes");
            handleClose();
          }}
        >
          Likes
        </MenuItem>
      </Menu>
    </div>
  );
}
export default withFirebase(Problems);
