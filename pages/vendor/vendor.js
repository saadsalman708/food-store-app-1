import { 
    auth , db, 
    signOut , 
    getDocs, getDoc, addDoc, deleteDoc, collection, serverTimestamp, 
    doc, 
 } from "../../firebase/config.js";

import { kick } from "../../func/kick.js";




const productName = document.querySelector("#productName");
const addProductBtn = document.querySelector("#addProductBtn");
const logoutBtn = document.querySelector("#logoutBtn");





await kick({ role: "vendor" , verify: true });





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





addProductBtn.addEventListener("click", async () => {

    const productNameVal = productName.value.trim();    

    if (!productNameVal) {
        Swal.fire({
            title: 'Please enter a product name!',
            text: 'Product name cannot be empty.',
            icon: 'error',
        });
        return;
    }

    
    await addDoc(collection( db , "products" ) , {
        vendorUid: auth.currentUser.uid,
        productName: productNameVal,
        createdAt: serverTimestamp(),
    });

    productName.value = "";
    loadProducts();

});





async function getProducts() {

    const productsSnap = await getDocs(collection( db , "products" ));
    
    if (productsSnap.empty) {
        productsDiv.innerHTML = `<p>No products available.</p>`;
        return;
    }

    const productsList = [];

    productsSnap.forEach(productsData => {
        const product = productsData.data();

        if (auth.currentUser.uid === product.vendorUid) {
            
            const obj = {
                vendorUid: product.vendorUid,
                productName: product.productName,
                productId: productsData.id,
                createdAt: product.createdAt,
            };
            productsList.push(obj);
        }        

    });
    
    return productsList;
}





async function loadProducts() {
    productsDiv.innerHTML = `<p>Loading products...</p>`;

    const productsList = await getProducts();

    if (!productsList || productsList.length === 0) {
        productsDiv.innerHTML = `<p>No products available.</p>`;
        return;
    }

    productsDiv.innerHTML = ``;
    const ul = document.createElement("ul");

    productsList.forEach((product)=>{
        
        const li = document.createElement("li");
        const del = document.createElement("button");
        const edit = document.createElement("button");
        del.innerText = "Delete";
        edit.innerText = "Edit";
        del.onclick = ()=> deleteProduct(product.productId);
        edit.onclick = ()=> editProduct(product.productId);
        li.innerHTML = `
            <div>Product Name: ${product.productName}</div>
            <!-- <div>Vendor ID: ${product.vendorUid}</div> -->
            <div>Product ID: ${product.productId}</div>
            <div>Created At: ${product.createdAt}</div>
        `;
        li.appendChild(del);
        li.appendChild(edit);
        ul.appendChild(li);
    });
    productsDiv.appendChild(ul);
    
}





const editProduct = async (productId) => {
    
    const productNameVal = prompt("Enter new product name:");

    if (!productNameVal) return;

    await updateDoc(doc( db , "products" , productId), {
        productName: productNameVal,
    } , { merge: true });

    loadProducts();
}

const deleteProduct = async (productId) => {
    await deleteDoc(doc( db , "products" , productId));
    loadProducts();
}





loadProducts();