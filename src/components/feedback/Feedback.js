import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    marginTop: "1rem"
  }
});

export default function Types() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Typography variant="h6" align="center" gutterBottom paragraph>
          👋 Hi, I’m Dwarkesh. I'm trying to make a platform for fun and open
          problem solving. There is nothing more useful to this mission than
          your feedback. Thank you for your help! 🙏
        </Typography>
        <Typography variant="h4" align="center" gutterBottom paragraph>
          To give feedback, please create or solve a problem with the tag
          "popperplay".
        </Typography>
        {/* <Typography variant="body1"  align="center" gutterBottom >
          PopperPlay is my conjecture about how we can create a platform for
          knowledge creation. But it contains many errors. I desperately need
          your help in order to identify and correct them.
        </Typography> */}
        <Typography variant="h6" align="center" gutterBottom paragraph>
          I'm hoping that problems with PopperPlay will be solved using
          PopperPlay. This way, the entire platform can contribute and improve
          ideas.
        </Typography>
        <Typography variant="h6" align="center" gutterBottom paragraph>
          Every problem, comment, and suggestion you have is tremendously
          helpful at this early stage. All is subject to improvement: Platform
          structure, features, bugs, philosophy, user interfaces.
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="textSecondary"
          gutterBottom
        >
          Please feel free to contact me for any reason at
        </Typography>
        <a href="mailto:dwarkesh@popperplay.com" target="_blank">
          <Typography
            align="center"
            variant="h5"
            color="textPrimary"
            gutterBottom
            // style={{ marginBottom: "3rem" }}
          >
            dwarkesh@popperplay.com
          </Typography>
        </a>
        <a
          href="https://gitlab.com/dwarkeshsp/popperplay/issues"
          target="_blank"
        >
          <Typography
            variant="h5"
            align="center"
            color="textPrimary"
            gutterBottom
            paragraph
          >
            🐛 To report a bug or a technical issue, please create an issue on
            Gitlab (click here).
          </Typography>
        </a>
      </Container>
    </div>
  );
}
