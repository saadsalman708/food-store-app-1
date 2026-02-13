import { auth, collection, db, getDocs, signOut } from "../../firebase/config.js";
import { kick } from "../../func/kick.js";





const productsDiv = document.querySelector("#productsDiv");
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





async function getProducts() {

    const productsSnap = await getDocs(collection( db , "products" ));
    
    if (productsSnap.empty) {
        productsDiv.innerHTML = `<p>No products available.</p>`;
        return;
    }

    const productsList = [];

    productsSnap.forEach(productsData => {
        const product = productsData.data();

        const obj = {
            vendorUid: product.vendorUid,
            productName: product.productName,
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

    productsList.forEach((product)=>{
        
        const li = document.createElement("li");
        li.innerHTML = `
            <div>Product Name: ${product.productName}</div>
            <div>Vendor ID: ${product.vendorUid}</div> 
            <div>Product ID: ${product.productId}</div>
            <div>Created At: ${product.createdAt}</div>
            <button onclick="addToCart('${product.productId}')">Add to Cart</button>
        `;
        ul.appendChild(li);
    });
    productsDiv.appendChild(ul);
}





loadProducts();