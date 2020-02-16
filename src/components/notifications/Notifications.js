import React, { useEffect, useState } from "react";
import CommentsListCard from "../comments/CommentsListCard";
import { withFirebase } from "../firebase";
import { AuthUserContext } from "../session";
import Card from "../util/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

export default function Account() {
  return (
    <div>
      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <NotificationsLoggedIn /> : <NotificationsNotLoggedIn />
        }
      </AuthUserContext.Consumer>
    </div>
  );
}

function NotificationsLoggedInBase({ firebase }) {
  const [notifications, setNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState(0);

  useEffect(() => getNotifications(), []);

  async function getNotifications() {
    async function refData(ref) {
      const type = ref.parent.id.slice(0, -1);
      const doc = await ref.get();
      const data = doc.data();
      data["id"] = doc.id;
      data[type] = true;
      return data;
    }

    const name = firebase.currentPerson().displayName;
    const person = firebase.person(name);
    const doc = await person.get();
    const data = doc.data();
    setNewNotifications(data.newNotifications);
    const notifications = await Promise.all(
      data.notifications.map(ref => refData(ref))
    );
    setNotifications(notifications);
    // reset new notifications
    person.update({ newNotifications: 0 });
  }

  return (
    <div>
      <Container maxWidth="md">
        {notifications.map((notification, index) =>
          notification.comment ? (
            <CommentsListCard
              comment={notification}
              highlight={index < newNotifications}
            />
          ) : (
            <Card item={notification} highlight={index < newNotifications} />
          )
        )}
      </Container>
    </div>
  );
}
function NotificationsNotLoggedIn() {
  return (
    <Grid container justify="center" style={{ marginTop: "2.5rem" }}>
      <CircularProgress />
    </Grid>
  );
}

const NotificationsLoggedIn = withFirebase(NotificationsLoggedInBase);
