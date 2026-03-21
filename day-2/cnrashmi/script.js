const POLLINATIONS_API = "https://gen.pollinations.ai/v1/chat/completions";

const instructions = {
  short: "Summarize the following article in 2-3 concise lines.",
  medium: "Summarize the following article in 5 clear bullet points.",
  detailed: "Provide a detailed 10-12 line summary of the following article."
};

let selectedType = "";

function setPlaceholderVisible(visible) {
  const placeholder = document.querySelector(".summary-box p");
  const hint = document.querySelector(".summary-box span");
  if (placeholder) placeholder.style.display = visible ? "" : "none";
  if (hint) hint.style.display = visible ? "" : "none";
}

const buttons = document.querySelectorAll(".option");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const radio = btn.querySelector("input");
    radio.checked = true;

    selectedType = radio.value;
  });
});

async function generateSummary() {
  const text = document.getElementById("article-input").value;
  const summaryType = selectedType || "medium";

  const loading = document.getElementById("loading");
  const btn = document.querySelector(".btn");
  const output = document.querySelector(".article-output");
  const wordCount = document.getElementById("word-count");

  const apiKey = "pk_CWfi3duYHaFMpgQk";

  if (!text) {
    alert("Please paste article");
    setPlaceholderVisible(true);
    return;
  }

  if (!selectedType) {
    alert("Please select summary type");
    setPlaceholderVisible(true);
    return;
  }

  setPlaceholderVisible(false);

  const words = text.trim().split(/\s+/).length;
  wordCount.innerText = `${words} words`;

  if (loading) loading.innerText = "Generating summary...";
  output.innerHTML = "";
  btn.disabled = true;

  try {
    const res = await fetch(POLLINATIONS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "openai",
        messages: [
          {
            role: "system",
            content: "You are a helpful article summarizer. Respond only with the summary."
          },
          {
            role: "user",
            content: instructions[summaryType] + "\n\n" + text
          }
        ]
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const summary = data?.choices?.[0]?.message?.content;

    if (!summary) {
      output.innerText = "No summary found";
      setPlaceholderVisible(true);
      return;
    }

    output.innerHTML = "";

    new Typed(".article-output", {
      strings: [summary],
      typeSpeed: 15
    });

  } catch (err) {
    output.innerText = "Error: " + err.message;
    console.error(err);
    setPlaceholderVisible(true);
  }

  if (loading) loading.innerText = "";
  btn.disabled = false;
}

document.querySelector(".btn").addEventListener("click", generateSummary);

function copyText() {
  const text = document.querySelector(".article-output").innerText.trim();
  if (!text) return alert("Nothing to copy yet!");
  navigator.clipboard.writeText(text).then(() => alert("Copied!"));
}