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
    let separatorString = /\s+/;
    let tagArray = tags.split(separatorString);
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
    const memo = {
        date: getTime(),
        title: document.getElementById("memoTitle").value,
        contents: document.getElementById("memoContents").value,
        tags: splitTag(document.getElementById("memoTags").value),
    };

    if (key == 1) {
        if (memo.title && memo.contents) {
        if (memo.title.length <= 100 && memo.contents.length <= 1000 && memo.tags.length <= 5) {
            const popupWrapper = document.getElementById("popupCreate");
            const jsonString = JSON.stringify(memo);
            localStorage.setItem(localStorage.length + 1, jsonString);
            appendMemo();
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
        const jsonString2 = JSON.stringify(memo2);
        localStorage.setItem(index, jsonString2);
        //clearText();
    }
}

// リストへのメモ追加
function appendMemo() {
    const memo = readMemo();

    const list = document.getElementById("memoList");
    const div = document.createElement("div");
    div.className = "memo";
    div.id = localStorage.length;
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
    const close = document.getElementById("close");
    const title = document.getElementById("memoTitle1");
    const contents = document.getElementById("memoContents1");
    const tags = document.getElementById("memoTags1");
    const memo = readMemo();

    title.innerText = memo.title;
    contents.innerText = memo.contents;
    tags.innerText = memo.tags;

    // ポップアップ表示
    popupWrapper.style.display = "block";

    console.log(localStorage.getItem(key));

    popupWrapper.addEventListener("click", (e) => {
        if (e.target.id === popupWrapper.id || e.target.id === close.id) {
        popupWrapper.style.display = "none";
        }
    });
}

// localStorageからメモ取得。JSONで返す
function readMemo() {
    const memo = JSON.parse(localStorage.getItem(localStorage.length));
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