import * as firebase from "firebase";

// <script src="https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js"></script>;

const config = {
  apiKey: "AIzaSyCVm2Cyt4KL9YBFH-X-gDmLi6H6OljgmQs",
  authDomain: "creative-conjectures.firebaseapp.com",
  databaseURL: "https://creative-conjectures.firebaseio.com",
  projectId: "creative-conjectures",
  storageBucket: "creative-conjectures.appspot.com",
  messagingSenderId: "85281267738",
  appId: "1:85281267738:web:f29229d43bff27d97bf1a3"
};
firebase.initializeApp(config);
const databaseRef = firebase.database().ref();
export const todosRef = databaseRef.child("todos");
