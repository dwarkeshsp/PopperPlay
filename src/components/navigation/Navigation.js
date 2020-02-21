import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Account from "./Account";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1,
    textDecoration: "none"
  },
  philosophy: {
    marginRight: theme.spacing(1)
  }
}));

export default function Pricing() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        className={classes.appBar}
        elevation={0}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h5"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
            component={RouterLink}
            to="/"
          >
            PopperPlay
          </Typography>
          <Account />
        </Toolbar>
      </AppBar>
    </div>
  );
}
