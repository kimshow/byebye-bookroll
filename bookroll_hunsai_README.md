# Bookroll粉砕!!
京大生あるいは他大生のみなさん、Bookrollに苦しめられていませんか?  
実はBookrollから我々を救う方法が公開されています↓ ありがとう。  
[bookrollをpdfにする方法](https://gist.github.com/watagashi0619/40ba179c9ef7d585246c47c31dab67ed)  
しかし、たまにこの方法でダウンロードしても画質が悪くなることがあるようです(私が遭遇した事例ですが)。  
じゃあ画質を落とさずダウンロードしてやるぜ、ということでこんなコードを書きました。  
ちなみにコードがクッソ汚いのはJavaScriptミリしらなのに書いたからです。JSに強い人はissueで修正をどうか投げてください。

## BookrollをPDFにする手順
1. PDF化したいBookrollのページを開く
1. JavaScriptのコンソールを開く(Chromeなら右上の縦に3つ丸があるところクリック->その他のツール->デベロッパーツール->Console)
1. 次のコードを貼り付けてEnter

```
//ページ数(ループ数)の取得
let chips = document.getElementsByClassName("page-chip  mt-2");
let val1 = "page";
chips[0].setAttribute("id", val1);
chips = document.getElementById("page");
chips=chips.innerText;
chips=Number(chips.substr(chips.indexOf("/")+2));

//ページ送りに使うボタンの指定
let button = document.getElementsByClassName("next-btn v-btn v-btn--contained v-btn--fab v-btn--round theme--light v-size--default");
let val2 = "botan";
button[0].setAttribute("id", val2);
button = document.getElementById("botan");

//sleepを作ってた人のを借りてきた
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await _sleep(1000);

//画像化したいキャンバスを指定
let canvas = document.getElementsByClassName("canvas material-canvas");
let val3 = "image";
canvas[0].setAttribute("id", val3);
canvas = document.getElementById("image");
let data = canvas.toDataURL("image/png");

//以下はポタージュくんのやつをコピペしただけ、zip作成とダウンロードの準備
function loadJSZipFromCDN(){
  let script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/jszip@3.2.1/dist/jszip.js";
  document.head.append(script);
}
loadJSZipFromCDN();
async function downloadImages() {
  const sources = ar;
  const imagePromises = sources.map(
      (src, i) => new Promise((resolve, reject) => {
          let xhr = new XMLHttpRequest();
          xhr.open('GET', src, true);
          xhr.responseType = "blob";
          xhr.onload = function() {
              const fileName = "bookroll"+String(sources.indexOf(src))+".jpg";
              resolve({ data: this.response, fileName: fileName });
          };
          xhr.onerror = () => resolve({ data: null });
          xhr.onabort = () => resolve({ data: null });
          xhr.ontimeout = () => resolve({ data: null });
          xhr.send();
      })
  );
  const images = await Promise.all(imagePromises);
  let zip = new JSZip();
  const folderName = "bookroll_imgs";
  let folder = zip.folder(folderName);
  images.forEach(image => {
      if (image.data && image.fileName) {
          folder.file(image.fileName, image.data);
      }
  });
  zip.generateAsync({ type: "blob" }).then(blob => {
      let dlLink = document.createElement("a");
      const dataUrl = URL.createObjectURL(blob);
      dlLink.href = dataUrl;
      dlLink.download = `${folderName}.zip`;
      document.body.insertAdjacentElement("beforeEnd", dlLink);
      dlLink.click();
      dlLink.remove();
      setTimeout(function() {
          window.URL.revokeObjectURL(dataUrl);
      }, 1000);
  });
}

//base64形式の画像データを格納するための空配列
let ar = [];
if (chips==1){
  //1ページだけだとbase64にしなくてよかったので直にpngをダウンロード
  let link = document.createElement("a");
  link.href = canvas.toDataURL();
  link.download = "bookroll_img.png";
  link.click();
} else {
  //複数ページの場合こっち。ゆっくりやらないとダウンロードしないのでsleepで遅延
  for(let step=0; step < chips; step++){
    data = canvas.toDataURL("image/png");
    ar.push(data);
    await _sleep(1000);
    button.click();
    await _sleep(1000);
  }
  downloadImages();
}
```

4. ちょっと待つとzipファイルなりpngファイルがダウンロードされます。zipファイルなら中身はスライドをpng画像にしたもの。
4. zipファイルを展開してすべての画像を選択、印刷->プリンターで「Microsoft Print to PDF」を選んで印刷してください。
4. 好きな名前にしてPDFとして保存できます。


## 補足
* ダウンロードが始まらないときはページを再読み込みしてからもう1度試してみてください。
* 環境はwindows10,ブラウザはChrome(ver.89.0.4389.114)で動作することを想定しています。
* ダウンロードしたやつを再配布するのは禁止、あくまで個人利用に留めて。
* このコードを用いたことで不利益が生じても責任は負いません。自己責任でお願いします。
* エラー・動かない等あったら[こちら](https://twitter.com/i_am_kimshow)か、ここにコメントするかissueとかでメッセージを。


## 参考
1. [bookrollからpdfをつくるメモ](https://gist.github.com/watagashi0619/40ba179c9ef7d585246c47c31dab67ed)
1. [HTML5 の canvas 要素を base64 文字列化し画像として保存する方法まとめ](https://qiita.com/clockmaker/items/924b5b4228484e7a09f0)
1. [javascriptでsleep的に処理をwaitさせる方法(コピペでOK)](https://hirooooo-lab.com/development/javascript-sleep/#index_id1)
1. [【JavaScript】動的にid属性を追加する方法](https://konoti.com/website/javascript/dynamic-id.html)
