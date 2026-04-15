const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateUI() {
list.innerHTML = "";

let amounts = transactions.map(t => t.amount);

let total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
let inc = amounts.filter(a => a > 0).reduce((acc, a) => acc + a, 0).toFixed(2);
let exp = (
amounts.filter(a => a < 0).reduce((acc, a) => acc + a, 0) * -1
).toFixed(2);

balance.textContent = total;
income.textContent = inc;
expense.textContent = exp;

transactions.forEach((transaction, index) => {
const li = document.createElement("li");

li.innerHTML = `
${transaction.text} <span>₹${transaction.amount}</span>
<button onclick="removeTransaction(${index})">❌</button>
`;

list.appendChild(li);
});

localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addTransaction(e){
e.preventDefault();

const newTransaction = {
text: text.value,
amount: +amount.value
};

transactions.push(newTransaction);

text.value = "";
amount.value = "";

updateUI();
}

function removeTransaction(index){
transactions.splice(index,1);
updateUI();
}

form.addEventListener("submit", addTransaction);

updateUI();