import { auth , signOut } from "../../firebase/config.js";
import { kick } from "../../func/kick.js";

const logoutBtn = document.querySelector("#logoutBtn");

await kick({ role: "admin" });
console.log("ok");


logoutBtn.addEventListener("click" , ()=> {
    auth.signOut();
});