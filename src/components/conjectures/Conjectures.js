import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React from "react";
import List from "../util/List";
import ListHeader from "../util/ListHeader";

export default function Blog() {
  const [tags, setTags] = React.useState([]);
  const [orderBy, setOrderBy] = React.useState("created");

  return (
    <div>
      <Container maxWidth="md">
        <Quote />
        <ListHeader setTags={setTags} setOrderBy={setOrderBy} />
        <List tags={tags} orderBy={orderBy} />
      </Container>
    </div>
  );
}

function Quote() {
  return (
    <div>
      {/* <Typography variant="h5" align="center" color="textPrimary" gutterBottom>
        The way in which knowledge progresses is by tentative solutions to our
        problems, by conjectures
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary">
        Karl Popper
      </Typography> */}
      <Typography variant="subtitle1" align="center" color="textPrimary">
        All rational thought consists of conjecture and criticism
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary">
        Karl Popper
      </Typography>
    </div>
  );
}
