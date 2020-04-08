const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.writeUrl = functions.storage.object().onFinalize((Object) => {
    const bucketName = 'test-f1611.appspot.com';
    const filePath = object.name;
    const name = filePath.split('.').shift();
    const db = admin.firestore();
    db.collection('people').add({
        name: name,
        url:'https://firebasestorage.googleapis.com/vO/b/${buketName}/o/${encodeURIComponent(filePath)}?alt=media',
        }).then(() => console.log('Done'));
    });