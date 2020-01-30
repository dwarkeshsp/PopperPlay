import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import TwitterIcon from "@material-ui/icons/Twitter";
import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../firebase";
import Dialog from "../util/AlertDialog";
import FacebookIcon from "@material-ui/icons/Facebook";

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(2, 4),
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
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  socialLogin: {
    // marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

function LoginBase({ firebase }) {
  const classes = useStyles();

  const alertRef = React.useRef();

  const [email, setEmail] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [persistence, setPersistence] = React.useState(firebase.SESSION);

  let history = useHistory();

  React.useEffect(() => {
    setIsInvalid(!emailValid || password === "");
  }, [emailValid, password]);

  React.useEffect(() => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmailValid(re.test(email));
  }, [email]);

  const onSubmit = event => {
    firebase.setPersistence(persistence).then(function() {
      firebase
        .doSignInWithEmailAndPassword(email, password)
        .then(() => {
          const timestamp = firebase.timestamp();
          firebase.person(firebase.currentPerson().displayName).set(
            {
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
    });

    event.preventDefault();
  };

  const onSubmitTwitter = event => {
    firebase.doSignInWithTwitter().then(socialAuthUser => {
      // Create a user in your Firebase Realtime Database too
      return this.firebase.user(socialAuthUser.user.uid).set({
        username: socialAuthUser.additionalUserInfo.profile.name,
        email: socialAuthUser.additionalUserInfo.profile.email,
        roles: {}
      });
    });

    event.preventDefault();
  };

  return (
    <div>
      <Container maxWidth="sm">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={event => setEmail(event.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={event => setPassword(event.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  onChange={event => {
                    if (event.target.checked) {
                      setPersistence(firebase.LOCAL);
                    } else {
                      setPersistence(firebase.SESSION);
                    }
                  }}
                />
              }
              label="Remember me"
            />
            <div className={classes.socialLogin}>
              <Button variant="contained" color="primary">
                <TwitterIcon />
              </Button>
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isInvalid}
              onClick={event => onSubmit(event)}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <ForgotPassword />
              </Grid>
              <Grid item>
                <Link variant="body2" component={RouterLink} to="/signup">
                  Sign Up
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

function ForgotPassword() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Link variant="body2" onClick={handleClickOpen}>
        Forgot password
      </Link>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withFirebase(LoginBase);
