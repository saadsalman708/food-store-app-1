import {
    auth, db, onAuthStateChanged, signOut,
    getDoc, doc, updateDoc,
} from "../../firebase/config.js";

import { kick } from "../../func/kick.js";





const logoutBtn = document.getElementById("logoutBtn");
const begBtn = document.getElementById("begBtn");





await kick({ role: "vendor", verify: false });





logoutBtn.addEventListener("click", () => {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You want to logout!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Logout!',
    }).then(async (result) => {
        if (result.isConfirmed) {
            await signOut(auth);
            Swal.fire(
                'Logged Out Successfully!',
                'You have been logged out.',
                'success'
            ).then(() => {
                window.location.replace("../../index.html");
            });
        }
    });
});





begBtn.addEventListener("click", async () => {

    const user = auth.currentUser;
    if (!user) return;

    let updateFinished = false;

    const updatePromise = (async () => {

        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) throw new Error("Profile not found");

        await updateDoc(doc(db, "users", user.uid), {
            isVerified: true,
        });

        updateFinished = true;

    })();

    let timerInterval;
    const totalTime = 60000;

    Swal.fire({
        title: "Begging for Verify",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "Beg faster!",
        timer: totalTime,
        timerProgressBar: true,
        html: `
            <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">

                <div class="swal2-loader" style="display:block;"></div>

                <div style="font-size:15px; opacity:0.8;">
                    Waiting to get Verify...
                </div>

                <!-- <div style="width:100%; max-width:260px;">
                    <div style="height:8px; background:#eee; border-radius:20px; overflow:hidden;">
                        <div id="progressBar" 
                             style="height:100%; width:0%; background:#3085d6; transition:width 1s linear;">
                        </div>
                    </div>
                </div> -->

                <div style="font-size:14px; opacity:0.7;">
                    <span id="percent">0%</span> • 
                    <span id="countdown">60</span>s remaining
                </div>

            </div>
        `,
        backdrop: `
        rgba(0,0,123,0.4)
        url("https://en.meming.world/images/en/thumb/d/d0/Crying_Cat.jpg/300px-Crying_Cat.jpg")
        left top / 36%
        no-repeat`,

        didOpen: () => {

            const startTime = Date.now();

            timerInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const secondsLeft = Math.ceil((totalTime - elapsed) / 1000);
                const progress = (elapsed / totalTime) * 100;

                document.getElementById("percent").textContent = Math.floor(progress) + "%";
                document.getElementById("countdown").textContent = secondsLeft > 0 ? secondsLeft : 0;

                if (elapsed >= totalTime) {
                    clearInterval(timerInterval);
                }

            }, 100);
        },

        preConfirm: () => {
            if (!updateFinished) {
                Swal.showValidationMessage("Still begging... please wait 😭");
                return false;
            }
        },

        willClose: () => {
            clearInterval(timerInterval);
        }

    }).then(async () => {

        await updatePromise;

        Swal.fire({
            title: "Begging Successful!",
            icon: "success",
            text: "Admin has verified your account!",
            backdrop: `
            rgba(0,0,123,0.4)
            url("https://images.steamusercontent.com/ugc/974353111661482849/4706D02264975280AEFACD65BF02F585F978B6B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false")
            left top / 30%
            no-repeat`,
        }).then(() => {
            window.location.href = "../../index.html";
        });

    });

});