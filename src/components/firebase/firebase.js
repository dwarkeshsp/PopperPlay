import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import config from "./config";

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
  }
  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** Persistence API ***

  setPersistence = persistence => this.auth.setPersistence(persistence);
  SESSION = app.auth.Auth.Persistence.SESSION;
  LOCAL = app.auth.Auth.Persistence.LOCAL;

  // *** User API ***
  currentUser = () => this.auth.currentUser;
  UserInfo = () => this.auth.UserInfo;
  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref("users");
}

export default Firebase;
