document.getElementById("checkButton").addEventListener("click", async () => {
  const url = document.getElementById("urlInput").value;
  if (!url) return alert("Введите URL");

  const res = await fetch("/vt/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  const data = await res.json();
  document.getElementById("result").innerText = 
    `Malicious: ${data.malicious}, Harmless: ${data.harmless}, Suspicious: ${data.suspicious}, Undetected: ${data.undetected}`;
});