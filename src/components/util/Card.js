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
import { Link as RouterLink } from "react-router-dom";
import { withFirebase } from "../firebase";
import Markdown from "../util/Markdown";
import Link from "@material-ui/core/Link";
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
    display: "flex",
    marginBottom: "1rem"
  },
  cardDetails: {
    flex: 1
  },
  loading: {
    // marginTop: "0.5rem"
  }
}));

export default function ItemCard({ item, problem, noProblemInfo, noDetails }) {
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
      <RouterLink
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
                  {!problem && !noProblemInfo && (
                    <Link
                      component="h3"
                      variant="subtitle1"
                      color="textSecondary"
                    >
                      {item.problem.title}
                    </Link>
                  )}
                  <Typography component="h2" variant="h6">
                    {title()}
                  </Typography>
                  <ItemInfo item={item} />
                  {!noDetails && (
                    <Markdown className={classes.markdown}>
                      {details()}
                    </Markdown>
                  )}
                </CardContent>
              </div>
              {!noDetails && (
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
              )}
            </Card>
          </CardActionArea>
        </div>
      </RouterLink>
    </div>
  );
}