import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Account from "./Account";

const useStyles = makeStyles(theme => ({
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
    margin: theme.spacing(2)
  }
}));

export default function Pricing() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="default" className={classes.appBar}>
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
          <nav>
            {/* <Link
              variant="button"
              color="inherit"
              component={RouterLink}
              to="/feedback"
            >
              Feedback
            </Link> */}
            <Link
              variant="button"
              color="inherit"
              className={classes.philosophy}
              component={RouterLink}
              to="/philosophy"
            >
              Philosophy
            </Link>
            {/* <Link
              variant="button"
              color="textPrimary"
              href="#"
              className={classes.link}
            >
              Support
            </Link> */}
          </nav>
          {/* <Button
            href="#"
            color="primary"
            variant="outlined"
            className={classes.link}
          >
            Login
          </Button> */}
          <Account />
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
