const form = document.getElementById("form");
const list = document.getElementById("list");
const balance = document.getElementById("balance");
const monthFilter = document.getElementById("monthFilter");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart;

/* Add Transaction */
form.addEventListener("submit", e => {
e.preventDefault();

const item = {
amount: +amount.value,
category: category.value,
date: date.value
};

transactions.push(item);

save();
render();
form.reset();
});

/* Save */
function save() {
localStorage.setItem("transactions", JSON.stringify(transactions));
}

/* Render */
function render() {
list.innerHTML = "";

let filtered = transactions;

if (monthFilter.value !== "all") {
filtered = transactions.filter(t => t.date === monthFilter.value);
}

let total = filtered.reduce((a, b) => a + b.amount, 0);
balance.textContent = total.toFixed(2);

filtered.forEach((t, i) => {
list.innerHTML += `
<li>
${t.category}
<span>₹${t.amount}</span>
</li>`;
});

loadMonths();
drawChart(filtered);
}

/* Load Month Options */
function loadMonths() {
let months = [...new Set(transactions.map(t => t.date))];

monthFilter.innerHTML = `<option value="all">All Months</option>`;

months.forEach(m => {
monthFilter.innerHTML += `<option value="${m}">${m}</option>`;
});
}

/* Filter */
monthFilter.addEventListener("change", render);

/* Chart */
function drawChart(data) {
let expenses = data.filter(t => t.amount < 0);

let cats = {};

expenses.forEach(t => {
cats[t.category] = (cats[t.category] || 0) + Math.abs(t.amount);
});

if (chart) chart.destroy();

chart = new Chart(document.getElementById("chart"), {
type: "pie",
data: {
labels: Object.keys(cats),
datasets: [{
data: Object.values(cats)
}]
}
});
}

/* CSV Export */
function downloadCSV() {
let csv = "Category,Amount,Month\n";

transactions.forEach(t => {
csv += `${t.category},${t.amount},${t.date}\n`;
});

let blob = new Blob([csv], { type: "text/csv" });
let a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "transactions.csv";
a.click();
}

/* Dark Mode */
document.getElementById("themeBtn").onclick = () => {
document.body.classList.toggle("dark");
};

render();