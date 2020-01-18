import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
import React from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "../firebase";
import { AuthUserContext } from "../session";

export default function Account() {
  return (
    <div>
      <AuthUserContext.Consumer>
        {authUser => (authUser ? <LoggedIn /> : <NotLoggedIn />)}
      </AuthUserContext.Consumer>
    </div>
  );
}

function LoggedInBase({ firebase }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Fab variant="extended" color="primary" onClick={handleMenu}>
        <AccountCircle style={{ marginRight: "0.5rem" }} />
        {firebase.currentPerson().displayName}
      </Fab>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={open}
        onClose={handleClose}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem> */}
        <SignOut />
      </Menu>
    </div>
  );
}

function NotLoggedIn() {
  return (
    <div>
      <Button variant="contained" color="primary" component={Link} to="/signup">
        Signup
      </Button>
      <Button color="primary" component={Link} to="/login">
        Login
      </Button>
    </div>
  );
}

function SignOutBase(props) {
  return <MenuItem onClick={props.firebase.doSignOut}>Sign Out</MenuItem>;
}

const LoggedIn = withFirebase(LoggedInBase);

const SignOut = withFirebase(SignOutBase);
