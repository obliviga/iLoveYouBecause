import * as firebase from 'firebase';

require('firebase/firestore');

const config = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: 'iloveyoubecause66.firebaseapp.com',
  databaseURL: 'https://iloveyoubecause66.firebaseio.com',
  projectId: 'iloveyoubecause66',
  storageBucket: 'iloveyoubecause66.appspot.com',
  messagingSenderId: '922244904980',
};

const settings = { timestampsInSnapshots: true };

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

export { auth };

export const db = firebase.firestore();

db.settings(settings);
