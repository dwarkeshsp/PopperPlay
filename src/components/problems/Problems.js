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
      <Quote />
      <ListHeader
        // className={classes.header}
        setTags={setTags}
        setOrderBy={setOrderBy}
        problem
      />
      <Container maxWidth="md">
        <List tags={tags} orderBy={orderBy} problem />
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
      <Typography variant="h5" align="center" color="textPrimary" gutterBottom>
        The raw material for creativity is problems
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary">
        David Deutsch
      </Typography>
    </div>
  );
}

export default withFirebase(Problems);
