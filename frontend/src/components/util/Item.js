import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import BuildIcon from "@material-ui/icons/Build";
import React from "react";
import { withFirebase } from "../firebase";
import ProblemConjecturesList from "../problems/ProblemConjecturesList";
import CreatePost from "./CreatePost";
import ItemInfo from "./ItemInfo";
import Markdown from "./Markdown";
import VoteButton from "./VoteButton";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "5rem"
  },
  // markdown: {
  //   padding: theme.spacing(3, 0)
  // },
  inline: {
    display: "inline"
  },
  solveButton: {
    justifyContent: "center"
  },
  conjectures: {
    marginTop: "0.5rem"
  }
}));

function Item({ item, problemID, problem, firebase }) {
  const classes = useStyles();
  const alertRef = React.useRef();

  return (
    <Container maxWidth="sm" className={classes.root}>
      {item && (
        <div>
          <Grid container>
            <Grid item xs={11}>
              <Typography variant="h6" gutterBottom>
                {item.title}
              </Typography>
              <ItemInfo item={item} />
            </Grid>
            <Grid item xs={1}>
              <VoteButton item={item} problem={problem} />
            </Grid>
          </Grid>
          <Markdown className={classes.markdown}>{item.details}</Markdown>
          <Grid container className={classes.solveButton}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<BuildIcon />}
              onClick={() => alertRef.current.handleOpen()}
            >
              {problem ? "Solve" : "Comment"}
            </Button>
            <CreatePost
              ref={alertRef}
              firebase={firebase}
              problemID={problemID}
              problem={problem}
            />
          </Grid>
          <Typography
            className={classes.conjectures}
            variant="h6"
            align="center"
            gutterBottom
          >
            {problem ? "Conjectures" : "Comments"}
          </Typography>
          {problem ? <ProblemConjecturesList problemID={problemID} /> : <div />}
        </div>
      )}
      {!item && (
        <div>
          <Typography align="center" variant="h5">
            Item not found
          </Typography>
        </div>
      )}
    </Container>
  );
}

export default withFirebase(Item);
