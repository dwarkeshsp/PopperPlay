import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import BottomScrollListener from "react-bottom-scroll-listener";
import { Link } from "react-router-dom";
import { withFirebase } from "../firebase";
import ItemInfo from "../util/ItemInfo";
import Markdown from "../util/Markdown";
import VoteButton from "../util/VoteButton";

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
    ...theme.typography.body1
  },
  card: {
    display: "flex"
  },
  cardDetails: {
    flex: 1
  }
}));

function CommentsList({ problem, firebase }) {
  const [conjectures, setConjectures] = React.useState([]);
  const [lastConjecture, setLastConjecture] = React.useState(null);
  const problemID = problem.id;

  const LOADSIZE = 5;
  const orderBy = "votes";

  React.useEffect(() => {
    firebase
      .problemConjectures(problemID)
      .orderBy("votes", "desc")
      .limit(LOADSIZE)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        console.log(data);
        querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
        setLastConjecture(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setConjectures(data);
      });
  }, []);

  function lazyLoad() {
    if (lastConjecture) {
      firebase
        .startAfterQuery(orderBy, LOADSIZE, lastConjecture)
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(doc => doc.data());
          querySnapshot.docs.map((doc, index) => (data[index].id = doc.id));
          setLastConjecture(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setConjectures(conjectures.concat(data));
        })
        .catch(error => console.log(error));
    }
  }

  return (
    <div>
      {conjectures.map(conjecture => (
        <ConjectureCard conjecture={conjecture} problemID={problemID} />
      ))}
      <BottomScrollListener onBottom={lazyLoad} />
    </div>
  );
}

function ConjectureCard({ conjecture, problemID }) {
  const classes = useStyles();

  function details() {
    const DETAILLENGTH = 400;

    let details = conjecture.details.substr(0, DETAILLENGTH);
    if (conjecture.details.substr(DETAILLENGTH)) {
      details += "...";
    }
    return details;
  }

  return (
    <div>
      <Link
        to={{
          pathname: "/conjecture/" + problemID + "/" + conjecture.id
          // state: { conjecture: conjecture }
        }}
        style={{ textDecoration: "none" }}
      >
        <div>
          <CardActionArea component="a" href="#">
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <ItemInfo item={conjecture} />
                  <Markdown className={classes.markdown}>{details()}</Markdown>
                </CardContent>
              </div>
              <CardActions disableSpacing>
                <VoteButton item={conjecture} />
              </CardActions>
            </Card>
          </CardActionArea>
        </div>
      </Link>
    </div>
  );
}

export default withFirebase(CommentsList);
