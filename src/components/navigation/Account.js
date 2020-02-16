import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState(firebase.currentPerson().displayName);
  const [newNotifications, setNewNotifications] = useState(0);
  const open = Boolean(anchorEl);

  useEffect(() => {
    firebase
      .person(name)
      .get()
      .then(
        doc => doc.exists && setNewNotifications(doc.data().newNotifications)
      );
  }, []);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Link to="notifications">
        <IconButton style={{ marginRight: "1rem" }}>
          <Badge badgeContent={newNotifications} color="primary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Link>
      <Fab variant="extended" color="primary" onClick={handleMenu}>
        <AccountCircle style={{ marginRight: "0.5rem" }} />
        {name}
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
        <MenuItems />
      </Menu>
    </div>
  );
}

function MenuItemsBase({ firebase }) {
  const history = useHistory();

  return (
    <div>
      <MenuItem
        onClick={() =>
          history.push("/person/" + firebase.currentPerson().displayName)
        }
      >
        Profile
      </MenuItem>
      <MenuItem onClick={firebase.doSignOut}>Sign Out</MenuItem>
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

const LoggedIn = withFirebase(LoggedInBase);

const MenuItems = withFirebase(MenuItemsBase);
