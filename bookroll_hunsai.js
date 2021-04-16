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
              const fileName = "bookroll"+String(sources.indexOf(src))+".png";
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