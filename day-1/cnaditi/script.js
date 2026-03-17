
let balance = 0;
let transactionCount = 0;
const categoryTotals = {};
let myChart;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const form = document.getElementById("expenseform");
const descriptionInput = document.getElementById("descInput");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");

const tableBody = document.getElementById("transactionTable");
const totalspendEl = document.getElementById("totalspend");
const monthlyspendEl = document.getElementById("monthlyspend");
const AvgtransactionEl = document.getElementById("Avgtransaction");
const transactionEl = document.getElementById("transaction");

function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function calculateTotals() {
    balance = 0;
    transactionCount = 0;
    Object.keys(categoryTotals).forEach(key => delete categoryTotals[key]);
    transactions.forEach(t => {
        balance += t.amount;
        transactionCount++;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    updateUI();
}

function updateUI() {
    totalspendEl.textContent = `₹${balance}`;
    transactionEl.textContent = transactionCount;
    monthlyspendEl.textContent = `₹${balance}`;
    const avg = transactionCount > 0 ? balance / transactionCount : 0;
    AvgtransactionEl.textContent = `₹${avg.toFixed(2)}`;
    updateChart();
}

function populateTable() {
    tableBody.innerHTML = '';
    transactions.forEach((t, index) => {
        const row = document.createElement("tr");
        row.setAttribute('data-index', index);
        row.innerHTML = `
<td>${t.date}</td>
<td>${t.description}</td>
<td>${t.category}</td>
<td>₹${t.amount}</td>
<td><i class="fa-solid fa-delete-left deleteicon"></i></td>
`;
        tableBody.appendChild(row);
        const deletbtn = row.querySelector(".deleteicon");
        deletbtn.addEventListener("click", function() {
            transactions.splice(index, 1);
            saveData();
            calculateTotals();
            populateTable();
        });
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    const description = descriptionInput.value;
    const amount = Number(amountInput.value);
    const category = categoryInput.value;

    if (!description || !amount || category === "Select category") {
        alert("Please fill in all fields correctly.");
        return;
    }

    const today = new Date().toLocaleDateString();

    transactions.push({ date: today, description, amount, category });
    saveData();
    calculateTotals();
    populateTable();
    form.reset();
});

function updateChart() {
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = data;
    myChart.update();
}

// Initialize the chart
const ctx = document.getElementById('myChart').getContext('2d');
myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(201, 203, 207)'
            ],
            hoverOffset: 4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Spending by Category'
            }
        }
    }
});

// Load data on page load
calculateTotals();
populateTable();


