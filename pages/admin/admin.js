import { 
    auth, db,
    signOut , 
    getDoc, getDocs , collection, updateDoc, doc ,
 } from "../../firebase/config.js";

import { kick } from "../../func/kick.js";





const logoutBtn = document.querySelector("#logoutBtn");
const vendorsList = document.querySelector("#vendors-list");





await kick({ role: "admin" });






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

    const snap = await getDocs(collection( db , "users"));

    // if (!snap.exists()) return;

    const list = [];

    snap.forEach(profileData => {
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





// const loadVendors = async()=> {
async function loadVendors() {

    vendorsList.innerHTML = ``;
    const vendorsData = await getVendors();    
    const ul = document.createElement("ul");

    vendorsData.forEach((vendor)=>{
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.textContent = vendor.isVerified ? "Unverify" : "Verify";
        // btn.setAttribute('onclick' , "verifyVendor()");
        btn.onclick = ()=> verifyVendor(vendor.uid , vendor.isVerified);
        li.innerHTML = `
            <div>uid: ${vendor.uid}</div>
            <div>Full Name: ${vendor.fullName}</div>
            <div>Email: ${vendor.email}</div>
            <div>Password: ${vendor.password}</div>
            <div>Role: ${vendor.role}</div>
            <div>Verify: ${vendor.isVerified}</div>
            <div>Joinned at: ${vendor.createdAt}</div>
        `;

        li.appendChild(btn);
        ul.appendChild(li);
    });
    vendorsList.appendChild(ul);
}





const verifyVendor = async (uid , verify)=> {
    await updateDoc(doc( db , "users" , uid) , {
        isVerified : !verify
    });
    loadVendors();
}





loadVendors();
