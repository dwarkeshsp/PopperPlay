import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TwitterIcon from "@material-ui/icons/Twitter";
import React from "react";
import { withFirebase } from "../firebase";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  socialLogin: {
    // marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

function SocialLogin({ firebase }) {
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

    // console.log(
    //   "name",
    //   socialAuthUser.additionalUserInfo.profile.name,
    //   "email",
    //   socialAuthUser.additionalUserInfo.profile.email,
    //   "displayname",
    //   socialAuthUser.user.displayName,
    //   "username",
    //   socialAuthUser.additionalUserInfo.username,
    //   socialAuthUser
    // );
    // await firebase.person.set({});

    // socialAuthUser,
    // socialAuthUser.additionalUserInfo.username,
    // socialAuthUser.user.displayName

    // Create a user in your Firebase Realtime Database too
    // return = firebase.user(socialAuthUser.user.uid).set({
    //   username: socialAuthUser.additionalUserInfo.profile.name,
    //   email: socialAuthUser.additionalUserInfo.profile.email,
    //   roles: {}
    // });

    event.preventDefault();
  }
  const classes = useStyles();
  return (
    <div className={classes.socialLogin}>
      <Button
        variant="contained"
        color="primary"
        onClick={onSubmitTwitter}
        startIcon={<TwitterIcon />}
      >
        Twitter
      </Button>
    </div>
  );
}

export default withFirebase(SocialLogin);
