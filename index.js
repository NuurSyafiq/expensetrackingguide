const expenseForm = document.getElementById("expense-form"); //expense form
const expensesList = document.getElementById("expenses"); //where expenses will be displayed
const totalAmount = document.getElementById("total-amount"); //where summary will be shown
const filterCategory = document.getElementById("filterCategory");
const filterButton = document.getElementById("filterButton");

let expenses = [];


filterButton.addEventListener("click", () => {
  const category = filterCategory.value; // Get selected category

  if (category === "") {
    displayExpenses(); // Show all expenses if no category selected
  } else {
    displayFilteredExpenses(category); // Show filtered results
  }
});




//prevents the form from refreshing after submit
expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  //name the form values
  const name = document.getElementById("expenseName").value;
  const amount = parseFloat(document.getElementById("expenseAmt").value);
  const date = document.getElementById("expenseDate").value;
  const category = document.getElementById("expenseCat").value;

  if (editingId !== null) {
    // update the existing expense
    const expense = expenses.find((exp) => exp.id === editingId);
    expense.name = name;
    expense.amount = amount;
    expense.date = date;
    expense.category = category;

    editingId = null;

    document.querySelector('button[type="submit"]').textContent = "Add Expense";
  } else {
    
    const newExpense = {
      id: Date.now(),
      name,
      amount,
      date,
      category,
    };

    expenses.push(newExpense);
  }

  displayExpenses(); //diplay all expenses
  updateTotal(); //updates and siplay the total amount

  expenseForm.reset(); //method to reset form after submit
});

function displayExpenses() {
  expensesList.innerHTML = ""; //clear list to avoid duplicate

  expenses.forEach((expense) => {
    const li = document.createElement("li");
    li.innerHTML = `${expense.name} - $${expense.amount.toFixed(2)} - ${
      expense.date
    } (${expense.category})
<button onclick="deleteExpense(${expense.id})">Delete</button>
<button onclick="editExpense(${expense.id})">Edit</button>`;

    expensesList.appendChild(li);
  });
}

function displayFilteredExpenses(category) {
  const filteredExpenses = filterExpensesByCategory(category); // Use return value here

  expensesList.innerHTML = ""; // Clear current list

  filteredExpenses.forEach((expense) => {
    const li = document.createElement("li");
    li.innerHTML = `${expense.name} - $${expense.amount.toFixed(2)} - ${
      expense.date
    } (${expense.category})
    <button onclick="deleteExpense(${expense.id})">Delete</button>
    <button onclick="editExpense(${expense.id})">Edit</button>`;

    expensesList.appendChild(li);
  });
}

function updateTotal() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalAmount.textContent = total.toFixed(2); // display the total amount
}

function deleteExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id); // delete expense by id

  displayExpenses(); // refresh the list
  updateTotal(); // recalculate the total
}

function filterExpensesByCategory(category) {
  return expenses.filter((expense) => expense.category === category);
}

let editingId = null;

function editExpense(id) {
  const expense = expenses.find((exp) => exp.id === id);

  document.getElementById("expenseName").value = expense.name;
  document.getElementById("expenseAmt").value = expense.amount;
  document.getElementById("expenseDate").value = expense.date;
  document.getElementById("expenseCat").value = expense.category;

  document.querySelector('button[type="submit"]').textContent =
    "Update Expense";

  editingId = id;
}


const API_KEY = '672f487f90484486ab2aa87a6c72b338';
const API_URL = `https://api.currencyfreaks.com/latest?apikey=${API_KEY}`;



function fetchCurrencyRates() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log the data to inspect it
      if (data && data.rates) {
         rates = data.rates;
        displayCurrencyRates(rates); // Call function to display rates
      } else {
        console.error("No rates found in the API response");
      }
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}

function displayCurrencyRates(rates) {
  const currencyDisplay = document.getElementById("currency-rates");
  currencyDisplay.innerHTML = ""; // Clear any existing content

  // Display selected currencies (you can adjust this list)
  const selectedCurrencies = [ "SGD", "THB", "IDR", "MYR", "VND", "PHP", "BND",
  "CNY", "JPY", "KRW", "HKD", "TWD",
  "AUD", "NZD", "FJD",
  "INR", "PKR", "LKR", "BDT",
  "AED", "SAR", "QAR", "KWD", "ILS",
  "EUR", "GBP", "CHF", "SEK", "NOK", "DKK", "HUF", "CZK", "PLN", "RUB", 
  "TRY", "RON", "HRK", "BGN", "HRK",
  "ZAR", "EGP", "NGN", "KES", "MAD", "TZS", "GHS", "UGX", "CDF", "SDG",
  "USD", "CAD", "MXN",
  "BRL", "ARS", "COP", "CLP", "PEN"]; // Example: USD, EUR, GBP, SGD

  selectedCurrencies.forEach(currency => {
    if (rates[currency]) {
      const listItem = document.createElement("li");
      listItem.textContent = `${currency}: ${rates[currency]}`;
      currencyDisplay.appendChild(listItem);
    }
  });
}

document.getElementById("currency-search").addEventListener("input", function(event) {
  const searchQuery = event.target.value.toUpperCase(); // Convert to uppercase for case-insensitivity
  const filteredRates = filterRatesBySearch(searchQuery);
  displayCurrencyRates(filteredRates); // Update displayed rates based on search
});

function filterRatesBySearch(query) {
  const filteredRates = {};

  // Only include rates that match the search query
  for (const [currency, rate] of Object.entries(rates)) {
    if (currency.toUpperCase().includes(query)) {
      filteredRates[currency] = rate;
    }
  }

  return filteredRates;
}

window.onload = function() {
  fetchCurrencyRates(); // Fetch the rates when the page loads
};

document.getElementById("search-button").addEventListener("click", function() {
  const searchQuery = document.getElementById("currency-search").value.toUpperCase();
  if (searchQuery) {
    const filteredRates = filterRatesBySearch(searchQuery);
    displayCurrencyRates(filteredRates); // Show filtered rates
  } else {
    displayCurrencyRates(rates); // Show all rates if search is empty
  }
});
