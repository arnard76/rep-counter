// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgTnpHnz0pZtgnk55QSTwFJm9yME9Z9ng",
  authDomain: "rep-c-a0f04.firebaseapp.com",
  databaseURL: "https://rep-c-a0f04-default-rtdb.firebaseio.com",
  projectId: "rep-c-a0f04",
  storageBucket: "rep-c-a0f04.appspot.com",
  messagingSenderId: "23602277435",
  appId: "1:23602277435:web:232c13d4c0bfeebaf0801e",
  measurementId: "G-D4N7DHR4H1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);

export { app, database };
