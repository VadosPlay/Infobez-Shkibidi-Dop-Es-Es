const express = require("express");
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

const VIRUSTOTAL_API_KEY = "2d85b8429c36a12240ad21b2f2f6301cd8eda42ce505efecf6a9cf119e634804";

app.post("/vt/scan", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL отсутствует" });

    const resp = await fetch("https://www.virustotal.com/api/v3/urls", {
      method: "POST",
      headers: {
        "x-apikey": VIRUSTOTAL_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `url=${encodeURIComponent(url)}`
    });
    const data = await resp.json();
    const scanId = data.data.id;

    let report;
    for (let i = 0; i < 5; i++) {
      const r = await fetch(`https://www.virustotal.com/api/v3/analyses/${scanId}`, {
        headers: { "x-apikey": VIRUSTOTAL_API_KEY }
      });
      report = await r.json();
      if (report.data.attributes.status === "completed") break;
      await new Promise(r => setTimeout(r, 2000));
    }

    const stats = report.data.attributes.stats;
    res.json({
      harmless: stats.harmless,
      malicious: stats.malicious,
      suspicious: stats.suspicious,
      undetected: stats.undetected
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка проверки" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
