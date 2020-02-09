import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import BuildIcon from "@material-ui/icons/Build";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Markdown from "../util/Markdown";
import VoteButton from "./buttons/Vote";
import ItemInfo from "./ItemInfo";
import { TwitterShareButton } from "react-share";
import Fab from "@material-ui/core/Fab";
import TwitterIcon from "@material-ui/icons/Twitter";
import TwitterShare from "./buttons/TwitterShare";
import MetaInfoList from "./MetaInfoList";

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

export default function ItemCard({ item }) {
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
        to={item.problem ? "/problem/" + item.id : "/conjecture/" + item.id}
        style={{ textDecoration: "none" }}
      >
        <div>
          <CardActionArea component="a" href="#">
            <Card className={classes.card} elevation={5}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <MetaInfoList
                    refList={
                      item.problem
                        ? item.parentConjectures
                        : item.parentProblems
                    }
                  />
                  <Typography component="h2" variant="h6">
                    {title()}
                  </Typography>
                  <ItemInfo item={item} />
                  <Markdown className={classes.markdown}>{details()}</Markdown>
                </CardContent>
              </div>
              <CardActions disableSpacing>
                <TwitterShare item={item} />
                <VoteButton item={item} />
              </CardActions>
            </Card>
          </CardActionArea>
        </div>
      </RouterLink>
    </div>
  );
}
