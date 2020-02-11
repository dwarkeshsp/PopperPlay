const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.notifyParentOfProblem = functions.firestore
  .document("/problems/{problem}")
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    const id = context.params.problem;
    const ref = db.doc("problems/" + id);
    notifyParent(data.parentConjectures, ref);
  });

exports.notifyParentOfConjecture = functions.firestore
  .document("/conjectures/{conjecture}")
  .onCreate((snapshot, context) => {
    const ref = db.doc("conjectures/" + context.params.problem);
    notifyParent(snapshot.data().parentConjectures, ref);
    notifyParent(snapshot.data().parentProblems, ref);
  });

function notifyParent(itemArray, parentRef) {
  itemArray.forEach(async item => {
    const doc = await item.get();
    data = doc.data();
    notify(data.creator, parentRef);
  });
}

async function notify(person, itemRef) {
  console.log(person, itemRef);
  await db.doc("people/" + person).update({
    newNotifications: admin.firestore.FieldValue.increment(1),
    notifications: admin.firestore.FieldValue.arrayUnion(itemRef)
  });
}
