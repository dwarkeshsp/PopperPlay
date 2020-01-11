import React from "react";
import { Link } from "react-router-dom";
import { AuthUserContext } from "../session";
import Dialog from "../util/AlertDialog";
import CreatePost from "../util/CreatePost";
import TagsMenu from "../tags/TagsMenu";
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
  heroButtons: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1.5)
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

function ListHeader(props) {
  const classes = useStyles();

  const alertRef = React.useRef();

  return (
    <div className={classes.heroButtons}>
      <Grid container direction="row" justify="center" alignItems="center">
        {/* fix order by so that it can be reincluded */}
        <Grid item>
          <OrderByMenu setOrderBy={props.setOrderBy} />
        </Grid>
        {/* make search so that it can be reincluded */}
        {/* <Grid item>
          <TextField id="search" label="Search" type="search" />
        </Grid> */}
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
              {props.problem ? "New problem" : "Create conjecture"}
            </Button>
            <AuthUserContext.Consumer>
              {authUser =>
                authUser ? (
                  <CreatePost
                    ref={alertRef}
                    firebase={props.firebase}
                    problem={props.problem}
                  />
                ) : (
                  <Dialog
                    ref={alertRef}
                    title="Not logged in"
                    message={"You must login in order to perform this action."}
                    button="Okay"
                  />
                )
              }
            </AuthUserContext.Consumer>
          </Grid>
        </div>
      </Grid>
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
            props.setOrderBy("votes");
            handleClose();
          }}
        >
          Votes
        </MenuItem>
      </Menu>
    </div>
  );
}

export default withFirebase(ListHeader);
