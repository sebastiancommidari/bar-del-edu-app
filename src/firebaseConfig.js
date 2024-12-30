// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDNWss22laD_EedVA1f-3dC9aXJL_aIi_Q",
    authDomain: "bar-del-edu.firebaseapp.com",
    projectId: "bar-del-edu",
    storageBucket: "bar-del-edu.firebasestorage.app",
    messagingSenderId: "126024249589",
    appId: "1:126024249589:web:8d43f8c8f1748f21e615bc",
    measurementId: "G-KH0X22ZL8J"
  };
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
