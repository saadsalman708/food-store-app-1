import {  
    auth, db, 
    getDocs, collection, 
    signOut, 
} from "../../firebase/config.js";

import { kick } from "../../func/kick.js";





const orderBtn = document.querySelector("#orderBtn");
const cartDiv = document.querySelector("#cartDiv");





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





await kick({ role: "user" });





let cartList = [];
orderBtn.addEventListener("click" , async()=> {
    // localStorage.clear("cartList");



});





async function getSelectedProduct(idNqtyList) {
    const productsSnap = await getDocs(collection( db , "products" ));
    
    if (productsSnap.empty) {        // if no products by vendors then this
        cartDiv.innerHTML = `
        <p>Nothing Available!, Yet</p>
        <a href="./user.html">Add One</a>
        `;
        return;
    }

    let itemNqtyMap = {};
    idNqtyList.forEach(item => {
        itemNqtyMap[item.id] = item.qty;
    });

    let productList = [];

    productsSnap.forEach(product => {
        const data = product.data();

        if (itemNqtyMap[product.id]) {
            const qty = itemNqtyMap[product.id];
            const subtotal = data.price * qty;
            
            const obj = {
                imageUrl: data.imageUrl,
                name: data.name,
                shopName: data.shopName,
                vendorUid: data.vendorUid,
                id: product.id,
                price: data.price,
                qty: qty,
                subtotal: subtotal,
                createdAt: data.createdAt,
            };
            productList.push(obj);
        }
    });
    
    return productList;
}





async function loadSelectedProduct(productsList) {

    cartDiv.innerHTML = `<p>Loading products...</p>`;

    const ul = document.createElement("ul");

    productsList.forEach((product) => {

        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.textContent = "Add to Cart";
        btn.onclick = () => addToCart(product.productId);
        li.innerHTML = `
            <div>${product.imageUrl}</div>
            <div>Product Name: ${product.name}</div>
            <div>Price: ${product.price}</div>
            <div>Quantity: ${product.qty}</div>
            <div>Subtotal: ${product.subtotal}</div>
            <div>Shop Name: ${product.shopName}</div>
            <div>Vendor ID: ${product.vendorUid}</div> 
            <div>Product ID: ${product.id}</div>
            <div>Created At: ${product.createdAt}</div>
        `;
        li.appendChild(btn);
        ul.appendChild(li);
    });
    cartDiv.innerHTML = ``;
    cartDiv.appendChild(ul);
}






async function checkSelected() {

const cartList = JSON.parse(localStorage.getItem("cartList")) || [];

if (cartList[0] === undefined) {    
    cartDiv.innerHTML = `
    <p>Nothing Added, Yet</p>
    <a href="./user.html">Add One</a>
    `;
    return;
}


const productsList = await getSelectedProduct(cartList);

loadSelectedProduct(productsList);
}





checkSelected();