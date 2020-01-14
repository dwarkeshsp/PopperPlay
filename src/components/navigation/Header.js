import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { makeStyles } from "@material-ui/core/styles";
import BuildSharpIcon from "@material-ui/icons/BuildSharp";
import WbIncandescentSharpIcon from "@material-ui/icons/WbIncandescentSharp";
import React from "react";
import { Link, withRouter } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center"
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
    } else {
      setValue(-1);
    }
  }, [props.location]);

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
    </BottomNavigation>
  );
}

export default RoutedHeader;
