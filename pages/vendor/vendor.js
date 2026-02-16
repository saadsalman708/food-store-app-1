import {
    auth, db,
    onAuthStateChanged , signOut,
    getDocs, getDoc, addDoc, deleteDoc, collection, serverTimestamp,
    doc, updateDoc,
} from "../../firebase/config.js";

import { kick } from "../../func/kick.js";




const shopNameDisplay = document.querySelector("#shopNameDisplay");
const shopNameInput = document.querySelector("#shopNameInput");
const shopNameDiv = document.querySelector("#shopNameDiv");
const productDetailsDiv = document.querySelector("#productDetailsDiv");
const productsDiv = document.querySelector("#productsDiv");
const productName = document.querySelector("#productName");
const productPrice = document.querySelector("#productPrice");
const productImage = document.querySelector("#productImage");
const saveShopNameBtn = document.querySelector("#saveShopNameBtn");
const addProductBtn = document.querySelector("#addProductBtn");
const logoutBtn = document.querySelector("#logoutBtn");





let shopNameTemp = null;





await kick({ role: "vendor", verify: true });





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




// let ok = false;

saveShopNameBtn.addEventListener("click", async () => {
    const shopNameInputVal = shopNameInput.value.trim();
    if (!shopNameInputVal) {
        Swal.fire({
            title: "Shop Name Required",
            icon: "warning",
            backdrop: `
            rgba(0,0,123,0.4)
            url("https://images.steamusercontent.com/ugc/974353111661482849/4706D02264975280AEFACD65BF02F585F978B6B3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false")
            left top / 30%
            no-repeat`,
        });
        return;
    }

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
        shopName: shopNameInputVal,
    }, { merge: true });

    // ok = true;
    shopNameDiv.classList.toggle("d-none");
    shopNameInput.value = "";
    isShopName();
});




async function isShopName() {
onAuthStateChanged(auth, async (user) => {

    const snap = await getDoc(doc(db, "users", user.uid));
        const profile = snap.data();
        if (!profile.shopName) {
            shopNameDiv.classList.toggle("d-none");
            return;
        }

        shopNameTemp = profile.shopName;
        productDetailsDiv.classList.toggle("d-none");
        productsDiv.classList.toggle("d-none");
        shopNameDisplay.innerHTML = profile.shopName;
        return;
});
}





await isShopName();






addProductBtn.addEventListener("click", async () => {

    const productNameVal = productName.value.trim();
    const productPriceVal = productPrice.value.trim();
    // const productVal = productName.value.trim();

    if (!productNameVal || !productPriceVal) {
        Swal.fire({
            title: 'Please enter a product details!',
            text: 'Product details cannot be empty.',
            icon: 'error',
        });
        return;
    }

    await addDoc(collection(db, "products"), {
        vendorUid: auth.currentUser.uid,
        shopName: shopNameTemp,
        imageUrl: "imageUrl",
        name: productNameVal,
        price: productPriceVal,
        createdAt: serverTimestamp(),
    });

    productName.value = "";
    productPrice.value = "";
    loadProducts();

});





async function getProducts() {

    const productsSnap = await getDocs(collection(db, "products"));

    if (productsSnap.empty) {
        productsDiv.innerHTML = `<p>No products available.</p>`;
        return;
    }

    const productsList = [];
    // const productsList = [
    //     {
    //         name: "one",
    //         imageUrl: "data.jjj",
    //         productId: 2142134,
    //         createdAt: 38798798709852,
    //     },
    //     {
    //         name: "two",
    //         imageUrl: "data.jjj",
    //         productId: 2142134,
    //         createdAt: 38798798709852,
    //     },
    // ];

    productsSnap.forEach(productData => {
        const product = productData.data();

        if (auth.currentUser.uid === product.vendorUid) {

            const obj = {
                vendorUid: product.vendorUid,
                shopname: product.shopname,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                productId: productData.id,
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

    productsList.forEach((product) => {

        const li = document.createElement("li");
        const del = document.createElement("button");
        const edit = document.createElement("button");
        del.innerText = "Delete";
        edit.innerText = "Edit";
        del.onclick = () => deleteProduct(product.productId);
        edit.onclick = () => editProduct(product.productId);
        li.innerHTML = `
            <div>${product.imageUrl}</div>
            <div>Product Name: ${product.name}</div>
            <div>Price: ${product.price}</div>
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

    await updateDoc(doc(db, "products", productId), {
        productName: productNameVal,
    }, { merge: true });

    loadProducts();
}





const deleteProduct = async (productId) => {
    await deleteDoc(doc(db, "products", productId));
    loadProducts();
}





loadProducts();