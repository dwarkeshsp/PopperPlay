import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    marginTop: "2rem"
  }
});

export default function Types() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        {/* <Typography variant="body1"  align="center" gutterBottom >
          PopperPlay is my conjecture about how we can create a platform for
          knowledge creation. But it contains many errors. I desperately need
          your help in order to identify and correct them.
        </Typography> */}
        <Typography variant="h6" align="center" gutterBottom paragraph>
          👋 I’m Dwarkesh — the maker behind this site. I'm trying to make a
          better platform for problem solving. There is nothing more useful to
          this mission than your feedback. Thank you!!! 🙏
        </Typography>
        <Typography variant="h5" align="center" gutterBottom paragraph>
          To give feedback, please create a problem using the tag "popperplay"
          or solve a problem with that tag.
        </Typography>
        <Typography variant="h6" align="center" gutterBottom paragraph>
          Platform structure, feature requests, bugs, philosophy, user
          interfaces - I desperately need your help with all of these. Ideally,
          problems with PopperPlay will be solved using PopperPlay. This way,
          the entire platform can contribute and improve solutions.
        </Typography>

        <Typography
          variant="h6"
          align="center"
          color="textSecondary"
          gutterBottom
        >
          To directly reach me, please email me at
        </Typography>
        <a href="mailto:dwarkesh.sanjay.patel@gmail.com">
          <Typography align="center" variant="h4" color="textPrimary">
            dwarkesh.sanjay.patel@gmail.com
          </Typography>
        </a>
      </Container>
    </div>
  );
}
