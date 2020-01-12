import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import { fade, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import React from "react";
import { Link } from "react-router-dom";
import Account from "./Account";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },

  title: {
    textDecoration: "none",
    flexGrow: 1
  }
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navigation(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <HideOnScroll {...props}>
        <AppBar color="primary">
          <Toolbar>
            <Typography
              component={Link}
              to="/"
              className={classes.title}
              variant="h5"
              noWrap
              color="inherit"
            >
              PopperPlay
            </Typography>
            <Account />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Box mt={"4rem"}></Box>
    </div>
  );
}
