import React from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import { withFirebase } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
}));

function ProblemsList({ firebase }) {
  const [problems, setProblems] = React.useState([]);

  //   function initialProblems() {
  //     let data = [];
  //     query.get().then(querySnapshot => {
  //       querySnapshot.forEach(doc => data.push(doc.data()));
  //       return data;
  //     });
  //   }

  React.useEffect(() => {
    firebase
      .problems()
      .orderBy("rank")
      .limit(25)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        console.log(data);
        setProblems(data);
      });
  }, []);

  return (
    <div>
      {problems.map(problem => (
        <ProblemCard problem={problem} />
      ))}
    </div>
  );
}

function ProblemCard({ problem }) {
  const classes = useStyles();

  return (
    <div>
      <List className={classes.root}>
        <ListItem
        //   alignItems="flex-start"
        >
          <ListItemIcon>
            <ThumbUpIcon />
          </ListItemIcon>
          <ListItemText
            primary={problem.title}
            secondary={
              <React.Fragment>
                <div>
                  {problem.tags.map(tag => (
                    <React.Fragment>
                      <Typography
                        component={Link}
                        variant="overline"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {tag}
                      </Typography>
                      <Typography
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {" "}
                      </Typography>
                    </React.Fragment>
                  ))}
                </div>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {problem.user}{" "}
                </Typography>
                {problem.description.substr(0, 400)}
                {"..."}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </List>
    </div>
  );
}

export default withFirebase(ProblemsList);
