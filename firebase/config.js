// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, doc, addDoc, getDocs, query, where, updateDoc, onSnapshot,orderBy } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider, signInWithPopup, FacebookAuthProvider
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNvY7E79DUpGwrWH83VwIySSygCbbRfvw",
    authDomain: "make-even-d50ab.firebaseapp.com",
    projectId: "make-even-d50ab",
    storageBucket: "make-even-d50ab.appspot.com",
    messagingSenderId: "77458614773",
    appId: "1:77458614773:web:fd8f84e4742607a82c18bc",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth();
export {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider,

    signOut,
    collection,
    doc,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    onSnapshot,
    orderBy,

    getStorage,
    ref,
    uploadString,
    getDownloadURL,
    deleteObject
};