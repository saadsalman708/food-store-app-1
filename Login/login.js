import { auth ,  } from "../firebase/config.js";

import { kick } from "../func/kick.js";

const email = document.querySelector("#email");
const password = document.querySelector("#password");
const btn = document.querySelector("#btn");
const googleBtn = document.querySelector("#googleBtn");

let loadOnce = false;





if (!loadOnce) {
    loadOnce = true;
    await kick({ requireAuth: false , });
}