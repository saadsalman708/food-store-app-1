import { auth, signOut } from "../../firebase/config.js";
import { kick } from "../../func/kick.js";


const logoutBtn = document.querySelector("#logoutBtn");



await kick({ role: "user" });



logoutBtn.addEventListener("click", async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.log(error.message);
    }
});