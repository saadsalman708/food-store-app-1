import { auth, db, doc, getDoc, onAuthStateChanged, } from "../firebase/config.js";


async function kick({ requireAuth = true, role, verify = null, }) {

    return new Promise((resolve) => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
                
            unsubscribe();

            if (!requireAuth && !user) {
                return resolve(user);
                // return;
            }

            if (!requireAuth && user) {
                window.location.replace("../../index.html");
                return resolve(user);
                // return;
            }

            if (!user) {
                window.location.replace("../../index.html");
                return resolve(user);
                // return;
            }

            const snap = await getDoc(doc(db, "users", user.uid));

            if (!snap.exists()) {
                window.location.replace("../../index.html");
                return resolve(user);
                // return;
            }

            const profile = snap.data();

            if (role && role !== profile.role) {
                window.location.replace("../../index.html");
                return resolve(user);
                // return;
            }

            if (verify !== null && verify !== profile.isVerified) {
                window.location.replace("../../index.html");
                return resolve(user);
                // return;
            }

            return resolve(user);
            // return;
        });

    });
}





export { kick, }