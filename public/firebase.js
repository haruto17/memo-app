import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth ,GithubAuthProvider, signInWithPopup ,createUserWithEmailAndPassword ,  signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {getFirestore,getCount,collection,doc,addDoc,setDoc,getDoc,getDocs,deleteDoc} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore-lite.js";

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

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GithubAuthProvider();

// Githubアカウントを使ったログイン
export function loginWithGithub() {
    signInWithPopup(auth,provider)
    .then((result) => {

        alert('login!!!');

        const userinfo = auth.currentUser;
        sessionStorage.setItem("uid",userinfo.uid);
        window.location.href = "main.html";

    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Failed login with github!!!");
        console.log(errorCode);
        console.log(errorMessage);
    })
}

// アカウント作成、e-mailとパスワードで作成
export function createAccount() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential) => {
        const user = userCredential.user;

        alert('create!!!');

        const userinfo = auth.currentUser;
        sessionStorage.setItem("uid",userinfo.uid);

        // main.htmlに遷移
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

// ログイン処理
export function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;

        alert('login!!!');

        const userinfo = auth.currentUser;
        sessionStorage.setItem("uid",userinfo.uid);

        // main.htmlに遷移
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

// ログアウト処理 sessionStorageの削除とindex.htmlに遷移
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

// firestoreにデータ保存
export async function addData(title,contents,tags) {
    const uid = sessionStorage.getItem("uid");
    
    let dataID = "";

    // ドキュメントの保存 idはランダム
    try {
        const docRef = await addDoc(collection(db,uid),{
            "0":title,
            "1":contents,
            "2":tags,
        })
        .then(docRef => {
            dataID = String(docRef.id);
        })
    }catch(e) {
        console.log("error",e);
    }

    return dataID;
}

// firestoreコレクション内のドキュメントIDをすべて取得
async function getDocumentID() {
    const uid = sessionStorage.getItem("uid");
    let li = [];
    // ランダムなドキュメントIDを取得
    const querySnapShot = await getDocs(collection(db,uid));
    querySnapShot.forEach((doc) => {
        li.push(String(doc.id));
    })

    return li;
}

// firestoreからデータ取得 localStorageに保存した後memoListに要素追加
export async function getData() {
    const uid = sessionStorage.getItem("uid");

    const idList = await getDocumentID();

    for(let i = 0; i < idList.length; i++) {
        const docRef = doc(db,uid,idList[i]);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const stringDS = JSON.stringify(docSnap.data());
            localStorage.setItem(idList[i],stringDS);

            const list = document.getElementById("memoList");
            const div = document.createElement("div");
            div.className = "memo";
            div.id = idList[i];
            div.setAttribute("onclick","clickMemo(event)");
            const line = document.createElement("hr");
            const titleText = document.createElement("p");
            titleText.innerText = docSnap.data()[0];
            titleText.className = "title-text";
            div.appendChild(line);
            div.appendChild(titleText);
            list.appendChild(div);
        } else {
            console.log("No such document!");
            break;
        }
    }
}


// ドキュメントの削除
export async function deleteData(key) {
    const uid = sessionStorage.getItem("uid");
    await deleteDoc(doc(db,uid,String(key)));
    alert(`ドキュメント[${key}]を削除しました`);
    
}

// ドキュメントの上書き（メモ編集時）
export function overWriteData(key,memo) {
    const uid = sessionStorage.getItem("uid");
    const docRef = doc(db,uid,key);

    setDoc(docRef,memo)
    .then(docRef => {
        console.log("Success!!")
    }).catch(error => {
        console.log(error);
    })

    console.log("Overwrite to firestore");
}