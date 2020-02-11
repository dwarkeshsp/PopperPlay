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
    console.log(id);
    notifyParent(data.parentConjectures, ref);
  });

function notifyParent(itemArray, parentRef) {
  itemArray.forEach(async item => {
    const doc = await item.get();
    data = doc.data();
    console.log(data);
    notify(data.creator, parentRef);
  });
}

async function notify(person, itemRef) {
  console.log(person, itemRef);
  const doc = await db.doc("people/" + person).update({
    newNotifications: 0,
    notifications: 0
  });
}
