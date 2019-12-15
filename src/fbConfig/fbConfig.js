import * as firebase from 'firebase';
const config = {
    apiKey: "AIzaSyCslixyl5cqrBLlDwkYWRoMrOL7wvJp2h0",
    authDomain: "kyada-core.firebaseapp.com",
    databaseURL: "https://kyada-core.firebaseio.com",
    projectId: "kyada-core",
    storageBucket: "kyada-core.appspot.com",
    messagingSenderId: "522270408875",
    appId: "1:522270408875:web:be63274ad3f15a3310f7ee",
    measurementId: "G-T10YNHT8P6"
}
const Firebase = firebase.initializeApp(config);
export default Firebase;