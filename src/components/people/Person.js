import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "3rem"
  }
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Typography variant="h2" align="center" gutterBottom>
          Not yet implemented
        </Typography>
      </Container>
    </div>
  );
}
