import "firebase/auth";
import "firebase/firestore";
import app from "firebase/app";

import config from "./config";

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
    this.firestore = app.firestore;
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  doSignInWithTwitter = () => this.auth.signInWithPopup(this.twitterProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: "https://popperplay.com"
    });

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.displayName)
          .get()
          .then(snapshot => {
            const dbUser = snapshot.data();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** Persistence API ***
  setPersistence = persistence => this.auth.setPersistence(persistence);
  SESSION = app.auth.Auth.Persistence.SESSION;
  LOCAL = app.auth.Auth.Persistence.LOCAL;

  // *** User API ***
  currentUser = () => this.auth.currentUser;
  UserInfo = () => this.auth.UserInfo;
  user = username => this.db.doc(`users/${username}`);
  users = () => this.db.collection("users");

  // *** Problem API ***
  problem = problemDocID => this.db.doc(`problems/${problemDocID}`);
  problems = () => this.db.collection("problems");
  problemsQuery = (orderBy, LOADSIZE) =>
    this.problems()
      .orderBy(orderBy, "desc")
      .limit(LOADSIZE)
      .get();
  problemsTagsQuery = (orderBy, LOADSIZE, tags) =>
    this.problems()
      .where("tags", "array-contains-any", tags)
      .orderBy(orderBy, "desc")
      .limit(LOADSIZE)
      .get();
  problemsStartAfterQuery = (orderBy, LOADSIZE, lastDoc) =>
    this.problems()
      .orderBy(orderBy, "desc")
      .startAfter(lastDoc)
      .limit(LOADSIZE)
      .get();

  // *** Conjecture API ***
  conjecture = conjectureDocID => this.db.doc(`conjectures/${conjectureDocID}`);
  conjectures = () => this.db.collection("conjectures");
  conjecturesQuery = (orderBy, LOADSIZE) =>
    this.conjectures()
      .orderBy(orderBy, "desc")
      .limit(LOADSIZE)
      .get();
  conjecturesTagsQuery = (orderBy, LOADSIZE, tags) =>
    this.conjectures()
      .where("tags", "array-contains-any", tags)
      .orderBy(orderBy, "desc")
      .limit(LOADSIZE)
      .get();
  conjecturesStartAfterQuery = (orderBy, LOADSIZE, lastDoc) =>
    this.conjectures()
      .orderBy(orderBy, "desc")
      .startAfter(lastDoc)
      .limit(LOADSIZE)
      .get();

  // *** Query API ***
  query = (orderBy, LOADSIZE, problem) =>
    problem
      ? this.problemsQuery(orderBy, LOADSIZE)
      : this.conjecturesQuery(orderBy, LOADSIZE);
  tagsQuery = (orderBy, LOADSIZE, tags, problem) =>
    problem
      ? this.problemsTagsQuery(orderBy, LOADSIZE, tags)
      : this.conjecturesTagsQuery(orderBy, LOADSIZE, tags);
  startAfterQuery = (orderBy, LOADSIZE, lastDoc, problem) =>
    problem
      ? this.problemsStartAfterQuery(orderBy, LOADSIZE, lastDoc)
      : this.conjecturesStartAfterQuery(orderBy, LOADSIZE, lastDoc);

  // *** Tag API ***
  tag = tagDocID => this.db.doc(`tags/${tagDocID}`);
  tags = () => this.db.collection("tags");

  // *** FieldValue API ***
  arrayUnion = item => this.firestore.FieldValue.arrayUnion(item);
  timestamp = () => this.firestore.FieldValue.serverTimestamp();
}

export default Firebase;
