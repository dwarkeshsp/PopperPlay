import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TwitterIcon from "@material-ui/icons/Twitter";
import React from "react";
import { withFirebase } from "../firebase";

const useStyles = makeStyles(theme => ({
  socialLogin: {
    // marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

function SocialLogin({ firebase }) {
  const onSubmitTwitter = event => {
    firebase.doSignInWithTwitter().then(socialAuthUser => {
      console.log(socialAuthUser, "blah");

      // Create a user in your Firebase Realtime Database too
      // return = firebase.user(socialAuthUser.user.uid).set({
      //   username: socialAuthUser.additionalUserInfo.profile.name,
      //   email: socialAuthUser.additionalUserInfo.profile.email,
      //   roles: {}
      // });
    });

    event.preventDefault();
  };
  const classes = useStyles();
  return (
    <div className={classes.socialLogin}>
      <Button
        variant="contained"
        color="primary"
        // onClick={onSubmitTwitter}
      >
        <TwitterIcon /> {" Twitter"}
      </Button>
    </div>
  );
}

export default withFirebase(SocialLogin);
