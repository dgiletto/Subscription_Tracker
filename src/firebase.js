import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoJG5BfvHmQbswnli13G4DsmBJ020R2g0",
  authDomain: "trakr-efefe.firebaseapp.com",
  projectId: "trakr-efefe",
  appId: "1:565739046632:web:1765f5fc03d2713c7dab5d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);