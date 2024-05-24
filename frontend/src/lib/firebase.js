import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBTBfETKLWz1Ip4LktYvJL4RQ985nXYSeE",
  authDomain: "au-classroom.firebaseapp.com",
  projectId: "au-classroom",
  storageBucket: "au-classroom.appspot.com",
  messagingSenderId: "785293389162",
  appId: "1:785293389162:web:f4047a1cb819db9bf64913",
  measurementId: "G-1QJC2V8TB5"
};

const app = initializeApp(firebaseConfig);
const db= getFirestore(app);
const auth= getAuth(app)
const provider = new GoogleAuthProvider(); 
const storage = getStorage(app);

export {auth,provider,storage};
export default db;