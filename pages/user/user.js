import { auth, signOut } from "../../firebase/config.js";
import { kick } from "../../func/kick.js";





const logoutBtn = document.querySelector("#logoutBtn");





await kick({ role: "user" });





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