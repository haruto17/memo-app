import { addData,getData,deleteData,overWriteData,logout} from "./firebase.js";

let index = 0;

// リロード時にlocalStorageの削除
window.onload = function () {
    localStorage.clear();
    const reset = document.getElementById("btn-reset");
    reset.style.display = "none";
    // firestoreからデータ取得
    getData();
};

// テキストエリアの削除
const clearText = () => {
    document.getElementById("memoTitle").value = "";
    document.getElementById("memoContents").value = "";
    document.getElementById("memoTags").value = "";
};

// 空白でタグ分割
function splitTag(tagString) {
    const tagArray = tagString.split(",");
    return tagArray;
}

// 作成用ポップアップ表示
export function createMemo() {
    const popupWrapper = document.getElementById("popupCreate");
    const close = document.getElementById("close");

    popupWrapper.style.display = "block";

    popupWrapper.addEventListener("click", (e) => {
        if (e.target.id === popupWrapper.id || e.target.id === close.id) {
            popupWrapper.style.display = "none";
            const li = document.getElementById("searchResult");
            li.innerHTML = ``;
        }
    });
}

// メモ保存関連
export async function saveMemo(key) {
    // メモの作成
    if (key == 1) {
        // const memo = {
        //     date: getTime(),
        //     title: document.getElementById("memoTitle").value,
        //     contents: document.getElementById("memoContents").value,
        //     tags: splitTag(document.getElementById("memoTags").value),
        // };

        const title = document.getElementById("memoTitle").value;
        const contents = document.getElementById("memoContents").value;
        const tags = splitTag(document.getElementById("memoTags").value);

        if (title && contents) {
            if (title.length <= 100 && contents.length <= 1000) {
                const popupWrapper = document.getElementById("popupCreate");
                // const jsonString = JSON.stringify(memo);
                // localStorage.setItem(localStorage.length + 1, jsonString);
                // appendMemo(localStorage.length);
                clearText();
                popupWrapper.style.display = "none";
                // addData(memo.title,memo.contents,"tagsText");
                const dataID = await addData(title,contents,tags);
                const memodata = {
                    "0":title,
                    "1":contents,
                    "2":tags,
                }
                localStorage.setItem(dataID,JSON.stringify(memodata));
                appendMemo(dataID);
            }
        }
    }
    
    // メモの編集時、既存メモの更新
    if (key == 0) {
        const memo2 = {
            date: getTime(),
            title: document.getElementById("editTitle").value,
            contents: document.getElementById("editContents").value,
            tags: splitTag(document.getElementById("editTags").value),
        };
        if (memo2.title && memo2.contents) {
            if(memo2.title.length <= 100 && memo2.contents.length <= 1000 && memo2.tags.length <= 5){
                const jsonString2 = JSON.stringify(memo2);
                localStorage.setItem(index, jsonString2);
                const popupWrapper = document.getElementById("popupEdit");
                popupWrapper.style.display = "none";
            }
        }
    }
}

// リストへのメモ追加
function appendMemo(key) {
    const memo = readMemo(key);

    const list = document.getElementById("memoList");
    const div = document.createElement("div");
    div.className = "memo";
    div.id = key;
    div.setAttribute("onclick", "clickMemo(event)");
    const line = document.createElement("hr");
    const titleText = document.createElement("p");
    titleText.innerText = memo[0];
    titleText.className = "title-text";
    div.appendChild(line);
    div.appendChild(titleText);
    list.appendChild(div);
}

// メモリストの更新
function refreshMemo() {

    // メモリストの子要素を一旦削除
    const li = document.getElementById("memoList");
    li.innerHTML = ``;

    // 今localStorageに保存されているメモのkeyをすべて取得
    let nowKey = Object.keys(localStorage);
    // ソート
    nowKey.sort();

    // メモを再度リストに追加
    nowKey.forEach(element => appendMemo(element));

    console.log(nowKey);
}

