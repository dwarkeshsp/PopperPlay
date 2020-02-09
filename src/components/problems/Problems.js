import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { withFirebase } from "../firebase";
import List from "../util/List";
import ListHeader from "../util/ListHeader";

function Problems(props) {
  const [tags, setTags] = React.useState([]);
  const [orderBy, setOrderBy] = React.useState("created");

  return (
    <div>
      <Container maxWidth="md">
        <Quote />
        <ListHeader setTags={setTags} setOrderBy={setOrderBy} type="problem" />
        <List tags={tags} orderBy={orderBy} problem type="problem" />
      </Container>
    </div>
  );
}

function Quote() {
  return (
    <div>
      {/* <Typography variant="h5" align="center" color="textPrimary" gutterBottom>
        All life is problem solving
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary">
        Karl Popper
      </Typography> */}
      <Typography variant="subtitle1" align="center" color="textPrimary">
        A problem exists when it seems that some of our theories seem inadequate
        and worth trying to improve.
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary">
        David Deutsch
      </Typography>
    </div>
  );
}

export default withFirebase(Problems);
