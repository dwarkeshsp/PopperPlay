import React from "react";
import { Link, withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import BuildSharpIcon from "@material-ui/icons/BuildSharp";
import WbIncandescentSharpIcon from "@material-ui/icons/WbIncandescentSharp";
import MenuBookSharpIcon from "@material-ui/icons/MenuBookSharp";
import FeedbackIcon from "@material-ui/icons/Feedback";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    // backgroundColor: "white"
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
    if (firstLevelPath === "conjectures") {
      setValue(0);
    } else if (firstLevelPath === "problems") {
      setValue(1);
    } else if (firstLevelPath === "philosophy") {
      setValue(2);
    } else if (firstLevelPath === "feedback") {
      setValue(3);
    } else {
      setValue(-1);
    }
  }, [value, props.location]);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        label="Conjectures"
        icon={<WbIncandescentSharpIcon />}
        component={Link}
        to="/conjectures"
      />
      <BottomNavigationAction
        label="Problems"
        icon={<BuildSharpIcon />}
        component={Link}
        to="/problems"
      />
      <BottomNavigationAction
        label="Philosophy"
        icon={<MenuBookSharpIcon />}
        component={Link}
        to="/philosophy"
      />
      <BottomNavigationAction
        label="Feedback"
        icon={<FeedbackIcon />}
        component={Link}
        to="/feedback"
      />
    </BottomNavigation>
  );
}

export default RoutedHeader;
