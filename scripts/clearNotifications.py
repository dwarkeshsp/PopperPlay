import firebase_admin
import google.cloud
from firebase_admin import credentials, firestore

cred = credentials.Certificate(
    "./popper-play-firebase-adminsdk-hv8g5-daefbe70e6.json")
app = firebase_admin.initialize_app(cred)
store = firestore.client()

people_ref = store.collection('people')
try:
    docs = people_ref.get()
    for doc in docs:
        print('Doc Data:{}'.format(doc.to_dict()))
        print('id: ', doc.id)
        person_ref = people_ref.document(doc.id)
        person_ref.update({
            "newNotifications": 0,
            "notifications": []
        })
except google.cloud.exceptions.NotFound:
    print('Missing data')
