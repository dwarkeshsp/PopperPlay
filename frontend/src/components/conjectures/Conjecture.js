import React from "react";
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import timeago from "epoch-timeago";
import Markdown from "../util/Markdown";
import TagsList from "../tags/TagsList";
import ItemInfo from "../util/ItemInfo";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { withFirebase } from "../firebase";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "5rem"
  },
  markdown: {
    ...theme.typography.caption,
    padding: theme.spacing(3, 0)
  },
  inline: {
    display: "inline"
  },
  solveButton: {
    justifyContent: "center"
  },
  conjectures: {
    marginTop: "2rem"
  }
}));

function Conjecture({ firebase }) {
  const classes = useStyles();
  const location = useLocation();

  const [conjecture, setConjecture] = React.useState(
    location.state ? location.state.conjecture : null
  );

  React.useEffect(() => {
    if (!location.state) {
      const conjectureId = location.pathname.substr(9);
      firebase
        .conjecture(conjectureId)
        .get()
        .then(doc => {
          if (doc.exists) {
            setConjecture(doc.data());
          }
        });
      setConjecture();
    }
  }, []);

  return (
    <Container maxWidth="sm" className={classes.root}>
      {conjecture && (
        <div>
          <Typography variant="h6" gutterBottom>
            {conjecture.title}
          </Typography>
          <ItemInfo item={conjecture} />
          <Markdown className={classes.markdown}>{conjecture.details}</Markdown>
          <Grid container className={classes.solveButton}>
            <Button variant="text" color="primary">
              Criticize
            </Button>
          </Grid>
          <Typography
            className={classes.conjectures}
            variant="h5"
            align="center"
            gutterBottom
          >
            Conjectures
          </Typography>
        </div>
      )}
      {!conjecture && (
        <div>
          <Typography align="center" variant="h5">
            Conjecture not found
          </Typography>
        </div>
      )}
    </Container>
  );
}

export default withFirebase(Conjecture);
