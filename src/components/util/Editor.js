import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

export default function Editor({ text, setText }) {
  return (
    <TextField
      id="details"
      label="More"
      placeholder="More"
      fullWidth
      multiline
      rows="5"
      onChange={event => setText(event.target.value)}
    />
  );
}
