import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth , createUserWithEmailAndPassword ,  signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAB51o-qe7xlAT7AQaWuypMSHrQWjuA0Ss",
    authDomain: "memo-app-19559.firebaseapp.com",
    projectId: "memo-app-19559",
    storageBucket: "memo-app-19559.appspot.com",
    messagingSenderId: "94326403042",
    appId: "1:94326403042:web:5816e6390d09e3b47853bb",
    measurementId: "G-2YNG42RFGZ"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export function createAccount() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential) => {
        const user = userCredential.user;

        alert('create!!!');

        const userinfo = auth.currentUser;
        console.log(userinfo.email);

        window.location.href = "main.html";
    })
    .catch((error) => {
        const errorCode = error.errorCode;
        const errorMessage = error.message;
        alert('Failed!!!');
        console.log(error);
        console.log(errorMessage);
    })
}

export function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;

        alert('login!!!');

        // const userinfo = auth.currentUser;
        // console.log(userinfo.uid);

        const userinfo = auth.currentUser;
        sessionStorage.setItem("email",userinfo.email);
        sessionStorage.setItem("uid",userinfo.uid);

        window.location.href = "main.html";
    })
    .catch((error) => {
        const errorCode = error.errorCode;
        const errorMessage = error.message;
        alert('login Failed!!!');
        console.log(error);
        console.log(errorMessage);
    })
}