import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import TwitterIcon from "@material-ui/icons/Twitter";
import React from "react";
import { useHistory } from "react-router-dom";
import { withFirebase } from "../firebase";

const useStyles = makeStyles(theme => ({
  socialLogin: {
    // marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

function SocialLogin({ firebase, twitterMessage }) {
  let history = useHistory();

  async function onSubmitTwitter(event) {
    const socialAuthUser = await firebase.doSignInWithTwitter();

    const person = await firebase
      .person(socialAuthUser.additionalUserInfo.username)
      .get();

    const timestamp = firebase.timestamp();

    if (person.exists) {
      firebase.person(socialAuthUser.additionalUserInfo.username).set(
        {
          lastSignin: timestamp
        },
        { merge: true }
      );
    } else {
      const name = socialAuthUser.additionalUserInfo.profile.name.split(" ");
      const email = socialAuthUser.additionalUserInfo.profile.email;

      await firebase.person(socialAuthUser.additionalUserInfo.username).set({
        firstName: name[0],
        lastName: name[1],
        username: socialAuthUser.additionalUserInfo.username,
        email: email ? email : "",
        uid: socialAuthUser.user.uid,
        created: timestamp,
        lastSignin: timestamp
      });

      await socialAuthUser.user.updateProfile({
        displayName: socialAuthUser.additionalUserInfo.username
      });
    }

    history.goBack();

    event.preventDefault();
  }

  const classes = useStyles();

  return (
    <div className={classes.socialLogin}>
      <Fab variant="extended" color="primary" onClick={onSubmitTwitter}>
        <TwitterIcon style={{ marginRight: "0.5rem" }} />
        {twitterMessage ? twitterMessage : "Twitter"}
      </Fab>
    </div>
  );
}

export default withFirebase(SocialLogin);
