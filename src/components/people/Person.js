import {
  Avatar,
  CircularProgress,
  Container,
  Grid,
  Typography
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import CommentsListCard from "../comments/CommentsListCard";
import { withFirebase } from "../firebase";
import Card from "../util/Card";

function Person({ firebase }) {
  const [person, setPerson] = useState({});

  const location = useLocation();
  const path = location.pathname.split("/");
  const username = path[path.length - 1];

  useEffect(() => {
    firebase
      .person(username)
      .get()
      .then(doc => setPerson(doc.data()));
  }, []);

  console.log(person);
  return (
    <div>
      {person.firstName ? (
        <React.Fragment>
          <Bio person={person} />
          <Posts username={username} />
        </React.Fragment>
      ) : (
        <Loading />
      )}
    </div>
  );
}

function PostsBase({ username, firebase }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getContent() {
      function getItemData(query, type) {
        query.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          data[type] = true;
          tempPosts.push(data);
        });
      }

      const query = ref =>
        ref
          .where("creator", "==", username)
          .orderBy("created", "desc")
          .get();

      const problemsQuery = await query(firebase.problems());
      getItemData(problemsQuery, "problem");
      const conjecturesQuery = await query(firebase.conjectures());
      getItemData(conjecturesQuery, "conjecture");
      const commentsQuery = await query(firebase.comments());
      getItemData(commentsQuery, "comment");
    }

    const tempPosts = [];
    getContent()
      .then(() =>
        tempPosts.sort((a, b) => a.created.seconds < b.created.seconds)
      )
      .then(() => setPosts(tempPosts));
  }, []);

  console.log(posts);
  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      {posts.map(post =>
        post.comment ? (
          <CommentsListCard comment={post} />
        ) : (
          <Card item={post} />
        )
      )}
    </Container>
  );
}

const Bio = ({ person }) => (
  <Container maxWidth="sm" style={{ marginTop: "1rem" }}>
    <Grid container alignItems="center">
      <Grid item sm={2}>
        <Avatar
          src={person.photoURL}
          style={{ width: "5rem", height: "5rem" }}
        />
      </Grid>
      <Grid item sm={10}>
        <Typography variant="h3">
          {person.firstName + " " + person.lastName}
        </Typography>
        <Typography variant="h5" color="textSecondary">
          {"@" + person.username}
        </Typography>
      </Grid>
    </Grid>
    <Typography variant="h5">{person.bio}</Typography>
  </Container>
);

const Loading = () => (
  <Grid container justify="center" style={{ marginTop: "2.5rem" }}>
    <CircularProgress />
  </Grid>
);

const Posts = withFirebase(PostsBase);

export default withFirebase(Person);
