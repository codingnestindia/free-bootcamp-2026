const transactionsBody = document.getElementById("transactionsBody");
const descriptionInput = document.getElementById("expenseDescription");
const amountInput = document.getElementById("expenseAmount");
const categoryInput = document.getElementById("expenseCategory");
const form = document.getElementById("expenseForm");

// Cards 
const totalSpending = document.getElementById("totalSpending");
const monthSpending = document.getElementById("monthSpending");
const avgTransaction = document.getElementById("avgTransaction");
const totalTransactions = document.getElementById("totalTransactions");
const transactionCount = document.getElementById("transactionCount");

// Chart element
const categoryChart = document.getElementById("categoryChart");

// Initialize expenses from localStorage
let totalExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Update cards function
function updateCards() {
  let total = 0;
  let monthTotal = 0; 
  let currentMonth = new Date().getMonth(); 
  let currentYear = new Date().getFullYear(); 
  
  totalExpenses.forEach(expense => {
    let amount = Number(expense.amount);
    total += amount;

    let expenseDate = new Date(expense.date);
    let expenseMonth = expenseDate.getMonth(); 
    let expenseYear = expenseDate.getFullYear(); 

    if (expenseMonth === currentMonth && expenseYear === currentYear) {
      monthTotal += amount;
    }
  });

  let avg = totalExpenses.length > 0 ? (total / totalExpenses.length).toFixed(2) : 0;

  totalSpending.textContent = "₹" + total.toFixed(2);
  monthSpending.textContent = "₹" + monthTotal.toFixed(2);
  avgTransaction.textContent = "₹" + avg;
  totalTransactions.textContent = totalExpenses.length;
  transactionCount.textContent = totalExpenses.length + " transaction" + (totalExpenses.length !== 1 ? 's' : '');
}

// Add Transaction
function addTransaction(date, description, category, amount) {
  totalExpenses.push({
    date,
    description,
    category,
    amount: Number(amount).toFixed(2)
  });
  updateCards();
  localStorage.setItem("expenses", JSON.stringify(totalExpenses));
  displayTransactions();
  updateCategoryChart();
}

// Form submit event
form.addEventListener("submit", function(event) {
  event.preventDefault();
  
  let description = descriptionInput.value.trim();
  let amount = amountInput.value.trim();
  let category = categoryInput.value;

  if (!description) {
    alert("Please enter a description");
    return;
  }
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    alert("Please enter a valid amount");
    return;
  }
  if (!category) {
    alert("Please select a category");
    return;
  }

  addTransaction(new Date().toLocaleDateString(), description, category, amount);
  
  // Clear form
  descriptionInput.value = "";
  amountInput.value = "";
  categoryInput.value = "Food"; // Set default
});

// Display Transactions
function displayTransactions() {
  transactionsBody.innerHTML = "";
  
  if (totalExpenses.length === 0) {
    document.getElementById("emptyState").classList.remove("d-none");
  } else {
    document.getElementById("emptyState").classList.add("d-none");
    
    totalExpenses.forEach((transaction, index) => {
      let row = document.createElement('tr');
      row.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.description}</td>
        <td><span class="badge bg-light text-dark">${transaction.category}</span></td>
        <td class="text-end fw-bold">₹${transaction.amount}</td>
        <td class="text-center">
          <button class="btn btn-sm delete-btn" onclick="deleteTransaction(${index})">
            <i class="fa-solid fa-trash text-danger"></i>
          </button>
        </td>
      `;
      transactionsBody.appendChild(row);
    });
  }
  
  updateCards();
}

// Delete Transaction (make it global)
window.deleteTransaction = function(index) {
  totalExpenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(totalExpenses));
  displayTransactions();
  updateCategoryChart();
};

// Update Category Chart
function updateCategoryChart() {
  // Calculate category totals
  const categoryTotals = {
    'Food': 0,
    'Transport': 0,
    'Shopping': 0,
    'Entertainment': 0,
    'Utilities': 0,
    'Other': 0
  };

  totalExpenses.forEach(expense => {
    if (categoryTotals.hasOwnProperty(expense.category)) {
      categoryTotals[expense.category] += Number(expense.amount);
    } else {
      categoryTotals['Other'] += Number(expense.amount);
    }
  });

  // Prepare data for chart
  const labels = Object.keys(categoryTotals).filter(cat => categoryTotals[cat] > 0);
  const data = labels.map(label => categoryTotals[label]);
  
  const backgroundColors = [
    'rgb(239, 63, 101)',   // Food
    'rgb(58, 148, 208)',   // Transport
    'rgb(241, 182, 44)',   // Shopping
    'rgb(146, 101, 236)',  // Entertainment
    'rgb(66, 213, 213)',   // Utilities
    'rgb(213, 127, 42)'    // Other
  ];

  // If no expenses, show placeholder data
  if (totalExpenses.length === 0) {
    labels.push('No Data');
    data.push(1);
  }

  // Destroy existing chart if it exists
  if (window.myCategoryChart) {
    window.myCategoryChart.destroy();
  }

  // Create new chart
  const newChart = categoryChart.getContext('2d');
  window.myCategoryChart = new Chart(newChart, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15
          }
        }
      }
    }
  });
}

// Initial display
displayTransactions();
updateCategoryChart();