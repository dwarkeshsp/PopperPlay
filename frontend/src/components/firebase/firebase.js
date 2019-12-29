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

  // *** Conjecture API ***
  conjecture = conjectureDocID => this.db.doc(`conjectures/${conjectureDocID}`);
  conjectures = () => this.db.collection("conjectures");

  // *** Tag API ***
  tag = tagDocID => this.db.doc(`tags/${tagDocID}`);
  tags = () => this.db.collection("tags");

  // *** Util API ***
  // timestamp = () => this.firestore.FieldValue.serverTimestamp()
}

export default Firebase;
