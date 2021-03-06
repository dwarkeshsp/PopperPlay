import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { withFirebase } from "../firebase";

function TagMenu(props) {
  const [options, setOptions] = React.useState([]);

  function allTags() {
    let options = [];
    props.firebase
      .tags()
      .get()
      .then(
        querySnapshot =>
          (options = querySnapshot.forEach(doc => options.push(doc.id)))
      )
      .catch(error => console.log(error));
    return options;
  }

  return (
    <div>
      <Autocomplete
        id="tags"
        freeSolo
        multiple
        options={options}
        renderInput={params => (
          <TextField
            {...params}
            variant={props.variant === "outlined" ? "outlined" : "standard"}
            label="Tags"
            margin="dense"
            fullWidth
          />
        )}
        onChange={(event, value) =>
          props.setValue(value.map(tag => tag.toLowerCase()))
        }
        onOpen={() => setOptions(allTags())}
        defaultValue={props.defaultValue}
      />
    </div>
  );
}

export default withFirebase(TagMenu);
