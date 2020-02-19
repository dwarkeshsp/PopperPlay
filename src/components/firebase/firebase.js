import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
import app from "firebase/app";

// import { config } from "./config";
import { testConfig as config } from "./config";

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
    this.analytics = app.analytics();
    this.firestore = app.firestore;
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
    this.twitterProvider = new app.auth.TwitterAuthProvider();
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
        this.person(authUser.displayName)
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
  currentPerson = () => this.auth.currentUser;
  PersonInfo = () => this.auth.UserInfo;
  person = username => this.db.doc(`people/${username}`);
  people = () => this.db.collection("people");

  // *** Problem API ***
  problem = problemID => this.db.doc(`problems/${problemID}`);
  problems = () => this.db.collection("problems");
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
  conjecture = conjectureID => this.db.doc("/conjectures/" + conjectureID);
  conjectures = () => this.db.collection("conjectures");

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

  // *** Comments API ***
  comment = (conjectureID, commentID) =>
    this.db.doc("/conjectures/" + conjectureID + "/comments/" + commentID);
  comments = () => this.db.collectionGroup("comments");

  // *** Query API ***
  query = (orderBy, LOADSIZE, type) => {
    let collection;
    if (type === "problem") collection = this.problems();
    if (type === "conjecture") collection = this.conjectures();
    if (type === "comment") collection = this.comments();
    return collection
      .orderBy(orderBy, "desc")
      .limit(LOADSIZE)
      .get();
  };
  tagsQuery = (orderBy, LOADSIZE, tags, type) => {
    let collection;
    if (type === "problem") collection = this.problems();
    if (type === "conjecture") collection = this.conjectures();
    if (type === "comment") collection = this.comments();
    return collection
      .where("tags", "array-contains-any", tags)
      .orderBy(orderBy, "desc")
      .limit(LOADSIZE)
      .get();
  };
  startAfterQuery = (orderBy, LOADSIZE, lastDoc, type) => {
    let collection;
    if (type === "problem") collection = this.problems();
    if (type === "conjecture") collection = this.conjectures();
    if (type === "comment") collection = this.comments();
    return collection
      .orderBy(orderBy, "desc")
      .startAfter(lastDoc)
      .limit(LOADSIZE)
      .get();
  };

  // *** Tag API ***
  tag = tagID => this.db.doc(`tags/${tagID}`);
  tags = () => this.db.collection("tags");

  collection = path => this.db.collection(path);
  commentStartAfterQuery = (orderBy, LOADSIZE, lastDoc, path) =>
    this.collection(path)
      .orderBy(orderBy, "desc")
      .startAfter(lastDoc)
      .limit(LOADSIZE)
      .get();

  // *** FieldValue API ***
  arrayUnion = item => this.firestore.FieldValue.arrayUnion(item);
  timestamp = () => this.firestore.FieldValue.serverTimestamp();
}

export default Firebase;
