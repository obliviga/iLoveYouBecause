import { db } from './firebase';

export const doCreateUser = (id, username, email) => (
  db.ref(`users/${id}`).set({
    username,
    email,
  })
);

export const addLovedOne = (id, lovedOne) => (
  db.ref(`users/${id}/lovedOnes`).push({
    lovedOne,
  })
);

export const getLovedOnes = (id) => (
  db.ref(`users/${id}/lovedOnes`).once('value')
);
