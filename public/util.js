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
    // document.getElementById("memoTitle1").value = "";
    // document.getElementById("memoContents1").value = "";
    // document.getElementById("memoTags1").value = "";
};

// 空白でタグ分割
function splitTag(tags) {
    const separatorString = /\s+/;
    const tagArray = tags.split(separatorString);
    return tagArray;
}

// 作成用ポップアップ表示
function createMemo() {
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

// メモ保存
function saveMemo(key) {
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
            }
        }
    }
    
    if (key == 0) {
        const memo2 = {
            date: getTime(),
            title: document.getElementById("memoTitle1").value,
            contents: document.getElementById("memoContents1").value,
            tags: splitTag(document.getElementById("memoTags1").value),
        };
        if (memo2.title && memo2.contents) {
            if(memo2.title.length <= 100 && memo2.contents.length <= 1000 && memo2.tags.length <= 5){
                const jsonString2 = JSON.stringify(memo2);
                localStorage.setItem(index, jsonString2);
                //clearText();
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
    titleText.innerText = memo.title;
    div.appendChild(line);
    div.appendChild(titleText);
    list.appendChild(div);
}

// 表示されたメモのクリック時
function clickMemo(e) {
    const key = e.target.id;
    index = key;
    const popupWrapper = document.getElementById("popupEdit");
    const closebtn = document.getElementById("close");
    const deletebtn = document.getElementById("delete");
    const editbtn = document.getElementById("edit");
    const title = document.getElementById("memoTitle1");
    const contents = document.getElementById("memoContents1");
    const tags = document.getElementById("memoTags1");
    const memo = readMemo(key);

    title.innerText = memo.title;
    contents.innerText = memo.contents;
    tags.innerText = memo.tags;

    // ポップアップ表示
    popupWrapper.style.display = "block";

    console.log(localStorage.getItem(key));

    const clickEventListener =  (e) => {
        if (e.target.id === popupWrapper.id || e.target.id === closebtn.id) {
            popupWrapper.style.display = "none";
            popupWrapper.removeEventListener("click",clickEventListener);
        } else if (e.target.id === editbtn.id) {
            console.log("edit");
            popupWrapper.style.display = "none";
            popupWrapper.removeEventListener("click",clickEventListener);
            editMemo(key);
        } else if (e.target.id === deletebtn.id) {
            popupWrapper.style.display = "none";
            popupWrapper.removeEventListener("click",clickEventListener);
            deleteMemo(key);
            refreshMemo()
        }
    }

    popupWrapper.addEventListener("click", clickEventListener);

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

// localStorageからメモ取得。JSONで返す
function readMemo(key) {
    const memo = JSON.parse(localStorage.getItem(key));
    return memo;
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

function addCode() {
    console.log("addCode");
    document.getElementById("memoContents").value += "``";
}

// メモの編集
function editMemo(key) {
    const popupWrapper = document.getElementById("popupCreate");
    const title = document.getElementById("memoTitle");
    const contents = document.getElementById("memoContents");
    const tags = document.getElementById("memoTags");
    const close = document.getElementById("close");
    const memo = readMemo(key);

    title.value = memo.title;
    contents.value = memo.contents;
    tags.value = memo.tags;
    
    popupWrapper.style.display = "block";


    popupWrapper.addEventListener("click", (e) => {
        if (e.target.id === popupWrapper.id || e.target.id === close.id) {
            popupWrapper.style.display = "none";
            const li = document.getElementById("searchResult");
            li.innerHTML = ``;
        }
    });
}