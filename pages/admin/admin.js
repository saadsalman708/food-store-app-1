import { 
    auth, db,
    signOut , 
    getDoc, collection,
 } from "../../firebase/config.js";

import { kick } from "../../func/kick.js";





const logoutBtn = document.querySelector("#logoutBtn");
const vendorsList = document.querySelector("#vendors-list");





await kick({ role: "admin" });





loadVendors();





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





async function getVendors() {

    const snap = await getDoc(collection( db , "users"));

    // if (!snap.exists()) return;

    const list = [];

    snap.array.forEach(profileData => {
        const profile = profileData.data();

        if ("vendor" === profile.role) {
            const obj = {
                uid: profileData.uid,
                fullName: profile.fullName,
                email: profile.email,
                password: profile.password || "🤫",
                role: profile.role,
                isVerified: profile.isVerified,
                createdAt: profile.createdAt,
            };

            list.push(obj);
        }
    });

    return list;
}





const loadVendors = async()=> {

    vendorsList.innerHTML = ``;
    const vendorsData = await getVendors();    
    const ul = document.createElement("ul");

    vendorsData.forEach((user)=>{
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.textContent = user.isVerified ? "Unverify" : "Verify";
        // btn.setAttribute('onclick' , "verUser()");
        btn.onclick = ()=> verUser(user.uid , user.isVerified);
        li.innerHTML = `
            <div>uid: ${user.uid}</div>
            <div>Full Name: ${user.fullName}</div>
            <div>Email: ${user.email}</div>
            <div>Password: ${user.password}</div>
            <div>Role: ${user.role}</div>
            <div>Verify: ${user.isVerified}</div>
            <div>Joinned at: ${user.createdAt}</div>
        `;

        li.appendChild(btn);
        ul.appendChild(li);
    });
    usersDiv.appendChild(ul);
}