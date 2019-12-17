import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ChatBubbleOutlineSharpIcon from "@material-ui/icons/ChatBubbleOutlineSharp";
import BuildSharpIcon from "@material-ui/icons/BuildSharp";
import WbIncandescentSharpIcon from "@material-ui/icons/WbIncandescentSharp";
import MenuBookSharpIcon from "@material-ui/icons/MenuBookSharp";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
  }
});

export default function SimpleBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

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
      />
      <BottomNavigationAction label="Problems" icon={<BuildSharpIcon />} />
      <BottomNavigationAction label="Philosophy" icon={<MenuBookSharpIcon />} />
      <BottomNavigationAction
        label="Feedback"
        icon={<ChatBubbleOutlineSharpIcon />}
      />
    </BottomNavigation>
  );
}
