var admin = require("firebase-admin");

var serviceAccount = require("/home/dwarkesh/Code/PopperPlay/scripts/popper-play-firebase-adminsdk-hv8g5-6b37062c55.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://popper-play.firebaseio.com"
});

const db = admin.firestore();

async function updateTime(collectionName) {
  const collection = db.collection(collectionName);
  const query = await collection.get();
  query.docs.map(doc => {
    const created = doc.data().created;
    const newTimestamp = new admin.firestore.Timestamp(
      created.seconds + 2572464,
      created.nanoseconds
    );
    collection.doc(doc.id).update({ created: newTimestamp });
  });
}

updateTime("conjectures");
updateTime("problems");

async function updateCommentsTime() {
  const collection = db.collectionGroup("comments");
  const query = await collection.get();
  query.docs.map(doc => {
    const created = doc.data().created;
    const newTimestamp = new admin.firestore.Timestamp(
      created.seconds + 2572464,
      created.nanoseconds
    );
    db.doc(doc.data().path + doc.id).update({ created: newTimestamp });
  });
}

updateCommentsTime();
