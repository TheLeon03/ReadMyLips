// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBTji8n0LeHNIR6gb4X5ar3dZftxap1Y9k",
    authDomain: "readmylips-d5848.firebaseapp.com",
    projectId: "readmylips-d5848",
    storageBucket: "readmylips-d5848.appspot.com",
    messagingSenderId: "894658181916",
    appId: "1:894658181916:web:78537a83f4806fbfa798d9",
    measurementId: "G-S2ZEZMZD05"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);