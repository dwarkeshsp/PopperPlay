import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import BuildIcon from "@material-ui/icons/Build";
import React from "react";
import BottomScrollListener from "react-bottom-scroll-listener";
import { Link } from "react-router-dom";
import { withFirebase } from "../firebase";
import Markdown from "../util/Markdown";
import ItemInfo from "./ItemInfo";
import VoteButton from "./VoteButton";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

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
      console.log("just order");
      firebase
        .query(orderBy, LOADSIZE, problem)
        .then(querySnapshot => {
          const data = updateData(querySnapshot);
          setItems(data);
        })
        .catch(error => console.log(error));
    } else {
      console.log("both");
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
        <ItemCard item={item} problem={problem} />
      ))}
      <BottomScrollListener onBottom={lazyLoad} />
      <Grid container justify="center" className={classes.loading}>
        <CircularProgress />
      </Grid>
    </div>
  );
}

function ItemCard({ item, problem }) {
  const classes = useStyles();

  function title() {
    const TITLELENGTH = 250;

    let title = item.title.substr(0, TITLELENGTH);
    if (item.title.substr(TITLELENGTH)) {
      title += "...";
    }
    title = title.replace(/(\r\n|\n|\r)/gm, "");
    return title;
  }

  function details() {
    const DETAILLENGTH = 400;

    let details = item.details.substr(0, DETAILLENGTH);
    if (item.details.substr(DETAILLENGTH)) {
      details += "...";
    }
    details = details.replace(/(\r\n|\n|\r)/gm, "");
    return details;
  }

  return (
    <div>
      <Link
        to={
          problem
            ? {
                pathname: "/problem/" + item.id
              }
            : {
                pathname: "/conjecture/" + item.problem.id + "/" + item.id
              }
        }
        style={{ textDecoration: "none" }}
      >
        <div>
          <CardActionArea component="a" href="#">
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  {/* {!problem && (
                    <Link
                      to={"/problem/" + item.problem.id}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        component="h2"
                        variant="subtitle1"
                        color="textSecondary"
                      >
                        {title()}
                      </Typography>
                    </Link>
                  )} */}
                  <Typography component="h2" variant="h6">
                    {title()}
                  </Typography>
                  <ItemInfo item={item} />
                  <Markdown className={classes.markdown}>{details()}</Markdown>
                </CardContent>
              </div>
              <CardActions disableSpacing>
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<BuildIcon />}
                >
                  {problem ? "Solve" : "Improve"}
                </Button>
                <VoteButton item={item} problem={problem} />
              </CardActions>
            </Card>
          </CardActionArea>
        </div>
      </Link>
    </div>
  );
}

export default withFirebase(List);
