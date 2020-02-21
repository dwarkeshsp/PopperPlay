import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import TwitterIcon from "@material-ui/icons/Twitter";
import DescriptionIcon from "@material-ui/icons/Description";
import React from "react";
import ReactPlayer from "react-player";
import { Link as RouterLink } from "react-router-dom";
import { TwitterShareButton } from "react-share";
import Feedback from "../feedback/Feedback";
import SocialLogin from "../login/SocialLogin";
import { AuthUserContext } from "../session";

export default function Home() {
  return (
    <Container maxWidth="md">
      <Quote />
      <Philosophy />
      <Buttons />
      <Description />
      <Share />
      {/* <TwitterLogin /> */}
      <Feedback />
    </Container>
  );
}

const Quote = () => (
  <React.Fragment>
    <Typography
      style={{ marginTop: "2rem" }}
      variant="h5"
      align="center"
      gutterBottom
    >
      Discovery: first a problem, then conjecture, then criticism, then new
      problem
    </Typography>
    <Typography variant="h6" align="center" color="textSecondary" paragraph>
      David Deutsch
    </Typography>
  </React.Fragment>
);

const Description = () => (
  <React.Fragment>
    <Typography
      style={{ marginTop: "6rem" }}
      variant="h4"
      align="center"
      paragraph
    >
      PopperPlay is a platform where people can post open problems and the
      conjectures about how to solve them.
    </Typography>
  </React.Fragment>
);

const Buttons = () => (
  <div style={{ marginTop: "2rem" }}>
    <Grid container spacing={2} justify="center">
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/problems"
        >
          Solve Problems
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          color="primary"
          component={RouterLink}
          to="/conjectures"
        >
          Create Conjectures
        </Button>
      </Grid>
    </Grid>
  </div>
);

const TwitterLogin = () => (
  <Grid style={{ marginTop: "2rem" }} container justify="center">
    <SocialLogin twitterMessage="Sign up with twitter" />
  </Grid>
);

const Share = () => (
  <Grid style={{ marginTop: "2rem" }} container justify="center">
    <TwitterShareButton
      url={"popperplay.com"}
      children={
        <Button variant="contained" color="primary" startIcon={<TwitterIcon />}>
          Spread the word!
        </Button>
      }
      title="Yonder across the internet, I discovered PopperPlay.com!!! It's a platform where people can post open problems and the conjectures about how to solve them.\nPopperPlay helps people create new ideas and identify the inadequacies in our prevailing theories. Check it out!!!"
    />
  </Grid>
);

const Philosophy = () => (
  <Grid container justify="center">
    <Button
      variant="text"
      color="primary"
      size="large"
      startIcon={<DescriptionIcon />}
      component={RouterLink}
      to="/philosophy"
    >
      Read the Philosophy
    </Button>
  </Grid>
);

function Video() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Grid container justify="center">
        <Button
          variant="text"
          color="primary"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={handleClickOpen}
        >
          Watch the video
        </Button>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="xl">
        <DialogContent>
          <Typography variant="subtitle1" align="center">
            I'm still making the video but in the meantime enjoy some puppers!!!
          </Typography>
          <ReactPlayer
            controls
            playing="true"
            url="https://www.youtube.com/watch?v=sD9gTAFDq40"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
