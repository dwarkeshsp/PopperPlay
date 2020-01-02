import React from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "../firebase";
import { AuthUserContext } from "../session";
import ListHeader from "../util/ListHeader";
import Dialog from "../util/AlertDialog";
import CreateProblem from "../util/CreatePost";
import TagsMenu from "../tags/TagsMenu";
import List from "../util/List";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { fade, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(3)
  },
  heroButtons: {
    marginTop: theme.spacing(2)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }
}));

function Problems(props) {
  const [tags, setTags] = React.useState([]);
  const [orderBy, setOrderBy] = React.useState("created");

  return (
    <div>
      <Quote />
      <ListHeader setTags={setTags} setOrderBy={setOrderBy} problem />
      <Container maxWidth="md">
        <List tags={tags} orderBy={orderBy} problem />
      </Container>
    </div>
  );
}

function Quote() {
  const classes = useStyles();
  return (
    <div className={classes.heroContent}>
      <Typography variant="h5" align="center" color="textPrimary" gutterBottom>
        All life is problem solving
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" paragraph>
        Karl Popper
      </Typography>
    </div>
  );
}

export default withFirebase(Problems);
