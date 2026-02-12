import {
    auth, db, googleProvider,
    createUserWithEmailAndPassword, signInWithPopup,
    doc, setDoc, getDoc, serverTimestamp,
    onAuthStateChanged,
} from "../../firebase/config.js";
// import { kick } from "../../func/kick.js";

const fullName = document.querySelector("#fullName");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const btn = document.querySelector("#btn");
const googleBtn = document.querySelector("#googleBtn");



let loadOnce = false;





// await kick({ requireAuth: false, });





onAuthStateChanged( auth , user => {

    if (!loadOnce) {
        loadOnce = true;
        if (user) {
            window.location.replace("../../index.html");
        }
    }
})





btn.addEventListener("click", async () => {

    const fullNameVal = fullName.value.trim();
    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();

    if (!fullNameVal || !emailVal || !passwordVal) {
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

    const role = document.querySelector('input[name="role"]:checked');

    if (!role) {
        Swal.fire({
            title: "Please select your role",
            icon: "warning",
            backdrop: `
            rgba(0,0,123,0.4)
            url("https://images.steamusercontent.com/ugc/974353111661482849/4706D02264975280AEFACD65BF02F585F978B6B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false")
            left top / 30%
            no-repeat`,
        });
        return;
    };

    const roleVal = role.value;
    let successMsg = "";

    const data = {
        fullName: fullNameVal,
        email: emailVal,
        password: passwordVal,
        role: roleVal,
        createdAt: serverTimestamp(),
    };

    if (roleVal === "vendor") {
        successMsg = "Login and Wait for the admin aproval!";
        data.isVerified = false;
    }

    try {

        const res = await createUserWithEmailAndPassword(auth, emailVal, passwordVal);

        await setDoc(doc(db, "users", res.user.uid), data);

        Swal.fire({
            title: "Account Created!",
            text: successMsg,
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
            title: "Signup Failed",
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

    let successMsg = "";
    let iconMsg = "success";
    let pageRedirect = "../pages/user/user.html";

    try {

        const res = await signInWithPopup(auth, googleProvider);
        const uid = res.user.uid;
        const snap = await getDoc(doc(db, "users", uid));

        if (snap.exists()) {
            const profile = snap.data();
            successMsg = "Account already exists!";

            // if (profile.role === "admin") {
            //     pageRedirect = "../pages/admin/admin.html";
            // }

            if (profile.role === "vendor") {
                // pageRedirect = profile.isVerified
                //     ? "../pages/vendor/vendor.html"
                //     : "../pages/vendor/waiting.html";

                successMsg = !profile.isVerified
                    ? "Admin haven't aproved yet!"
                    : "";

                iconMsg = !profile.isVerified
                    ? "warning"
                    : "success";
            }

            Swal.fire({
                title: "Login Successful",
                text: successMsg,
                icon: iconMsg,
                backdrop: `
            rgba(0,0,123,0.4)
            url("https://images.steamusercontent.com/ugc/974353111661482849/4706D02264975280AEFACD65BF02F585F978B6B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false")
            left top / 30%
            no-repeat`,
            }).then(() => {
                // window.location.replace(pageRedirect);
                window.location.replace("../../index.html");
            });

            return;
        }

        const role = document.querySelector('input[name="role"]:checked');

        if (!role) {
            Swal.fire({
                title: "Please select your role first",
                text: "then you can signup with google",
                icon: "warning",
                backdrop: `
            rgba(0,0,123,0.4)
            url("https://images.steamusercontent.com/ugc/974353111661482849/4706D02264975280AEFACD65BF02F585F978B6B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false")
            left top / 30%
            no-repeat`,
            });
            return;
        }

        const roleVal = role.value;

        const data = {
            fullName: res.user.displayName || "",
            email: res.user.email,
            role: roleVal,
            createdAt: serverTimestamp(),
        };

        if (roleVal === "vendor") {
            successMsg = "Login and Wait for admin aproval";
            // pageRedirect = "../pages/vendor/waiting.html";
            data.isVerified = false;
        }

        await setDoc(doc(db, "users", uid), data);

        Swal.fire({
            title: "Account Created!",
            text: successMsg,
            icon: iconMsg,
            backdrop: `
            rgba(0,0,123,0.4)
            url("https://images.steamusercontent.com/ugc/974353111661482849/4706D02264975280AEFACD65BF02F585F978B6B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false")
            left top / 30%
            no-repeat`,
        }).then(() => {
            // window.location.replace(pageRedirect);
            window.location.replace("../../index.html");
        });

    } catch (error) {
        Swal.fire({
            title: "Signup Failed",
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