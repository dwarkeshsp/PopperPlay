import React from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "../firebase";
import { AuthUserContext } from "../session";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

export default function Account() {
  return (
    <div>
      <AuthUserContext.Consumer>
        {authUser => (authUser ? <LoggedIn /> : <NotLoggedIn />)}
      </AuthUserContext.Consumer>
    </div>
  );
}

function LoggedIn() {
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
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
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
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <SignOut />
      </Menu>
    </div>
  );
}

function NotLoggedIn() {
  return (
    <div>
      <Button variant="outlined" color="inherit" component={Link} to="/signup">
        Signup
      </Button>
      <Button
        color="inherit"
        // variant="contained"
        component={Link}
        to="/login"
      >
        Login
      </Button>
    </div>
  );
}

function SignOutBase(props) {
  return <MenuItem onClick={props.firebase.doSignOut}>Sign Out</MenuItem>;
}

const SignOut = withFirebase(SignOutBase);
