const input = document.getElementById("text");
const wordCount = document.getElementById("count");
const output = document.querySelector(".summary-output");
const noData = document.querySelector(".no-data");


const API_URL = "https://gen.pollinations.ai/v1/chat/completions";

const API_KEY = "pk_Kv9VcE5pbB6sFqOd";

const CORS_PROXIES = [
  "https://corsproxy.io/?url=",
  "https://api.cors.lol/?url="
];


input.addEventListener("input", function () {
  const words = input.value
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0);

  wordCount.textContent = `${words.length} words`;
});

const instructions = {
  short: "Summarize this in 2-3 sentences.",
  medium: "Summarize this with key points.",
  long: "Provide a detailed summary with context."
};

function getSelectedLength() {
  const radios = document.getElementsByName("length");
  for (let r of radios) {
    if (r.checked) return r.value;
  }
  return null;
}

async function getSummary() {
  const text = input.value.trim();

  if (!text) {
    alert("Please paste an article first.");
    return;
  }

  const type = getSelectedLength();
  if (!type) {
  alert("Please select a summary length.");
  return;
}

  output.innerHTML = "<p>Generating summary...⏳</p>";
  noData.style.display = "none";

  const body = {
    model: "openai",
    messages: [
      {
        role: "system",
        content: "You are a helpful article summarizer. Respond only with the summary."
      },
      {
        role: "user",
        content: instructions[type] + "\n\n" + text
      }
    ]
  };

   const headers = { "Content-Type": "application/json" };
    if (API_KEY) headers["Authorization"] = "Bearer " + API_KEY;
    let lastError = "";
    for (const proxy of CORS_PROXIES) {
      try {
        const url = proxy + encodeURIComponent(API_URL);
        const res = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          lastError = `HTTP ${res.status}: ${await res.text()}`;
          continue;
        }

    const data = await res.json();
    console.log("API Response:", data);

    let summary =
      data?.choices?.[0]?.message?.content ||
      data?.response ||
      (typeof data === "string" ? data : null);

    if (!summary) {
      summary = "No summary generated.";
    }
output.textContent = summary;
return;
    
  } catch (err) {
    console.error(err);
    output.innerHTML = "<p>Error generating summary.</p>";
  }
    }
  }