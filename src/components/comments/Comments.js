import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React from "react";
import List from "../util/List";
import ListHeader from "../util/ListHeader";

export default function Conjectures() {
  const [tags, setTags] = React.useState([]);
  const [orderBy, setOrderBy] = React.useState("created");

  return (
    <div>
      <Container maxWidth="md">
        <Quote />
        <ListHeader setTags={setTags} setOrderBy={setOrderBy} type="comment" />
        <List tags={tags} orderBy={orderBy} type="comment" />
      </Container>
    </div>
  );
}

function Quote() {
  return (
    <div>
      <Typography variant="subtitle1" align="center" color="textPrimary">
        Rational criticism compares rival theories with the aim of finding which
        of them offers the best explanations
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary">
        David Deutsch
      </Typography>
    </div>
  );
}
