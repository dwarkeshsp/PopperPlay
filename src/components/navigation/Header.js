import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { makeStyles } from "@material-ui/core/styles";
import BuildSharpIcon from "@material-ui/icons/BuildSharp";
import WbIncandescentSharpIcon from "@material-ui/icons/WbIncandescentSharp";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import CommentIcon from "@material-ui/icons/Comment";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: theme.palette.background.default,
    marginTop: "0.25rem"
  }
}));

const RoutedHeader = withRouter(props => <Header {...props} />);

function Header(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(-1);

  // ensures that header value corresponds to path
  React.useEffect(() => {
    const pathArray = props.location.pathname.split("/");
    const firstLevelPath = pathArray[1];
    if (firstLevelPath === "problems") {
      setValue(0);
    } else if (firstLevelPath === "conjectures") {
      setValue(1);
    } else if (firstLevelPath === "comments") {
      setValue(2);
    } else {
      setValue(-1);
    }
  }, [props.location]);

  return (
    <React.Fragment>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction
          label="Problems"
          icon={<BuildSharpIcon />}
          component={Link}
          to="/problems"
        />
        <BottomNavigationAction
          label="Conjectures"
          icon={<WbIncandescentSharpIcon />}
          component={Link}
          to="/conjectures"
        />
        <BottomNavigationAction
          label="Comments"
          icon={<CommentIcon />}
          component={Link}
          to="/comments"
        />
      </BottomNavigation>
    </React.Fragment>
  );
}

export default RoutedHeader;
