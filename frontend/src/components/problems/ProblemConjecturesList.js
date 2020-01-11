import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
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
    ...theme.typography.caption
  },
  card: {
    display: "flex"
  },
  cardDetails: {
    flex: 1
  }
}));

function ProblemConjecturesList({ problemID, firebase }) {
  const [conjectures, setConjectures] = React.useState([]);
  const [lastConjecture, setLastConjecture] = React.useState(null);

  React.useEffect(() => {
    firebase
      .problemConjectures(problemID)
      .orderBy("votes", "desc")
      .limit(10)
      .get()
      .then(querySnapshot => {
        const conjectures = querySnapshot.docs.map(doc => doc.data());
        querySnapshot.docs.map(
          (doc, index) => (conjectures[index].id = doc.id)
        );
        setLastConjecture(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setConjectures(conjectures);
        console.log(conjectures);
      });
  }, []);

  function lazyLoad() {}

  return (
    <div>
      {conjectures.map(conjecture => (
        <ConjectureCard conjecture={conjecture} />
      ))}
    </div>
  );
}

function ConjectureCard({ conjecture }) {
  const classes = useStyles();

  function title() {
    const TITLELENGTH = 250;

    let title = conjecture.title.substr(0, TITLELENGTH);
    if (conjecture.title.substr(TITLELENGTH)) {
      title += "...";
    }
    return title;
  }

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
          pathname: "/conjecture/" + conjecture.id,
          state: { conjecture: conjecture }
        }}
        style={{ textDecoration: "none" }}
      >
        <div>
          <CardActionArea component="a" href="#">
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <Typography component="h2" variant="h6">
                    {title()}
                  </Typography>
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

export default withFirebase(ProblemConjecturesList);
