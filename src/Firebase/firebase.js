import app from 'firebase/app';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyDccpTJY3I8qBzbajGXF0VqKyRVtuZaJU0",
    authDomain: "textbookexchange-d5876.firebaseapp.com",
    databaseURL: "https://textbookexchange-d5876.firebaseio.com",
    projectId: "textbookexchange",
    storageBucket: "textbookexchange.appspot.com",
    messagingSenderId: "1073406907640"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
}

export default Firebase;
