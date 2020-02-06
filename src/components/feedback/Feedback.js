import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import EmailIcon from "@material-ui/icons/Email";
import TwitterIcon from "@material-ui/icons/Twitter";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import React from "react";

export default function Feedback() {
  return (
    <div style={{ marginTop: "4rem", marginBottom: "3rem" }}>
      <Container maxWidth="sm">
        <Typography variant="h6" align="center" gutterBottom paragraph>
          👋 Hi, I’m Dwarkesh. I'm trying to make a platform that helps people
          identify open problems and create new ideas. There is nothing more
          helpful and impactful to this mission than your feedback. Thank you
          for any suggestions and questions you have for me! 🙏
        </Typography>
        <Contact />
      </Container>
    </div>
  );
}

const Contact = () => (
  <Grid container spacing={3} justify="center">
    <Grid item>
      <a href="mailto:dwarkesh@popperplay.com" target="_blank">
        <Button variant="text" color="primary" startIcon={<EmailIcon />}>
          Email me
        </Button>
      </a>
    </Grid>
    <Grid item>
      <a href="https://calendly.com/dwarkesh/feedback" target="_blank">
        <Button variant="text" color="primary" startIcon={<VideoCallIcon />}>
          Video chat with me
        </Button>
      </a>
    </Grid>
    <Grid item>
      <a href="https://twitter.com/PopperPlay" target="_blank">
        <Button variant="text" color="primary" startIcon={<TwitterIcon />}>
          DM me
        </Button>
      </a>
    </Grid>
  </Grid>
);
