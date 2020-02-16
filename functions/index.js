const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

async function notify(person, itemRef) {
  console.log(person, itemRef);
  await db.doc("people/" + person).update({
    newNotifications: admin.firestore.FieldValue.increment(1),
    notifications: admin.firestore.FieldValue.arrayUnion(itemRef)
  });
}

function notifyParent(parentRefArray, childRef, childCreator) {
  parentRefArray.forEach(async item => {
    const doc = await item.get();
    data = doc.data();
    // if (childCreator !== data.creator) {
    notify(data.creator, childRef);
    // }
    console.log("parent data", data);
  });
}

function genericComment(snapshot, context) {
  const data = snapshot.data();
  path = data.path;
  // - "/comments"
  const parentPath = path.substring(0, data.path.length - 9);
  console.log("parentPath: " + parentPath);
  const parentRef = db.doc(parentPath);
  const id = context.params.comment;
  const commentPath = path + id;
  console.log("commentPath: " + commentPath);
  const commentRef = db.doc(commentPath);
  notifyParent([parentRef], commentRef, data.creator);
}

exports.notifyParentOfProblem = functions.firestore
  .document("/problems/{problem}")
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    const id = context.params.problem;
    const ref = db.doc("problems/" + id);
    notifyParent(data.parentConjectures, ref, data.creator);
  });

exports.notifyParentOfConjecture = functions.firestore
  .document("/conjectures/{conjecture}")
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    const ref = db.doc("conjectures/" + context.params.conjecture);
    notifyParent(data.parentProblems, ref, data.creator);
  });

exports.notifyParentOfComment = functions.firestore
  .document("/conjectures/{conjecture}/comments/{comment}")
  .onCreate((snapshot, context) => {
    genericComment(snapshot, context);
  });
exports.notifyParentOfComment1 = functions.firestore
  .document("/conjectures/{conjecture}/comments/{comment1}/comments/{comment}")
  .onCreate((snapshot, context) => {
    genericComment(snapshot, context);
  });
exports.notifyParentOfComment2 = functions.firestore
  .document(
    "/conjectures/{conjecture}/comments/{comment2}/comments/{comment1}/comments/{comment}"
  )
  .onCreate((snapshot, context) => {
    genericComment(snapshot, context);
  });
exports.notifyParentOfComment3 = functions.firestore
  .document(
    "/conjectures/{conjecture}/comments/{comment3}/comments/{comment2}/comments/{comment1}/comments/{comment}"
  )
  .onCreate((snapshot, context) => {
    genericComment(snapshot, context);
  });
exports.notifyParentOfComment4 = functions.firestore
  .document(
    "/conjectures/{conjecture}/comments/{comment4}/comments/{comment3}/comments/{comment2}/comments/{comment1}/comments/{comment}"
  )
  .onCreate((snapshot, context) => {
    genericComment(snapshot, context);
  });
exports.notifyParentOfComment5 = functions.firestore
  .document(
    "/conjectures/{conjecture}/comments/{comment5}/comments/{comment4}/comments/{comment3}/comments/{comment2}/comments/{comment1}/comments/{comment}"
  )
  .onCreate((snapshot, context) => {
    genericComment(snapshot, context);
  });
exports.notifyParentOfComment6 = functions.firestore
  .document(
    "/conjectures/{conjecture}/comments/{comment6}/comments/{comment5}/comments/{comment4}/comments/{comment3}/comments/{comment2}/comments/{comment1}/comments/{comment}"
  )
  .onCreate((snapshot, context) => {
    genericComment(snapshot, context);
  });

exports.allnotifications = functions.https.onRequest(async (req, resp) => {
  const query = await db.collection("/problems").get();
  query.forEach(doc => {
    const data = doc.data();
    const id = doc.id;
    const ref = db.doc("problems/" + id);
    notifyParent(data.parentConjectures, ref, data.creator);
  });
  const query_conjecture = await db.collection("/conjectures").get();
  query_conjecture.forEach(doc => {
    const data = doc.data();
    const id = doc.id;
    const ref = db.doc("conjectures/" + id);
    notifyParent(data.parentProblems, ref, data.creator);
  });
});

exports.allcommentnotifications = functions.https.onRequest(
  async (req, resp) => {
    const query = await db.collectionGroup("comments").get();
    query.forEach(doc => {
      const data = doc.data();
      const conjectureID = doc.ref.path.split("/")[1];
      const conjectureRef = db.doc("conjectures/" + conjectureID);
      notifyParent([conjectureRef], doc.ref, data.creator);
    });
  }
);
