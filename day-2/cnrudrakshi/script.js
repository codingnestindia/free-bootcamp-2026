const POLLINATIONS_API = "https://gen.pollinations.ai/v1/chat/completions";

const instructions = {
  short: "Summarize the following article in 2-3 concise lines.",
  medium: "Summarize the following article in 5 clear bullet points.",
  detailed: "Provide a detailed 10-12 line summary of the following article."
};

let selectedType = "";
const buttons = document.querySelectorAll(".select-btn");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedType = btn.getAttribute("data-value");
    console.log("Selected:", selectedType);
  });
});

async function generateSummary() {
  const text = document.getElementById("inputText").value;
  const summaryType = selectedType || "short";
  const loading = document.getElementById("loading");
  const btn = document.getElementById("generateBtn");
  const output = document.getElementById("output");
  const wordsCount = document.getElementById("wordsCount");

  const copyBtn = document.getElementById("copy-btn");

  if (!text) {
    alert("Please paste article");
    return;
  }
  if (!selectedType) {
    alert("Please select summary type");
    return;
  }
const wordCount = text.trim().split(/\s+/).length;
wordsCount.innerText = wordCount;
  loading.innerText = "Generating summary...";
  output.innerText = "";
  btn.disabled = true;
  const apiKey = "pk_wToX4GFmKU6IFucb";
  try {
    const res = await fetch(POLLINATIONS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "openai",
        messages: [{
            role: "system",
            content: "You are a helpful article summarizer. Respond only with the summary, no extra commentary."
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
    const summary = data.choices[0].message.content;
    output.innerText = summary;
    output.innerHTML = "";

    new Typed('#output', {
      strings: [summary],
      typeSpeed: 15,
      showCursor: false,
      onComplete: () => {
    const note = document.createElement("p");
       note.style.marginTop = "15px";
    note.style.fontSize = "0.9em";
    note.style.color = "#1a3c6e";
    note.style.padding = "10px";
   note.style.border = "1px solid #7ec5ee";
    note.style.borderRadius = "12px";
    note.style.backgroundColor = "#e6f4ff";
    note.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
    note.innerText = "Note: This is a mock summary. To use real AI, replace the mock function with an actual API call to OpenAI or HuggingFace. See the code comments for implementation details.";
    document.getElementById("output").appendChild(note);
  }
    });
  } catch (err) {
    output.innerText = "Error: " + err.message;
    console.error(err);
  }
  loading.innerText = "";
  btn.disabled = false;
}

copyBtn.addEventListener("click", copyText);

  function copyText() {
    const text = document.getElementById("output").innerText.trim();
    if (!text) return alert("Nothing to copy yet!");
    navigator.clipboard.writeText(text).then(() => alert("Copied!"));
  }