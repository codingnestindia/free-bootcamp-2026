const input = document.getElementById("inputText");
const count = document.getElementById("Count");
const outputBox = document.getElementById("result-box");
const button = document.getElementById("result-btn");

// count
input.addEventListener("input",()=>{
    const text = input.value.trim();

    if (text === "") {
    count.innerText = "0 words";
    return;
  }

  let words = text.split(" ");
  count.innerText = words.length + " words";
});


// summary
button.addEventListener("click", function () {
  let text = input.value.trim();

  if (text === "") {
    outputBox.innerText = "Please enter the text";
    return;
  }
});