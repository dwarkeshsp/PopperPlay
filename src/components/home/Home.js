import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4, 0, 0)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Discovery: first a problem, then conjecture, then criticism, then new
          problem
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          David Deutsch
          {/* News, academia, and social media are broken. We need a system that
              incentivizes the creation of new ideas and the correction of
              errors. */}
        </Typography>
        <div className={classes.heroButtons}>
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
      </Container>
    </div>
  );
}
