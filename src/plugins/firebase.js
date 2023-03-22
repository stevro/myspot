// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";

import {getAnalytics} from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_PROJECT_ID + ".firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_PROJECT_ID + ".appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSEGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const initFirebase = (Vue) => {
    // Initialize Firebase
    const firebase = initializeApp(firebaseConfig)
    const analytics = getAnalytics(firebase);
    const firestore = getFirestore(firebase);
    Vue.provide('firebase', firebase)
    Vue.provide('firestore', firestore)
};
