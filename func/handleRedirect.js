import { auth, onAuthStateChanged, getDoc, doc, db } from "../firebase/config.js";


function handleRedirect() {
    console.log(11);
    
    onAuthStateChanged(auth, async (user) => {
        console.log(12);
        console.log(user);
        
        
        if (!user) return;
        console.log(13);
        
        const snap = await getDoc(doc(db, "users", user.uid));
        
        if (!snap.exists()) {
            console.log(14);
            return;
        }
        
        console.log(15);
        const profile = snap.data();
        
        if (profile.role === "admin") {
            console.log(16);
            window.location.href = "./pages/admin/admin.html";
            return;
        }
        console.log(17);
        
        if (profile.role === "user") {
            console.log(18);
            window.location.href = "./pages/user/user.html";
            return;
        }
        console.log(19);
        
        if (profile.role === "vendor") {
            console.log(20);
            window.location.href = profile.isVerified === true
            ? "./pages/vendor/vendor.html"
            : "./pages/vendor/waiting.html";
            return;
        }
        console.log(21);
        
    });
    
    console.log(22);
}





export { handleRedirect, }