import { auth, db, doc, getDoc, onAuthStateChanged, } from "../firebase/config.js";


async function kick({ requireAuth = true, role, verify = null, }) {

    return new Promise((resolve) => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
                
            console.log(user);
            console.log(1);
            unsubscribe();
            
            
            if (!requireAuth && !user) {
                console.log(3);
                return resolve(user);
                // return;
            }
            console.log(4);
            
            if (!requireAuth && user) {
                console.log(5);
                window.location.replace("../../index.html");
                return resolve(user);
                // return;
            }
            console.log(6);
            
            if (!user) {
                console.log(7);
                window.location.replace("../../index.html");
                return resolve(user);
                // return;
            }
            console.log(8);
            
            const snap = await getDoc(doc(db, "users", user.uid));
            
            if (!snap.exists()) {
                console.log(9);
                window.location.replace("../../index.html");
                return resolve(user);
                // return;
            }
            
            console.log(10);
            const profile = snap.data();            
            
            if (role && role !== profile.role) {
                console.log(11);
                window.location.replace("../../index.html");
                return resolve(user);
                // return;
            }
            console.log(12);
            
            if (verify !== null && verify !== profile.isVerified) {
                console.log(13);
                window.location.replace("../../index.html");
                return resolve(user);
                // return;
            }
            console.log(14);

            return resolve(user);
            // return;
        });

    });
}





export { kick, }