import { auth, onAuthStateChanged } from "./firebase/config.js";
import { handleRedirect } from "./func/handleRedirect.js";




const wrapper = document.querySelector(".wrapper");



const gifs = [
    "https://media1.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MjN3djEwdWxmNWJmcG92dGdvemdkNmVzZnh5dDMxN2gybTJqMzB6eCZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/yPa6HJjAINWWskg6lG/giphy.webp",
    "https://media2.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZDV0b3Bia3Nwems0ajhyYWZvOWE3aTE5NGNwaGQxN2ZobnZubG5iOSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/YAS6OWBSFCVGfIxAvT/200.webp",
    "https://media1.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dmE1c3c3dDdkOXRmYXg1anc4MGx4c2l1MGszcGVuZGkyd2Izc2k1aiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/h6yPvqwFdFwnooK0bX/200.webp",
    "https://media1.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YXJ1bWVnam0wYXZ6dWRidzg2eTZtNW0zcG15M3AzcnNiMnh5b2t1biZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/STmold2zrhCaQ/200.webp",
    "https://media0.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dmE1c3c3dDdkOXRmYXg1anc4MGx4c2l1MGszcGVuZGkyd2Izc2k1aiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/HlJtbXj1u614Q/200.webp",
    "https://media3.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dW92cGkwcGJmb2d0OXZqNWpid28wY2JkMTE0NnRjNm5xandoaG41ayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fYR3UO4sDMJLyX5DvU/200.webp",
    "https://media0.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dmE1c3c3dDdkOXRmYXg1anc4MGx4c2l1MGszcGVuZGkyd2Izc2k1aiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/zTW4lVAzqHWh8QvW3g/200.webp",
    "https://i0.wp.com/www.thisiscolossal.com/wp-content/uploads/2015/04/cine-1.gif?resize=817%2C460",
    "https://i0.wp.com/www.thisiscolossal.com/wp-content/uploads/2015/04/cine-2.gif?resize=800%2C450",
    "https://i0.wp.com/mossandfog.com/wp-content/uploads/2015/04/tumblr_60c27db8f087da22903250b4b0f7ed64_ed10dc0c_540-1.gif?resize=817%2C1021&ssl=1",
    "https://i0.wp.com/www.thisiscolossal.com/wp-content/uploads/2015/04/cine-7.gif?resize=800%2C450",
    "https://i0.wp.com/www.thisiscolossal.com/wp-content/uploads/2015/04/cine-6.gif?resize=800%2C450",
    "https://i0.wp.com/www.thisiscolossal.com/wp-content/uploads/2015/04/cine-8.gif?resize=800%2C450",
    "https://i0.wp.com/mossandfog.com/wp-content/uploads/2021/10/halloween-cinemgraph-moss-and-fog-7-2.gif?w=271&h=271&crop=1&ssl=1",
    "https://i0.wp.com/mossandfog.com/wp-content/uploads/2021/10/halloween-cinemgraph-moss-and-fog-1.gif?resize=596%2C596&ssl=1",
    "https://i0.wp.com/mossandfog.com/wp-content/uploads/2019/04/tasty-cinemagraphs-moss-and-fog-1.4.gif?resize=540%2C750&ssl=1",
    "https://i0.wp.com/mossandfog.com/wp-content/uploads/2019/04/tasty-cinemagraphs-moss-and-fog-1.7.gif?resize=540%2C750&ssl=1",
    "https://i0.wp.com/mossandfog.com/wp-content/uploads/2019/04/tasty-cinemagraphs-moss-and-fog-3.gif?resize=540%2C750&ssl=1",
    "https://i0.wp.com/mossandfog.com/wp-content/uploads/2019/04/tasty-cinemagraphs-moss-and-fog-7.gif?resize=540%2C750&ssl=1",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNG15dGtmNzZiNzdjZzBvbmlzYXFndTRwMGRjeHJ4cWZ0YnVvajB6NiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/egucCCaMgK3KsaxyJT/200.webp",
    "https://media1.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NXdyMTI2Z2Z1dTdoZjNybHFveDRwaTZhbXA1YzFkb2o0NzVwejF5diZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8vIFcKOQHN9hSBH9UU/200.webp",
    "https://media2.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NXdyMTI2Z2Z1dTdoZjNybHFveDRwaTZhbXA1YzFkb2o0NzVwejF5diZlcD12MV9naWZzX3NlYXJjaCZjdD1n/5g9DkUznyQWfMPYEWQ/200.webp",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDFlcWYwcG9hZWN3OWhmeXZncDVtaHBjc2VpZnpicXp1NnpuamNicCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/rom765JCBF8vC6YqSO/giphy.webp",
];



let index = 0;
let intervalId = null;
let currentImage = null;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

const shuffledGifs = shuffle([...gifs]);

function changeBackground() {
    if (currentImage) {
        currentImage.onload = null;
        currentImage = null;
    }

    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";

    img.src = shuffledGifs[index];

    img.onload = () => {
        wrapper.style.backgroundImage = `url(${img.src})`;
    };

    currentImage = img;

    index = (index + 1) % shuffledGifs.length;
}

function startBackgroundRotation() {
    if (!intervalId) {
        intervalId = setInterval(changeBackground, 4000);
    }
}

function stopBackgroundRotation() {
    clearInterval(intervalId);
    intervalId = null;
}

changeBackground();
startBackgroundRotation();

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopBackgroundRotation();
    } else {
        changeBackground();
        startBackgroundRotation();
    }
});





handleRedirect();