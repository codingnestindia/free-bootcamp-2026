const POLLINATIONS_API = "https://gen.pollinations.ai/v1/chat/completions";

const instructions = {
  short: "Summarize the following article in 2-3 concise lines.",
  medium: "Summarize the following article in 5 clear bullet points.",
  detailed: "Provide a detailed 10-12 line summary of the following article.",
};
const wordCount = document.getElementById("Count");
const btn = document.getElementById("result-btn");
const inputText = document.getElementById("inputText");

function updateCount() {
  const text = document.getElementById("inputText").value.trim();
  const count = text ? text.split(" ").length : 0;
  wordCount.innerText = count + " words";
  return count;
}
inputText.addEventListener("input", updateCount);

async function UpdateSummery() {
  const text = document.getElementById("inputText").value.trim();
  const resultBox = document.getElementById("result-box");
  const type = document.querySelector('input[name="length"]:checked').value;

  if (!text) {
    alert("Please enter some text first!");
    return;
  }else{
    resultBox.innerHTML = "<p>Generate summary...</p>";
  }
  
  try {
    const API_KEY = "pk_6wE9iNWPRd9FhR6P";
    const body = {
      model: "openai",
      messages: [
        { role: "system", content: "You are a helpful article summarizer. Respond only with the summary, no extra commentary." },
        { role: "user", content: instructions[type] + "\n\n" + text }
      ]
    };
    const headers = { "Content-Type": "application/json" };
    if (API_KEY) headers["Authorization"] = "Bearer " + API_KEY;

    const response = await fetch(POLLINATIONS_API,{
      method: "POST",
    headers: headers,
    body: JSON.stringify(body)
    });
    
    const data = await response.json();
    console.log(data);
    const summary =
    data.choices?.[0]?.message?.content;
    resultBox.innerHTML = `<p>${summary}</p>`;
    }
   catch (error) {
    console.error(error);
    resultBox.innerHTML = `<p style="color:red;">Error generating summary</p>`;
  }
}

