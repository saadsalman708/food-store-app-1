import {
    auth, db, googleProvider, signInWithEmailAndPassword, signInWithPopup,
    getDoc, doc, setDoc, serverTimestamp,
    onAuthStateChanged,
} from "../../firebase/config.js";

// import { kick } from "../../func/kick.js";

const email = document.querySelector("#email");
const password = document.querySelector("#password");
const btn = document.querySelector("#btn");
const googleBtn = document.querySelector("#googleBtn");



let loadOnce = false;



// await kick({ requireAuth: false, });




onAuthStateChanged(auth, user => {
    
    if (!loadOnce) {
        loadOnce = true;

        if (user) {
            window.location.replace("../../index.html");
        }
    }
});





btn.addEventListener("click", async () => {

    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();

    if (!emailVal || !passwordVal) {
        Swal.fire({
            title: "Please fill your details",
            icon: "warning",
            backdrop: `
            rgba(0,0,123,0.4)
            url("https://images.steamusercontent.com/ugc/974353111661482849/4706D02264975280AEFACD65BF02F585F978B6B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false")
            left top / 30%
            no-repeat`,
        });
        return;
    }

    try {

        await signInWithEmailAndPassword(auth, emailVal, passwordVal);

        Swal.fire({
            title: "Login Successful",
            text: "You are logged in successfully!",
            icon: "success",
            backdrop: `
                rgba(0,0,123,0.4)
                url("https://images.steamusercontent.com/ugc/974353111661482849/4706D02264975280AEFACD65BF02F585F978B6B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false")
                left top / 30%
                no-repeat`,
        }).then(() => {
            window.location.replace("../../index.html");
        });

    } catch (error) {
        Swal.fire({
            title: "Login Failed",
            text: error.message,
            icon: "error",
            backdrop: `
            rgba(0,0,123,0.4)
            url("https://images.steamusercontent.com/ugc/974353111661482849/4706D02264975280AEFACD65BF02F585F978B6B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false")
            left top / 30%
            no-repeat`,
        });
    }
});





googleBtn.addEventListener("click", async () => {
    try {

        await signInWithPopup(auth, googleProvider);
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        let titleMsg = "Login Successful";

        if (!snap.exists()) {
            titleMsg = "Account Created!";

            await setDoc(doc(db, "users", auth.currentUser.uid), {
                fullName: auth.currentUser.displayName || "",
                email: auth.currentUser.email || "",
                role: "user",
                createdAt: serverTimestamp(),
                // createdAt: Date.now(),
            });
        }

        Swal.fire({
            title: titleMsg,
            text: "You are logged in successfully!",
            icon: "success",
            backdrop: `
            rgba(0,0,123,0.4)
            url("https://images.steamusercontent.com/ugc/974353111661482849/4706D02264975280AEFACD65BF02F585F978B6B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false")
            left top / 30%
            no-repeat`,
        }).then(() => {
            window.location.replace("../index.html");
        });

    } catch (error) {

        Swal.fire({
            title: "Login Failed",
            text: error.message,
            icon: "error",
            backdrop: `
            rgba(0,0,123,0.4)
            url("https://images.steamusercontent.com/ugc/974353111661482849/4706D02264975280AEFACD65BF02F585F978B6B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false")
            left top / 30%
            no-repeat`,
        });

    }
});