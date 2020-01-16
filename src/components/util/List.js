import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import BottomScrollListener from "react-bottom-scroll-listener";
import { withFirebase } from "../firebase";
import Card from "./Card";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  },
  markdown: {
    ...theme.typography.caption
  },
  card: {
    display: "flex"
  },
  cardDetails: {
    flex: 1
  },
  loading: {
    marginTop: "0.5rem"
  }
}));

function List({ firebase, tags, orderBy, problem }) {
  const classes = useStyles();

  const [items, setItems] = React.useState([]);
  const [lastDoc, setLastDoc] = React.useState(null);
  const [filtering, setFiltering] = React.useState(false);

  const LOADSIZE = 10;

  const updateData = querySnapshot => {
    const data = querySnapshot.docs.map(doc => doc.data());
    querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));

    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    return data;
  };

  // acts as component did mount as well
  React.useEffect(() => {
    if (!filtering) {
      firebase
        .query(orderBy, LOADSIZE, problem)
        .then(querySnapshot => {
          const data = updateData(querySnapshot);
          setItems(data);
        })
        .catch(error => console.log(error));
    } else {
      firebase
        .tagsQuery(orderBy, LOADSIZE, tags, problem)
        .then(querySnapshot => {
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
        .tagsQuery(orderBy, LOADSIZE, tags, problem)
        .then(querySnapshot => {
          const data = updateData(querySnapshot);
          setItems(data);
          setFiltering(true);
        })
        .catch(error => console.log(error));
    } else if (filtering) {
      // go back to default view
      firebase
        .query(orderBy, LOADSIZE, problem)
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
        .startAfterQuery(orderBy, LOADSIZE, lastDoc, problem)
        .then(querySnapshot => {
          const data = updateData(querySnapshot);
          setItems(items.concat(data));
        })

        .catch(error => console.log(error));
    }
  }

  return (
    <div>
      {items.map(item => (
        <Card item={item} problem={problem} />
      ))}
      <BottomScrollListener onBottom={lazyLoad} />
      <Grid container justify="center" className={classes.loading}>
        <CircularProgress />
      </Grid>
    </div>
  );
}

export default withFirebase(List);
