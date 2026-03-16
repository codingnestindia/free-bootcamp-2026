const expenseTable = document.getElementById("expenseBody");
const titleInput = document.getElementById("titleInput");;
const amountInput = document.getElementById("amountInput");
const cateogryInput = document.getElementById("dropdownSelector");

const form = document.getElementById("form")

// cards
const totalSpending = document.getElementById("spendings");
const thisMonth = document.getElementById("growth");
const avgTransaction = document.getElementById("average");
const transactionCount = document.getElementById("transactions");
const tableTransactionCount = document.getElementById("tableTransactionCount");

let totalExpenses = JSON.parse(localStorage.getItem("expenses")) || [];


// upadte cards
function updatedCards(){
  let total = 0;
  let monthTotal = 0;
  let currentMonth = new Date().getMonth();
totalExpenses.forEach(expense =>{
  let amount = Number(expense.amount);
  total = total + amount;

  let expenseMonth = new Date(expense.date).getMonth();

  if(expenseMonth === currentMonth){
    monthTotal = monthTotal + amount;
  }
})
let avg;
  if(totalExpenses.length > 0){
  avg = (total / totalExpenses.length).toFixed(2);
}else{
  avg = 0;
}

  totalSpending.textContent = "₹ " + total;
  thisMonth.textContent = "₹" + monthTotal;
  avgTransaction.textContent = "₹" + avg;
  transactionCount.textContent = totalExpenses.length;
  tableTransactionCount.textContent = totalExpenses.length + " transactions";
}

displayTransactions();
// Add Transactions
function addTransaction(date, description, cateogry, amount) {
  totalExpenses.push({
    date,
    description,
    cateogry,
    amount
  });
  localStorage.setItem("expenses", JSON.stringify(totalExpenses));
  displayTransactions();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let title = titleInput.value;
  let amount = amountInput.value;
  let cateogry = cateogryInput.value;
  if (!title) {
    alert("Fill the description");
    return;
  }
  if (!amount) {
    alert("Fill the amount");
    return;
  }
  if (!cateogry) {
    alert("Fill the cateogry");
    return;
  }
  addTransaction(new Date().toLocaleDateString(), title, cateogry, amount);
  titleInput.value = "";
  amountInput.value = "";
  cateogryInput.value = "";
});

// Display Transactions
function displayTransactions() {
  expenseTable.innerHTML = "";
  totalExpenses.forEach((transactions,index) => {
    let row = document.createElement('tr');
    row.innerHTML = `
            <td>${transactions.date}</td>
              <td>${transactions.description}</td>
             <td>${transactions.cateogry}</td>
             <td>${transactions.amount}</td>
              <td class="text-center">
        <button class="btn btn-sm text-center delete-btn" onclick="deleteTransaction(${index})">
          <i class="fa-solid fa-trash text-danger"></i>
        </button>
      </td>
       `;
    expenseTable.appendChild(row);
  });
updatedCards();
}

// Delete Transaction
function deleteTransaction(index) {
  totalExpenses.splice(index,1);
  localStorage.setItem("expenses", JSON.stringify(totalExpenses));
  displayTransactions();
}

const data = {
  labels: ['Food', 'Travel', 'Bills', 'Entertainment', 'Shopping', 'Health Care', 'Others'],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100, 80, 120, 60, 40],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)',
      'rgb(220, 202, 232)',
      'rgb(255, 219, 181)',
      'rgb(213, 227, 188)',
      'rgb(254, 255, 181)'
    ],
    hoverOffset: 4
  }]
};

const config = {
  type: 'doughnut', 
  data: data
};

const ctx = document.getElementById('myChart');
new Chart(ctx, config);