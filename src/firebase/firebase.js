import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBXQmJ2Hl52VlrmXub6dxo2tkGSUPiVMJM',
  authDomain: 'iloveyoubecause66.firebaseapp.com',
  databaseURL: 'https://iloveyoubecause66.firebaseio.com',
  projectId: 'iloveyoubecause66',
  storageBucket: 'iloveyoubecause66.appspot.com',
  messagingSenderId: '922244904980',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};
