import {
    auth, db, googleProvider,
    createUserWithEmailAndPassword, signInWithPopup,
    doc, setDoc, getDoc, addDoc, collection,
} from "../firebase/config.js";

const fullName = document.querySelector("#fullName");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const btn = document.querySelector("#btn");
const googleBtn = document.querySelector("#googleBtn");





btn.addEventListener("click", async () => {

    const fullNameVal = fullName.value;
    const emailVal = email.value;
    const passwordVal = password.value;

    if (!fullNameVal || !emailVal || !passwordVal) {
        Swal.fire({
            title: "Please fill your details",
            icon: "warning",
        });
        return;
    }

    const role = document.querySelector('input[name="role"]:checked');

    if (!role) {
        Swal.fire({
            title: "Please select your role",
            icon: "warning",
        });
        return;
    };

    const roleVal = role.value;
    let successMsg = "Please Login";

    const data = {
        fullName: fullNameVal,
        email: emailVal,
        role: roleVal,
        createdAt: Date.now(),
    };

    if (roleVal === "vendor") {
        successMsg = "Login and Wait for the admin aproval!";
        data.isVerified = false;
    }

    try {

        const res = await createUserWithEmailAndPassword(auth, emailVal, passwordVal);

        await setDoc(doc(db, users, res.user.uid), data);

        Swal.fire({
            title: "Account Created!",
            text: successMsg,
            icon: "success",
        }).then(() => {
            window.location.href = "../Login/login.html";
        });

    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
        });
    }

});





googleBtn.addEventListener("click", async () => {

    const role = document.querySelector('input[name="role"]:checked');

    if (!role) {
        Swal.fire({
            title: "Please select your role first",
            text: "then you can signup with google",
            icon: "warning",
        });
        return;
    }

    const roleVal = role.value;
    let successMsg = "Please Login";


    try {
        
        const res = await signInWithPopup(auth, googleProvider);

        const data = {
            fullName: res.user.displayName || "",
            email: res.user.email,
            role: roleVal,
            createdAt: Date.now(),
        };

        if (roleVal === "vendor") {
            successMsg = "Login and Wait for admin aproval";
            data.isVerified = false;
        }

        await setDoc(doc(db, "users", res.user.uid), data);


        Swal.fire({
            title: "Account Created!",
            text: successMsg,
            icon: "success",
        }).then(() => {
            window.location.href = "../Login/login.html";
        });

    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
        });
    }
});