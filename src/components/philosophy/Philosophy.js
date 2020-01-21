import React from "react";
import DocPath from "./Philosophy.md";
import Markdown from "../util/Markdown";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "1rem",
    marginBottom: "3rem"
  },
  markdown: {
    ...theme.typography
  }
}));

export default function Philosophy() {
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    fetch(DocPath)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setText(text);
      });
  }, []);

  const classes = useStyles();

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Markdown className={classes.markdown}>{text}</Markdown>
    </Container>
  );
}
