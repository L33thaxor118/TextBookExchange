import * as firebase from 'firebase';

const auth_config = {
    apiKey: "AIzaSyDccpTJY3I8qBzbajGXF0VqKyRVtuZaJU0",
    authDomain: "textbookexchange-d5876.firebaseapp.com",
    databaseURL: "https://textbookexchange-d5876.firebaseio.com",
    projectId: "textbookexchange",
    storageBucket: "textbookexchange.appspot.com",
    messagingSenderId: "1073406907640"
};

firebase.initializeApp(auth_config);

//const databaseRef = firebase.database().ref();
export const authentication = firebase.auth();
export const storage = firebase.storage();
//export const todosRef = databaseRef.child("todos");
