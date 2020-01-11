import Container from "@material-ui/core/Container";
import React from "react";
import List from "../util/List";
import ListHeader from "../util/ListHeader";

export default function Blog() {
  const [tags, setTags] = React.useState([]);
  const [orderBy, setOrderBy] = React.useState("created");

  return (
    <div>
      <ListHeader setTags={setTags} setOrderBy={setOrderBy} />
      <Container maxWidth="md">
        <List tags={tags} orderBy={orderBy} />
      </Container>
    </div>
  );
}
