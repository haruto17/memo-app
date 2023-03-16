import { addData,getData,deleteData,overWriteData,logout} from "./firebase.js";


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

// カンマでタグ分割
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

function countGrapheme(string) {
    const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
    return [...segmenter.segment(string)].length;
}

// メモ保存関連
export async function saveMemo() {
    const title = document.getElementById("memoTitle").value;
    const contents = document.getElementById("memoContents").value;
    const tags = splitTag(document.getElementById("memoTags").value);

    const titleLength = countGrapheme(title);
    const contentsLength = countGrapheme(contents); 

    // 文字数チェック
    if (titleLength > 0 && titleLength <= 100) {
        if (contentsLength > 0 && contentsLength <= 1000) {
            if ([...tags].length <= 5) {
                const popupWrapper = document.getElementById("popupCreate");
                clearText();
                popupWrapper.style.display = "none";
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

    // メモを再度リストに追加
    nowKey.forEach(element => appendMemo(element));
}

// 検索結果のリセット
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
    const modal = confirm("メモを削除しますか？")
    if (modal == true) {
        localStorage.removeItem(key);
        deleteData(key);
        const memo = document.getElementById(key);
        memo.remove()
        const popupWrapper = document.getElementById("popupShow");
        const title = document.getElementById("showTitle");
        const contents = document.getElementById("contentsListArea");
        const tags = document.getElementById("showTags");
        title.innerText = "";
        contents.innerHTML = ``;
        tags.innerText = "";
        popupWrapper.style.display = "none";
    }
}

// メモの編集
export function editMemo(key) {
    const title = document.getElementById("editTitle").value;
    const contents = document.getElementById("editContents").value;
    const tags = splitTag(document.getElementById("editTags").value);
    const popupWrapper = document.getElementById("popupEdit"); 

    const titleLength = countGrapheme(title);
    const contentsLength = countGrapheme(contents);

    // 文字数チェック
    if (titleLength > 0 && titleLength <= 100) {
        if (contentsLength  > 0 && contentsLength  <= 1000) {
            if ([...tags].length <= 5) {
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
        }
    }
}


// メモ出力・ダウンロード
export function exportMemo(key) {
    const file_name = key;
    const memo = JSON.parse(localStorage.getItem(key));
    const title = memo[0];
    const contents = memo[1];
    const tags = memo[2];
    let text = "";
    text += title;
    text += "\n";
    text += contents;
    text += "\n";
    text += tags;
    text += "\n";
    const blob = new Blob([text],{type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.download = file_name;
    a.href = url;
    a.click();
    a.remove();
    URL.revokeObjectURL(url); 
}