export function searchReset() {
    const memoli = document.getElementById("memoList");
    const reset = document.getElementById("btn-reset");
    const input = document.getElementById("searchInput");
    input.value = "";
    memoli.innerHTML = ``;
    refreshMemo();
    reset.style.display = "none";
}


// メモ検索。結果のポップアップ表示
export function searchMemo() {
    // const popupWrapper = document.getElementById("popup-wrapper");
    // const close = document.getElementById("close");

    // const searchKeyword = document.getElementById("memoSearch").value;
    // const lengthStorage = localStorage.length;

    // if (!lengthStorage) {
    //     alert("No Data!!");
    // } else {
    //     for (let i = 1; i <= lengthStorage; i++) {
    //     const memo = JSON.parse(localStorage.getItem(i));
    //     const title = memo.title;
    //     const tag = memo.tags;

    //     if (title.match(searchKeyword) || tag.includes(searchKeyword)) {
    //         const ul = document.getElementById("searchResult");
    //         const li = document.createElement("li");
    //         const text = "title: " + memo.title + " contents: " + memo.contents + " tags: " + memo.tags;
    //         li.appendChild(document.createTextNode(text));
    //         ul.appendChild(li);

    //         popupWrapper.style.display = "block";
    //     }
    //     }
    // }

    // popupWrapper.addEventListener("click", (e) => {
    //     if (e.target.id === popupWrapper.id || e.target.id === close.id) {
    //     popupWrapper.style.display = "none";
    //     const li = document.getElementById("searchResult");
    //     li.innerHTML = ``;
    //     }
    // });

    const keyword = document.getElementById("searchInput").value;
    // 今localStorageに保存されているメモのkeyをすべて取得
    const nowKey = Object.keys(localStorage);
    const memoli = document.getElementById("memoList");
    const reset = document.getElementById("btn-reset");
    let keyli = [];
    if (!nowKey) {
        alert("No data");
    } else if (keyword.length > 0){
        for (let i = 0; i < nowKey.length; i++) {
            const memo = JSON.parse(localStorage.getItem(nowKey[i]));
            const title = memo[0];
            const tag = memo[2];

            if(title.indexOf(keyword) !== -1 || tag.includes(keyword)) {
                keyli.push(nowKey[i]);
            }
        }
    }

    if(keyli.length > 0) {
        memoli.innerHTML = ``;
        for(let i = 0; i < keyli.length; i++) {
            appendMemo(keyli[i]);
        }
        reset.style.display = "block";
    }

}

// 日時の取得
function getTime() {
    const date1 = new Date();
    const date2 =
        date1.getFullYear() +
        "/" +
        (date1.getMonth() + 1) +
        "/" +
        date1.getDate() +
        "/" +
        date1.getHours() +
        "/" +
        date1.getMinutes();
    return date2;
}

// ログアウトボタンが押されたとき firebase.jsのlogout()を呼び出す
export function logoutAccount() {
    logout();
}

// localStorage上のメモの削除
export function deleteMemo(key) {
    localStorage.removeItem(key);
    deleteData(key);
    refreshMemo();
    const popupWrapper = document.getElementById("popupShow");
    popupWrapper.style.display = "none";

}

export function editMemo(key) {
    console.log("editMemo",key);
    const title = document.getElementById("editTitle").value;
    const contents = document.getElementById("editContents").value;
    const tags = splitTag(document.getElementById("editTags").value);
    const popupWrapper = document.getElementById("popupEdit"); 
    // オブジェクト作成
    const memo = {
        "0":title,
        "1":contents,
        "2":tags
    };
    // localStorageのメモを上書き
    localStorage.setItem(key,JSON.stringify(memo));

    // リスト内にあるメモのタイトル変更
    const memoli = document.getElementById(key);
    const titleText = memoli.getElementsByTagName("p");
    titleText[0].innerText = title;
    
    // firestoreのドキュメントの上書き
    overWriteData(key,memo);

    popupWrapper.style.display = "none";
}