import { addData,logout } from "./firebase.js";

let index = 0;

// リロード時にlocalStorageの削除
window.onload = function () {
    localStorage.clear();
};

// テキストエリアの削除
const clearText = () => {
    document.getElementById("memoTitle").value = "";
    document.getElementById("memoContents").value = "";
    document.getElementById("memoTags").value = "";
};

// 空白でタグ分割
function splitTag(tags) {
    const separatorString = /\s+/;
    const tagArray = tags.split(separatorString);
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
export function saveMemo(key) {
    console.log("save")
    // メモの作成
    if (key == 1) {
        const memo = {
            date: getTime(),
            title: document.getElementById("memoTitle").value,
            contents: document.getElementById("memoContents").value,
            tags: splitTag(document.getElementById("memoTags").value),
        };
        if (memo.title && memo.contents) {
            if (memo.title.length <= 100 && memo.contents.length <= 1000 && memo.tags.length <= 5) {
                const popupWrapper = document.getElementById("popupCreate");
                const jsonString = JSON.stringify(memo);
                localStorage.setItem(localStorage.length + 1, jsonString);
                appendMemo(localStorage.length);
                clearText();
                popupWrapper.style.display = "none";
                addData(memo.title,memo.contents,"tagsText");
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

// localStorage上のメモの削除
function deleteMemo(key) {
    localStorage.removeItem(key);
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


// メモ検索。結果のポップアップ表示
function searchMemo() {
    const popupWrapper = document.getElementById("popup-wrapper");
    const close = document.getElementById("close");

    const searchKeyword = document.getElementById("memoSearch").value;
    const lengthStorage = localStorage.length;

    if (!lengthStorage) {
        alert("No Data!!");
    } else {
        for (let i = 1; i <= lengthStorage; i++) {
        const memo = JSON.parse(localStorage.getItem(i));
        const title = memo.title;
        const tag = memo.tags;

        if (title.match(searchKeyword) || tag.includes(searchKeyword)) {
            const ul = document.getElementById("searchResult");
            const li = document.createElement("li");
            const text = "title: " + memo.title + " contents: " + memo.contents + " tags: " + memo.tags;
            li.appendChild(document.createTextNode(text));
            ul.appendChild(li);

            popupWrapper.style.display = "block";
        }
        }
    }

    popupWrapper.addEventListener("click", (e) => {
        if (e.target.id === popupWrapper.id || e.target.id === close.id) {
        popupWrapper.style.display = "none";
        const li = document.getElementById("searchResult");
        li.innerHTML = ``;
        }
    });
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

function addCode(sum) {
    if (sum == 1) {
        const contents = document.getElementById("memoContents");
        contents.value += "``";
        contents.focus();
    } else if(sum == 0) {
        const editcontents = document.getElementById("editContents");
        editcontents.value += "``";
        editcontents.focus();
    }
}

// メモの編集用ポップアップの表示
function editMemo(key) {
    console.log("key is:", key);

    const popupWrapper = document.getElementById("popupEdit");
    const title = document.getElementById("editTitle");
    const contents = document.getElementById("editContents");
    const tags = document.getElementById("editTags");
    const close = document.getElementById("close");
    const memo = readMemo(key);

    title.value = memo.title;
    contents.value = memo.contents;
    tags.value = memo.tags;
    
    popupWrapper.style.display = "block";

    popupWrapper.addEventListener("click", (e) => {
        if (e.target.id === popupWrapper.id || e.target.id === close.id) {
            popupWrapper.style.display = "none";
        }
    });
}

export function logoutAccount() {
    logout();
}