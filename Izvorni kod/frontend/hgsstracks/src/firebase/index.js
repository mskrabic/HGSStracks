import firebase from 'firebase/app'
import 'firebase/storage'


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCjuZ2L23w5QA3C6giTE3EOP5Y4xGIK77M",
    authDomain: "hgsstracks.firebaseapp.com",
    databaseURL: "https://hgsstracks.firebaseio.com",
    projectId: "hgsstracks",
    storageBucket: "hgsstracks.appspot.com",
    messagingSenderId: "740047292810",
    appId: "1:740047292810:web:4d5f27cf6f0561b1dde073",
    measurementId: "G-9KWJFHJ8EB"
  };

  firebase.initializeApp(firebaseConfig)

  const storage = firebase.storage()

  export {storage, firebase as default}