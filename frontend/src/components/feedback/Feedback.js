import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    marginTop: "6rem"
  }
});

export default function Types() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" gutterBottom>
          Feedback
        </Typography>
        <Typography variant="body1" gutterBottom>
          PopperPlay is my conjecture about how we can create a platform for
          knowledge creation. But it contains many errors. I desperately need
          your help in order to identify and correct them.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Ideally, problems with PopperPlay will be solved using PopperPlay.
          This way, the entire platform can contribute and improve solutions.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Potential features, bugs, layouts, website architeces: any and all of
          these are tremenoudly helpful
        </Typography>
        <Typography variant="h6" gutterBottom>
          To give feedback, please create a problem using the tag "popperplay"
          or solve a problem with that tag.
        </Typography>
        <Typography variant="body1" gutterBottom>
          To directly reach me, please email me at
        </Typography>
        <a href="mailto:dwarkesh.sanjay.patel@gmail.com">
          <Typography variant="h6" color="textPrimary">
            dwarkesh.sanjay.patel@gmail.com
          </Typography>
        </a>
      </Container>
    </div>
  );
}
