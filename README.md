# QR Security Scanner

Веб-приложение для проверки безопасности QR-кодов через VirusTotal API.

## Структура проекта

- `server.js` — сервер Node.js
- `src/` — фронтенд (index.html, script.js, style.css)
- `.gitignore` — исключения для Git
- `package.json` — зависимости и скрипты

## Переменные окружения

Создайте `.env`:

```
VIRUSTOTAL_API_KEY=ваш_ключ
```

## Запуск локально

```bash
npm install
npm start
```

Открой `http://localhost:3000`