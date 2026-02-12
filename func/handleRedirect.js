import { auth, db, doc, getDoc, onAuthStateChanged ,  } from "../firebase/config.js";


async function handleRedirect({ LoginRequired = true , role , verify , }) {
    console.log(1);
    
    
    return new Promise((resolve)=> {
        console.log(2);
        
        onAuthStateChanged( auth , async (user) => { 
            console.log(3);
            
            if (!user) return;
            console.log(4);
            
            if (!LoginRequired) {
                console.log(5);
                window.location.href = "../index.html";
                return;
            }
            console.log(6);
            
                const snap = await getDoc(doc(db , "users" , user.uid));
                
                if (!snap.exists()) {
                    console.log(7);
                    window.location.replace("../index.html");
                }
                console.log(8);
                
                const profile = snap.data();
            
            
            if (role && "admin" === profile.role) {
                console.log(9);
                window.location.href = "../admin/admin.html";
                return;
            }
            console.log(10);
            
            if (role && "user" === profile.role) {
                console.log(11);
                window.location.href = "../user/user.html";
                return;
            }
            console.log(12);
            
            if (role && "vendor" === profile.role) {
                console.log(13);
                window.location.href = profile.isVerified
                ? "../vendor/vendor.html" 
                : "../vendor/waiting.html" ;
                return;
            }

            console.log(14);
            
            return resolve(user);
        });
        console.log(15);
        
    });
}




export { handleRedirect , }