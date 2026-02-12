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
            window.location.href = "./pages/admin/admin.html";
            return;
        }

        if (profile.role === "user") {
            window.location.href = "./pages/user/user.html";
            return;
        }

        if (profile.role === "vendor") {
            window.location.href = profile.isVerified
                ? "./pages/vendor/vendor.html"
                : "./pages/vendor/waiting.html";
            return;
        }

    });

}





export { handleRedirect, }