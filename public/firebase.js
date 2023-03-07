import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth , createUserWithEmailAndPassword ,  signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {getFirestore,collection,doc,addDoc,setDoc} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore-lite.js";

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

export function addData(title,contents,tags) {
    // try {
    //     const docRef = await addDoc(collection(db,"test"),{
    //         1:["Hello","See you","Good bye"]
    //     });
    //     console.log("ドキュメントID",docRef.id);
    //     console.log("データの保存が成功しました");
    // }catch(e) {
    //     console.error("error",e);
    // }

    // const docRef = doc(db,"eve","4");
    // const data = [];
    // data.push(title);
    // data.push(contents);
    // data.push(tags);
    // const obj = Object.assign({},data);
    // setDoc(docRef,obj)
    // .then(docRef => {
    //     console.log("成功")
    // }).catch(error => {
    //     console.log(error);
    // })

    console.log("Save to firestore");
}