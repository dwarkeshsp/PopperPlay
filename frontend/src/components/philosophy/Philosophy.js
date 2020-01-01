import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import StarIcon from "@material-ui/icons/StarBorder";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

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
  "@global": {
    ul: {
      margin: 0,
      padding: 0
    },
    li: {
      listStyle: "none"
    }
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6)
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[700]
        : theme.palette.grey[200]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2)
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6)
    }
  }
}));

export default function Pricing() {
  const classes = useStyles();

  return (
    <React.Fragment>
      {/* <Grid container spacing={3}>
        <Grid item xs={6}> */}
      <Container maxWidth="md" component="main" className={classes.heroContent}>
        <SubTitle text="Error correction" />

        <SubTitle text="Unity of knowledge" />

        <SubTitle text="Reason is fun" />
        <Text text="Solving problems is fun!" />
        <SubTitle text="Open source" />
      </Container>
      <Container maxWidth="md" component="main" className={classes.heroContent}>
        <SubTitle text="Non-coercive learning" />
        <Text text="Imagine you in high school again. Your education consists of pursuing the problems you find interesting. Instead of recieving conjectures as dogma, you get to contribute to their criticism. Someone just asked why.... You find the question interesting, so you teach yourself the background knowledge necessary to conjecture more knowledge about the problem. Far from needing permission to go to the bathroom, you are encouraged to refute experts. It is hard to overstate how much creativity the education system supresses. This platform can provide the open-ended non-coercive learning that we all wish we could have had." />
      </Container>
      {/* </Grid> */}
      {/* </Grid> */}
      {/* End hero unit */}
      
      {/* Footer */}
      {/* End footer */}
    </React.Fragment>
  );
}

const SubTitle = props => {
  return (
    <Typography
      component="h1"
      variant="h3"
      align="center"
      color="textPrimary"
      gutterBottom
    >
      {props.text}
    </Typography>
  );
};

const Text = props => {
  return (
    <Typography variant="h5" align="left" color="textSecondary" component="p">
      {props.text}
    </Typography>
  );
};
