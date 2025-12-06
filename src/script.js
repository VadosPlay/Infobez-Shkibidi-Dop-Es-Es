let historyList = [];

const urlInput = document.getElementById("urlInput");
const checkButton = document.getElementById("checkButton");
const cameraButton = document.getElementById("cameraButton");
const pasteButton = document.getElementById("pasteButton");
const resultDiv = document.getElementById("result");
const historyUl = document.getElementById("history");
const video = document.getElementById("video");

let scanning = false;
let stream = null;

// Проверка URL через сервер
async function checkURL(url) {
  const res = await fetch("/vt/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  const data = await res.json();
  return `Malicious: ${data.malicious}, Harmless: ${data.harmless}, Suspicious: ${data.suspicious}, Undetected: ${data.undetected}`;
}

// Добавление в историю
function addToHistory(url, status) {
  historyList.push({ url, status });
  const li = document.createElement("li");
  li.textContent = `${url} → ${status}`;
  historyUl.prepend(li);
}

// Кнопка проверки текста
checkButton.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url) return alert("Введите URL");
  const status = await checkURL(url);
  resultDiv.innerText = status;
  addToHistory(url, status);
});

// Вставка из буфера
pasteButton.addEventListener("click", async () => {
  const text = await navigator.clipboard.readText();
  urlInput.value = text;
});

// Камера для QR-кодов
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
      const status = await checkURL(result);
      resultDiv.innerText = status;
      addToHistory(result, status);
    });
    qrScanner.start();

  } catch (err) {
    alert("Не удалось включить камеру: " + err);
  }
});

// Подключаем библиотеку QrScanner через CDN
const script = document.createElement("script");
script.src = "https://unpkg.com/qr-scanner/qr-scanner.min.js";
document.body.appendChild(script);
