import React from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

export default function Feedback() {
  return (
    <div style={{ marginTop: "1rem" }}>
      <Container maxWidth="sm">
        <Typography variant="h6" gutterBottom paragraph>
          👋 Hi, I’m Dwarkesh. I'm trying to make a platform that helps people
          identify open problems and create new ideas. There is nothing more
          helpful to this mission than your feedback. Thank you! 🙏
        </Typography>
        <Typography
          style={{ marginTop: "2rem" }}
          variant="h5"
          // align="center"
          gutterBottom
          paragraph
        >
          To give feedback 📝, please create or solve a problem with the tag
          "popperplay"
        </Typography>
        {/* <Typography variant="body1"  align="center" gutterBottom >
          PopperPlay is my conjecture about how we can create a platform for
          knowledge creation. But it contains many errors. I desperately need
          your help in order to identify and correct them.
        </Typography> */}
        <Typography variant="body1" gutterBottom paragraph>
          I want to see if problems with PopperPlay can be solved using
          PopperPlay. This way, the entire platform can contribute and improve
          ideas.
        </Typography>
        <Typography variant="body1" gutterBottom paragraph>
          Every problem, comment, and suggestion you have is tremendously
          helpful at this early stage. Everything is subject to improvement:
          platform structure, features, philosophy, user interfaces.
        </Typography>
        <a
          href="https://gitlab.com/dwarkeshsp/popperplay/issues"
          target="_blank"
        >
          <Typography
            style={{ marginTop: "2rem" }}
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
        <Typography
          variant="h6"
          align="center"
          color="textSecondary"
          gutterBottom
        >
          Please feel free to contact me for any reason at
        </Typography>
        <a href="mailto:dwarkesh.sanjay.patel@gmail.com" target="_blank">
          <Typography
            align="center"
            variant="h5"
            color="textPrimary"
            gutterBottom
            // style={{ marginBottom: "3rem" }}
          >
            dwarkesh.sanjay.patel@gmail.com
          </Typography>
        </a>
      </Container>
    </div>
  );
}
