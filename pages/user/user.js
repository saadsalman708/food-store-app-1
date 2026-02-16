import {
    auth, db,
    getDocs, collection,
    signOut,
} from "../../firebase/config.js";

import { kick } from "../../func/kick.js";





const cartCount = document.querySelector("#cartCount");
const productsDiv = document.querySelector("#productsDiv");
const logoutBtn = document.querySelector("#logoutBtn");





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





async function getProducts() {

    const productsSnap = await getDocs(collection(db, "products"));

    if (productsSnap.empty) {
        productsDiv.innerHTML = `<p>No products available.</p>`;
        return;
    }

    const productsList = [];

    productsSnap.forEach(productsData => {
        const product = productsData.data();

        const obj = {
            imageUrl: product.imageUrl,
            vendorUid: product.vendorUid,
            shopName: product.shopName,
            price: product.price,
            name: product.name,
            productId: productsData.id,
            createdAt: product.createdAt,
        };

        productsList.push(obj);
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

    productsList.forEach((product) => {

        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.textContent = "Add to Cart";
        btn.onclick = () => addToCart(product.productId);
        li.innerHTML = `
            <div>${product.imageUrl}</div>
            <div>Product Name: ${product.name}</div>
            <div>Price: ${product.price}</div>
            <div>Shop Name: ${product.shopName}</div>
            <div>Vendor ID: ${product.vendorUid}</div> 
            <div>Product ID: ${product.productId}</div>
            <div>Created At: ${product.createdAt}</div>
        `;
        li.appendChild(btn);
        ul.appendChild(li);
    });
    productsDiv.appendChild(ul);
}





const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
function updateCartCount() {
    const total = cartList.reduce(( sum , item )=> {
        return sum += item.qty
    } , 0);
    cartCount.innerHTML = total || "" ;
    if (total > 0) {
        cartCount.classList.remove("d-none");
    } else {
        cartCount.classList.add("d-none");
    }
}



updateCartCount();



function addToCart(id) {
    
    const itemExist = cartList.find(item => item.id === id);
    
    if (itemExist) {
        itemExist.qty += 1;
    } else {
        cartList.push({ id: id , qty: 1 });
    }
    
    localStorage.setItem("cartList", JSON.stringify(cartList));
    
    updateCartCount();    
}





loadProducts();