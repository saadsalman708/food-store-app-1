import { auth, onAuthStateChanged, getDoc, doc, db } from "../firebase/config.js";


function handleRedirect() {
    
onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
        return;
    }

    const profile = snap.data();

    if (profile.role === "admin") {
        window.location.href = "./admin/admin.html";
        return;
    }

    if (profile.role === "user") {
        window.location.href = "./user/user.html";
        return;
    }

    if (profile.role === "vendor") {
        window.location.href = profile.isVerified
                               ? "./vendor/vendor.html"
                               : "./vendor/waiting.html";
        return;
    }

});

}




export { handleRedirect , }