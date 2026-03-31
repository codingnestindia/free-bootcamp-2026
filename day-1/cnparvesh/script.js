let descriptionInput = document.getElementById("description");
let amountInput = document.getElementById("amount");
let categoryInput = document.getElementById("category");
let addButton = document.getElementById("addExpenseBtn");
let tableBody = document.getElementById("transactionTable");
let totalSpending = document.getElementById("totalSpending");
let monthSpending = document.getElementById("monthSpending");
let avgTransaction = document.getElementById("avgTransaction");
let totalTransactions = document.getElementById("totalTransactions");
let transactionCount = document.getElementById("transactionCount");
let chartCanvas = document.getElementById("expenseChart");

let expenses = [];
let idCounter = 1;
let expenseChart = null;
addButton.addEventListener("click", addExpense);

function addExpense() {
  let description = descriptionInput.value;
  let amount = parseInt(amountInput.value);
  let category = categoryInput.value;

  if (description === "" || isNaN(amount)) {
    alert("Please enter valid data");
    return;
  }
  let expense = {
    id: idCounter++,
    date: moment().format("MMM DD, YYYY , hh:mm A"),
    description: description,
    category: category,
    amount: amount,
  };
  expenses.push(expense);
  updateTable();
  updateCards();
  updateChart();

  descriptionInput.value = "";
  amountInput.value = "";
}

function updateTable() {
  tableBody.innerHTML = "";
  expenses.forEach((expance) => {
    let row = `
        <tr>
        <td>${expance.id}</td>
        <td>${expance.date}</td>
        <td>${expance.description}</td>
        <td>${expance.category}</td>
        <td>${expance.amount}</td>
        <td>
    <i class="bi bi-trash text-danger"
    style="cursor:pointer"
    onclick="deleteExpense(${expance.id})"></i>
    </td>
        </tr>`;

    tableBody.innerHTML += row;
  });
}
function deleteExpense(id) {
  expenses = expenses.filter((expance) => expance.id !== id);
  updateTable();
  updateCards();
}

function updateCards() {
  let total = 0;
  expenses.forEach((expence) => {
    total += expence.amount;
  });
  let avg = expenses.length ? total / expenses.length : 0;
  totalSpending.innerText = "₹" + total;
  monthSpending.innerText = "₹" + total;
  avgTransaction.innerText = "₹" + avg;
  totalTransactions.innerText = expenses.length;
  transactionCount.innerText = expenses.length + " transactions";
}

function updateChart() {
  let food = 0,
    travel = 0,
    shopping = 0,
    bills = 0,
    entertainment = 0,
    other = 0;

  expenses.forEach((expense) => {
    if (expense.category === "food") food += expense.amount;
    else if (expense.category === "travel") travel += expense.amount;
    else if (expense.category === "shopping") shopping += expense.amount;
    else if (expense.category === "bills") bills += expense.amount;
    else if (expense.category === "entertainment")
      entertainment += expense.amount;
    else other += expense.amount;
  });

  if (expenseChart) {
    expenseChart.destroy();
  }
  expenseChart = new Chart(chartCanvas, {
    type: "pie",
    data: {
      labels: ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Other"],
      datasets: [
        {
          data: [food, travel, shopping, bills, entertainment, other],
        },
      ],
    },
  });
}
