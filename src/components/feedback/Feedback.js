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
    <div style={{ marginTop: "6rem", marginBottom: "3rem" }}>
      <Container maxWidth="md">
        <Typography variant="h6" align="center" gutterBottom paragraph>
          👋 Hi, I’m Dwarkesh. I'm building PopperPlay to help people create new
          ideas and identify the inadequacies in our prevailing theories. There
          is nothing more helpful to this mission than your feedback. Thank you
          for any suggestions and criticism you have for me! 🙏
        </Typography>
        <Contact />
      </Container>
    </div>
  );
}

const Contact = () => (
  <Grid container spacing={3} justify="center">
    <Grid item>
      <a href="mailto:dwarkesh.sanjay.patel@gmail.com" target="_blank">
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
