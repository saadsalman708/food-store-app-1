import { auth , onAuthStateChanged } from "./firebase/config.js";
import { handleRedirect } from "./func/handleRedirect.js";


handleRedirect();



onAuthStateChanged(auth, user => {
    

        if (user) {
            console.log(user.email);
        } else {
            console.log("No user is signed in.");
        }
});
