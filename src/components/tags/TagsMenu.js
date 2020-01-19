import React from "react";
import { withFirebase } from "../firebase";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

function TagMenu(props) {
  const [options, setOptions] = React.useState([]);
  const [variant, setVariant] = React.useState(
    props.variant === "outlined" ? "outlined" : "standard"
  );

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
            variant={variant}
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
