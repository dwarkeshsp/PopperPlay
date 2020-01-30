import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { withFirebase } from "../firebase";

function ProblemsMenu(props) {
  function allProblems() {
    let options = [];
    props.firebase
      .problems()
      .get()
      .then(
        querySnapshot =>
          (options = querySnapshot.forEach(doc =>
            options.push({ title: doc.data().title, id: doc.id })
          ))
      )
      .catch(error => console.log(error));
    return options;
  }

  return (
    <div>
      <Autocomplete
        id="problems"
        multiple
        options={allProblems()}
        getOptionLabel={option => option.title}
        renderInput={params => (
          <TextField
            {...params}
            variant={props.variant === "outlined" ? "outlined" : "standard"}
            label="Problems Getting Solved"
            margin="dense"
            fullWidth
          />
        )}
        onChange={(event, value) =>
          props.setValue(value.map(problem => problem.id))
        }
      />
    </div>
  );
}

export default withFirebase(ProblemsMenu);
