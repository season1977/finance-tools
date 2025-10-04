
const trackerApp = document.getElementById("trackerApp");
const converterApp = document.getElementById("converterApp");
const appSelect = document.getElementById("appSelect");

function showApp(appName) {
  trackerApp.classList.remove("active");
  converterApp.classList.remove("active");

  trackerApp.style.display = "none";
  converterApp.style.display = "none";

  if (appName === "tracker") {
    trackerApp.style.display = "block";
    setTimeout(() => trackerApp.classList.add("active"), 10);
  } else {
    converterApp.style.display = "block";
    setTimeout(() => converterApp.classList.add("active"), 10);
  }
}

appSelect.addEventListener("change", (e) => showApp(e.target.value));
showApp(appSelect.value); 

let expenses = [];

function addExpense() {
  const name = document.getElementById("expenseName").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const currency = document.getElementById("expenseCurrency").value;

  if (!name || isNaN(amount)) {
    alert("Please enter valid name and amount");
    return;
  }

  expenses.push({ name, amount, currency });
  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";
  updateExpenseList();
}

function updateExpenseList() {
  const list = document.getElementById("expenseList");
  list.innerHTML = "";
  let total = 0;

  expenses.forEach((expense, index) => {
    total += expense.amount;
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${expense.name} - ${expense.currency} ${expense.amount.toFixed(2)}</span>
      <div>
        <button class="edit" onclick="editExpense(${index})">Edit</button>
        <button class="delete" onclick="deleteExpense(${index})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });

  document.getElementById("total").textContent = total.toFixed(2);
}

function editExpense(index) {
  const expense = expenses[index];
  document.getElementById("expenseName").value = expense.name;
  document.getElementById("expenseAmount").value = expense.amount;
  document.getElementById("expenseCurrency").value = expense.currency;
  deleteExpense(index);
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateExpenseList();
}

const exchangeRates = {
  USD: { NGN: 1600, GBP: 0.8, INR: 83, GHS: 15, EUR: 0.92 },
  NGN: { USD: 0.00063, GBP: 0.0005, INR: 0.052, GHS: 0.0094, EUR: 0.00057 },
  GBP: { USD: 1.25, NGN: 2000, INR: 104, GHS: 18, EUR: 1.15 },
  INR: { USD: 0.012, NGN: 19, GBP: 0.0096, GHS: 0.17, EUR: 0.011 },
  GHS: { USD: 0.067, NGN: 106, GBP: 0.056, INR: 6, EUR: 0.063 },
  EUR: { USD: 1.09, NGN: 1750, GBP: 0.87, INR: 95, GHS: 16, }
};
async function convertCurrency() {
  const amount = parseFloat(document.getElementById("convertAmount").value);
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;

  if (isNaN(amount)) {
    alert("Please enter a valid amount");
    return;
  }

  if (from === to) {
    document.getElementById("convertedResult").textContent = amount.toFixed(2);
    return;
  }

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await response.json();

    if (!data.rates || !data.rates[to]) {
      alert("Conversion failed. Currency not supported.");
      return;
    }

    const rate = data.rates[to];
    const result = amount * rate;
    document.getElementById("convertedResult").textContent = result.toFixed(2);
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    alert("Failed to fetch exchange rate. Please check your connection.");
  }
}
