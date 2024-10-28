// DB 파이어베이스설정//
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCoTdQtuAwJ5FVMMj1WXxeyTsB6565c_5Q",
  authDomain: "mytodolist-app-aa9c6.firebaseapp.com",
  projectId: "mytodolist-app-aa9c6",
  storageBucket: "mytodolist-app-aa9c6.appspot.com",
  messagingSenderId: "765277374961",
  appId: "1:765277374961:web:64d1a9c5d8de3fd50e9c50",
  measurementId: "G-3MHNM59E2D",
};

// Initialize Firebase

export const firebaseApp = initializeApp(firebaseConfig);
