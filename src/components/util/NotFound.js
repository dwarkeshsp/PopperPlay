import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "3rem"
  }
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="sm">
        <Typography variant="h2" align="center" gutterBottom>
          <SentimentVeryDissatisfiedIcon style={{ fontSize: 50 }} />
          {" Page not found"}
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          If this is the result of a bug, please post it as a problem with the
          tag "popperplay"
        </Typography>
      </Container>
    </div>
  );
}
