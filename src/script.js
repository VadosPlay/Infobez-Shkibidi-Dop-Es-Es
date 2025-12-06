
---

# 6️⃣ src/index.html

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>QR Security Scanner</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>QR Security Scanner</h1>

  <div class="controls">
    <input type="text" id="urlInput" placeholder="Вставьте URL из QR или буфера">
    <button id="checkButton">Проверить</button>
    <button id="cameraButton">Включить камеру</button>
    <button id="pasteButton">Вставить из буфера</button>
    <input type="file" id="fileInput" accept="image/*">
  </div>

  <video id="video" autoplay></video>
  <div id="result"></div>

  <h2>История проверок:</h2>
  <ul id="history"></ul>

  <script src="https://unpkg.com/qr-scanner/qr-scanner.min.js"></script>
  <script src="script.js"></script>
</body>
</html>
