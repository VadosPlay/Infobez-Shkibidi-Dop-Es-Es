let historyList = [];

const urlInput = document.getElementById("urlInput");
const checkButton = document.getElementById("checkButton");
const cameraButton = document.getElementById("cameraButton");
const pasteButton = document.getElementById("pasteButton");
const fileInput = document.getElementById("fileInput");
const resultDiv = document.getElementById("result");
const historyUl = document.getElementById("history");
const video = document.getElementById("video");

let scanning = false;
let stream = null;

async function checkURL(url) {
  try {
    const res = await fetch("/vt/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (data.error) return data.error;
    return `Malicious: ${data.malicious}, Harmless: ${data.harmless}, Suspicious: ${data.suspicious}, Undetected: ${data.undetected}`;
  } catch (err) {
    return "Ошибка соединения с сервером";
  }
}

function addToHistory(url, status) {
  historyList.push({ url, status });
  const li = document.createElement("li");
  li.textContent = `${url} → ${status}`;
  historyUl.prepend(li);
}

checkButton.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url) return alert("Введите URL");
  resultDiv.innerText = "Проверка...";
  const status = await checkURL(url);
  resultDiv.innerText = status;
  addToHistory(url, status);
});

pasteButton.addEventListener("click", async () => {
  const text = await navigator.clipboard.readText();
  urlInput.value = text;
});

cameraButton.addEventListener("click", async () => {
  if (scanning) {
    stream.getTracks().forEach(track => track.stop());
    scanning = false;
    cameraButton.innerText = "Включить камеру";
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    scanning = true;
    cameraButton.innerText = "Выключить камеру";

    const qrScanner = new QrScanner(video, async result => {
      urlInput.value = result;
      resultDiv.innerText = "Проверка...";
      const status = await checkURL(result);
      resultDiv.innerText = status;
      addToHistory(result, status);
    });
    qrScanner.start();

  } catch (err) {
    alert("Не удалось включить камеру: " + err);
  }
});

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const qrScanner = new QrScanner(file, async result => {
    urlInput.value = result;
    resultDiv.innerText = "Проверка...";
    const status = await checkURL(result);
    resultDiv.innerText = status;
    addToHistory(result, status);
  });
  qrScanner.scanImage(file);
});