import Firebase from 'firebase';
let config = {
  apiKey: 'AIzaSyDEcRVQC1YcfqeuUOsZaUJHJcBMxEek910',
  authDomain: 'https://eduapp-fec96.firebaseio.com',
  databaseURL: 'https://eduapp-fec96.firebaseio.com',
  projectId: 'eduapp-fec96',
  storageBucket: 'eduapp-fec96.appspot.com',
  messagingSenderId: 'XXXXXXX'
};
let app = Firebase.initializeApp(config);
export const db = app.database();