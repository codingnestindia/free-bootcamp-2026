let expenses = [];

const form = document.querySelector(".form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const totalSpending = document.querySelector(".spending b");
const totalMonth = document.querySelector(".calendar b");
const avgTransaction = document.querySelector(".average b");
const transactionCount = document.querySelector(".transaction b");
const container = document.querySelector(".history"); 
const noHistory = document.querySelector(".display");
const countText = document.getElementById("p");
const ctx = document.getElementById("myChart");

let table = null;

const myChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Food','Travel','Bills','Entertainment','Shopping','Healthcare','Others'],
    datasets: [{
      label: 'Expenses by Category',
      data: [0,0,0,0,0,0,0],
      backgroundColor: ['red','blue','green','orange','pink','yellow','purple']
    }]
  },
  options: { responsive: true } 
  
});



form.addEventListener("submit", function(e) {
    e.preventDefault();

    const desc = description.value.trim();
    const amt = parseFloat(amount.value);
    const cat = category.value.toLowerCase();

    if (!desc || amt <= 0) return;

    const expense = {
        id: Date.now(),
        description: desc,
        amount: amt,
        category: cat,
        date: new Date().toLocaleDateString()
    };

    expenses.push(expense);

    updateDashboard();
    renderTransactions();
    updateChart();

    form.reset();
});



function updateDashboard() {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const count = expenses.length;
    const avg = count ? total / count : 0;

    totalSpending.textContent = "₹" + total.toFixed(2);
    totalMonth.textContent = "₹" + total.toFixed(2);
    avgTransaction.textContent = "₹" + avg.toFixed(2);
    transactionCount.textContent = count;

    countText.textContent = count + " Transaction" + (count !== 1 ? "s" : "");
}


function renderTransactions() {
    noHistory.style.display = expenses.length ? "none" : "flex";

    if (expenses.length === 0 && table) {
        table.remove();
        table = null;
        return;
    }

    if (!table && expenses.length) {
        table = document.createElement("table");
        table.classList.add("transaction-table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";

        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr style="background:#f0f0f0">
                <th style="padding:8px; border-bottom:1px solid #ddd">Date</th>
                <th style="padding:8px; border-bottom:1px solid #ddd">Description</th>
                <th style="padding:8px; border-bottom:1px solid #ddd">Category</th>
                <th style="padding:8px; border-bottom:1px solid #ddd">Amount (₹)</th>
                <th style="padding:8px; border-bottom:1px solid #ddd">Action</th>
            </tr>
        `;
        const tbody = document.createElement("tbody");
        tbody.classList.add("transactions-list");

        table.appendChild(thead);
        table.appendChild(tbody);
        container.appendChild(table);
    }

    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    expenses.forEach(exp => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="padding:8px; border-bottom:1px solid #ddd">${exp.date}</td>
            <td style="padding:8px; border-bottom:1px solid #ddd">${exp.description}</td>
            <td style="padding:8px; border-bottom:1px solid #ddd">${exp.category}</td>
            <td style="padding:8px; border-bottom:1px solid #ddd">₹${exp.amount.toFixed(2)}</td>
            <td style="padding:8px; border-bottom:1px solid #ddd; cursor:pointer; color:red;">
                <i class="fa-solid fa-trash" onclick="deleteTransaction(${exp.id})"></i>
            </td>
        `;
        tbody.appendChild(row);
    });
}
function updateChart() {
    const categories = ['food','travel','bills','entertainment','shopping','healthcare','others'];
    const data = { food:0, travel:0, bills:0, entertainment:0, shopping:0, healthcare:0, others:0 };

    expenses.forEach(exp => {
        const cat = exp.category.toLowerCase();
        if(data[cat] !== undefined) data[cat] += exp.amount;
        else data['others'] += exp.amount;
    });

    myChart.data.datasets[0].data = categories.map(cat => data[cat]);
    myChart.update();
}
function deleteTransaction(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    updateDashboard();
    renderTransactions();
    updateChart();
}