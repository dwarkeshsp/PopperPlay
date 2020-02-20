import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import React from "react";
import { withFirebase } from "../firebase";
import Card from "./Card";
import Button from "@material-ui/core/Button";
import CommentsListCard from "../comments/CommentCard";

function List({ firebase, tags, orderBy, type }) {
  const [items, setItems] = React.useState([]);
  const [lastDoc, setLastDoc] = React.useState(null);
  const [filtering, setFiltering] = React.useState(false);

  const LOADSIZE = 10;

  const updateData = querySnapshot => {
    const data = querySnapshot.docs.map(doc => doc.data());
    querySnapshot.docs.map((doc, index) => {
      data[index]["id"] = doc.id;
      data[index][type] = true;
      if (type === "comment") {
        const conjectureID = data[index].path.split("/")[1];
        data[index].conjectureRef = firebase.conjecture(conjectureID);
      }
    });
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    return data;
  };

  // acts as component did mount as well
  React.useEffect(() => {
    if (!filtering) {
      firebase
        .query(orderBy, LOADSIZE, type)
        .then(querySnapshot => {
          const data = updateData(querySnapshot);
          setItems(data);
        })
        .catch(error => console.log(error));
    } else {
      firebase.tagsQuery(orderBy, LOADSIZE, tags, type).then(querySnapshot => {
        const data = updateData(querySnapshot);
        setItems(data);
        setFiltering(true);
      });
    }
  }, [orderBy]);

  // * currently queries if array contains any of the tags
  React.useEffect(() => {
    if (tags.length) {
      firebase
        .tagsQuery(orderBy, LOADSIZE, tags, type)
        .then(querySnapshot => {
          const data = updateData(querySnapshot);
          setItems(data);
          setFiltering(true);
        })
        .catch(error => console.log(error));
    } else if (filtering) {
      // go back to default view
      firebase
        .query(orderBy, LOADSIZE, type)
        .then(querySnapshot => {
          const data = updateData(querySnapshot);
          setItems(data);
          setFiltering(false);
        })
        .catch(error => console.log(error));
    }
  }, [tags]);

  function lazyLoad() {
    if (lastDoc) {
      firebase
        .startAfterQuery(orderBy, LOADSIZE, lastDoc, type)
        .then(querySnapshot => {
          const data = updateData(querySnapshot);
          setItems(items.concat(data));
        })

        .catch(error => console.log(error));
    }
  }

  return (
    <div>
      {items.map(item =>
        type === "comment" ? (
          <CommentsListCard comment={item} />
        ) : (
          <Card item={item} />
        )
      )}
      {items.length > 0 && (
        <Grid container justify="center" style={{ marginBottom: "2rem" }}>
          <Button color="primary" onClick={lazyLoad}>
            load more
          </Button>
        </Grid>
      )}
      {!items.length && (
        <Grid container justify="center">
          <CircularProgress />
        </Grid>
      )}
    </div>
  );
}

export default withFirebase(List);
