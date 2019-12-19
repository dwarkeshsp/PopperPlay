import app from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyCVm2Cyt4KL9YBFH-X-gDmLi6H6OljgmQs",
  authDomain: "creative-conjectures.firebaseapp.com",
  databaseURL: "https://creative-conjectures.firebaseio.com",
  projectId: "creative-conjectures",
  storageBucket: "creative-conjectures.appspot.com",
  messagingSenderId: "85281267738",
  appId: "1:85281267738:web:f29229d43bff27d97bf1a3"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }
  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
}
export default Firebase;
