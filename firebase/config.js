  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

  import { getAuth , onAuthStateChanged , 
            createUserWithEmailAndPassword , signInWithEmailAndPassword , 
            GoogleAuthProvider , signInWithPopup , signOut , 
   } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

  import { getFirestore , doc , setDoc , getDoc , getDocs , addDoc , collection, 
           serverTimestamp , updateDoc , deleteDoc , 
  } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDgKBWznaYfeUY8TF1_imCSMNM4Qfcm5Ag",
    authDomain: "food-store-1-82e03.firebaseapp.com",
    projectId: "food-store-1-82e03",
    storageBucket: "food-store-1-82e03.firebasestorage.app",
    messagingSenderId: "869575917057",
    appId: "1:869575917057:web:89daf12fec105f46504a00"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const googleProvider = new GoogleAuthProvider(app);


export { auth , db , googleProvider , 
         onAuthStateChanged , createUserWithEmailAndPassword , signInWithEmailAndPassword , 
         signInWithPopup , signOut ,  
         doc , setDoc , getDoc , getDocs , addDoc , collection , serverTimestamp , updateDoc , deleteDoc ,
};