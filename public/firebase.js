import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth , createUserWithEmailAndPassword ,  signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {getFirestore,getCount,collection,doc,setDoc,getDoc} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore-lite.js";

const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export function createAccount() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential) => {
        const user = userCredential.user;

        alert('create!!!');

        const userinfo = auth.currentUser;
        sessionStorage.setItem("email",userinfo.email);
        sessionStorage.setItem("uid",userinfo.uid);

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

export function logout() {
    signOut(auth)
    .then(() => {
        alert("logout");
        sessionStorage.clear();
        window.location.href = "index.html";
    })
    .catch((error) => {
        console.log(error);
    })
}

export function addData(title,contents,tags) {
    const uid = sessionStorage.getItem("uid");
    const docRef = doc(db,uid,"4");
    const data = [];
    data.push(title);
    data.push(contents);
    data.push(tags);
    const obj = Object.assign({},data);
    setDoc(docRef,obj)
    .then(docRef => {
        console.log("成功")
    }).catch(error => {
        console.log(error);
    })

    console.log("Save to firestore");
}

export async function getData() {
    const uid = sessionStorage.getItem("uid");
    const docRef = doc(db,uid,"1");
    const docSnap = await getDoc(docRef);
    const count = await getCount(collection(db,"test"));

    console.log("document num:",count.data().count);

    if(docSnap.exists()) {
        console.log("Document data:",docSnap.data());
    }
    else {
        console.log("No such document!");
    }
}