import React from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../firebase";
import Dialog from "../util/Dialog";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const SignUp = compose(withRouter, withFirebase)(SignUpBase);

function SignUpBase(props) {
  const classes = useStyles();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordValid, setPasswordValid] = React.useState(false);
  const [checkedBox, setCheckedBox] = React.useState(false);
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  React.useEffect(() => {
    setIsInvalid(
      !passwordValid ||
        !emailValid ||
        firstName === "" ||
        lastName === "" ||
        !checkedBox
    );
  });

  React.useEffect(() => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmailValid(re.test(email));
  }, [email]);

  React.useEffect(() => {
    setPasswordValid(password.length > 5);
  }, [password]);

  const onSubmit = event => {
    props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        if (authUser.user) {
          authUser.user
            .updateProfile({
              displayName: firstName.concat(" ", lastName)
            })
            .then(s => {
              console.log(authUser.user.displayName);
              console.log("move one");
            });
        }
      })
      .catch(error => {
        setError(true);
        setErrorMessage(error.message);
      });

    //   setFirstName("");
    //   setLastName("");
    //   setEmail("");
    //   setEmailValid(false);
    //   setPassword("");
    //   setPasswordValid(false);
    //   setIsInvalid(false);
    //   setCheckedBox(false);
    // })
    // .catch(error => {
    //   console.warn(error);
    // })
    // .then(
    //   props.firebase
    //     .doSignInWithEmailAndPassword(email, password)
    //     .catch(error => console.warn(error))
    // )
    // .then(
    //   props.firebase
    //     .currentUser()
    //     .updateProfile({
    //       displayName: firstName.concat(" ", lastName)
    //       // photoURL: "https://example.com/jane-q-user/profile.jpg"
    //     })
    //     .then(function() {
    //       // Update successful.
    //       console.log("update succesful");
    //       console.log(this.firebase.UserInfo())
    //     })
    //     .catch(function(error) {
    //       // An error happened.
    //       console.log("update unsuccesful");
    //     })

    event.preventDefault();
  };

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={event => setFirstName(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  onChange={event => setLastName(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={event => setEmail(event.target.value)}
                />
              </Grid>
              {email !== "" && !emailValid && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="secondary">
                    * Email not valid
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={event => setPassword(event.target.value)}
                />
              </Grid>
              {password !== "" && !passwordValid && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="secondary">
                    * Password must be at least 7 characters long
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="check"
                      color="primary"
                      onChange={event => setCheckedBox(event.target.checked)}
                    />
                  }
                  label="Blah blah blah blah"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isInvalid}
              onClick={event => onSubmit(event)}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  component={RouterLink}
                  to="/login"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
      {error && <Dialog title="Error" message={errorMessage} button="Okay" />}
    </div>
  );
}

export default SignUp;
