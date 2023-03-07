import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth , createUserWithEmailAndPassword ,  signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {getFirestore,getCount,collection,doc,setDoc,getDoc,deleteDoc} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore-lite.js";

const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

// アカウント作成、e-mailとパスワードで作成
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
        sessionStorage.setItem("email",userinfo.email);
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
export function addData(title,contents,tags) {
    const uid = sessionStorage.getItem("uid");
    const docRef = doc(db,uid,"0");
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

// firestoreからデータ取得 localStorageに保存した後memoListに要素追加
export async function getData() {
    const uid = sessionStorage.getItem("uid");
    const docRef = doc(db,uid,"1");
    const docSnap = await getDoc(docRef);
    const docCount = await getCount(collection(db,uid));

    for(let i = 1; i <= docCount.data().count; i++) {
        const docRef = doc(db,uid,String(i));
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
            console.log("Document data:",docSnap.data());
            const stringDS = JSON.stringify(docSnap.data());
            localStorage.setItem(i,stringDS);
            
            const list = document.getElementById("memoList");
            const div = document.createElement("div");
            div.className = "memo";
            div.id = i;
            div.setAttribute("onclick", "clickMemo(event)");
            const line = document.createElement("hr");
            const titleText = document.createElement("p");
            titleText.innerText = docSnap.data()[1];
            titleText.className = "title-text";
            div.appendChild(line);
            div.appendChild(titleText);
            list.appendChild(div);
        }
        else {
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