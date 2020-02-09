import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { withFirebase } from "../firebase";
import { AuthUserContext } from "../session";
import TagsMenu from "../tags/TagsMenu";
import Dialog from "../util/AlertDialog";
import CreatePost from "../util/CreatePost";

const useStyles = makeStyles(theme => ({
  pad: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(4)
  }
}));

function ListHeader({ firebase, setTags, setOrderBy, type }) {
  const classes = useStyles();

  const alertRef = React.useRef();

  return (
    <div className={classes.pad}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <OrderByMenu setOrderBy={setOrderBy} />
        </Grid>
        <Grid item>
          <TagsMenu setValue={setTags} variant="outlined" />
        </Grid>
      </Grid>
      <Grid
        style={{ marginTop: "0.5rem" }}
        container
        spacing={2}
        justify="center"
      >
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => alertRef.current.handleOpen()}
          >
            {type === "problem" && "New problem"}
            {type === "conjecture" && "Create conjecture"}
          </Button>
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? (
                <CreatePost
                  firebase={firebase}
                  ref={alertRef}
                  problem={type === "problem"}
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
