import React from "react";
import { Link as RouterLink, withRouter, useHistory } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../firebase";
import Dialog from "../util/AlertDialog";
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
    width: "100%",
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function SignUpBase(props) {
  const classes = useStyles();

  const history = useHistory();

  const alertRef = React.useRef();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [usernameValid, setUsernameValid] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordValid, setPasswordValid] = React.useState(false);
  const [checkedBox, setCheckedBox] = React.useState(false);
  const [isInvalid, setIsInvalid] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const MINPASSWORDLENGTH = 7;

  React.useEffect(() => {
    setIsInvalid(
      !passwordValid ||
        !emailValid ||
        !usernameValid ||
        firstName === "" ||
        lastName === "" ||
        !checkedBox
    );
  }, [
    firstName,
    lastName,
    passwordValid,
    emailValid,
    checkedBox,
    usernameValid
  ]);

  // * better solution is to use on change for textboxes instead of hooks
  React.useEffect(() => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmailValid(re.test(email));
  }, [email]);

  React.useEffect(() => {
    setPasswordValid(password.length >= MINPASSWORDLENGTH);
  }, [password]);

  // * might be causing a shitton of document reads. Fix if so.
  React.useEffect(() => {
    if (username !== "") {
      props.firebase
        .user(username)
        .get()
        .then(doc => {
          setUsernameValid(!doc.exists);
        })
        .catch(error => console.log(error));
    }
  }, [username]);

  // * consider adding email verification
  const onSubmit = event => {
    const timestamp = props.firebase.timestamp();
    props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        authUser.user.updateProfile({
          displayName: username
        });
        return props.firebase.user(username).set(
          {
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            uid: authUser.user.uid,
            created: timestamp,
            lastSignin: timestamp
          },
          { merge: true }
        );
      })
      .then(() => {
        history.goBack();
      })
      .catch(error => {
        setErrorMessage(error.message);
        alertRef.current.handleOpen();
      });
    event.preventDefault();
  };

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          {/* buffer */}
          <h1> </h1>
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
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  onChange={event => setUsername(event.target.value)}
                />
              </Grid>
              {username !== "" && !usernameValid && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="secondary">
                    * Username already taken
                  </Typography>
                </Grid>
              )}
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
                    * Password must be at least {MINPASSWORDLENGTH} characters
                    long
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
      <Dialog
        ref={alertRef}
        title="Error"
        message={errorMessage}
        button="Okay"
      />
    </div>
  );
}

const SignUp = compose(withRouter, withFirebase)(SignUpBase);

export default SignUp;
