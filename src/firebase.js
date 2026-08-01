import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOh7_FxDWffM5Auc0Gu6MTpC4OLYj4KZw",
  authDomain: "onlinechatbot-38ec6.firebaseapp.com",
  projectId: "onlinechatbot-38ec6",
  storageBucket: "onlinechatbot-38ec6.firebasestorage.app",
  messagingSenderId: "864460093862",
  appId: "1:864460093862:web:a587782f53378fd7feb767",
  measurementId: "G-CE0WR4Z4BD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
