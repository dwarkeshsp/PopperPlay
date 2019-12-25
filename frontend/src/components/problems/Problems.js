import React from "react";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  padTop: {
    paddingTop: theme.spacing(2)
  }
}));

export default function Problems() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <PopperQuote />
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <Fab color="primary" aria-label="search">
        <AddIcon />
      </Fab>
    </div>
  );
}

function PopperQuote() {
  const classes = useStyles();
  return (
    <div className={classes.padTop}>
      <Typography variant="h5" align="center">
        "All life is problem solving"
      </Typography>
      <Typography variant="subtitle1" align="center">
        Karl Popper
      </Typography>
    </div>
  );
}
