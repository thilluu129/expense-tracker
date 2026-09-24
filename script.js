// ==============================
// EXPENSE DATA
// ==============================

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];


// ==============================
// ADD EXPENSE
// ==============================

function addExpense() {

    const name = document.getElementById("expenseName").value.trim();
    const amount = document.getElementById("expenseAmount").value;
    const category = document.getElementById("expenseCategory").value;
    const date = document.getElementById("expenseDate").value;

    // Check fields
    if (name === "" || amount === "" || category === "" || date === "") {

        alert("Please fill all fields");

        return;
    }

    // Create expense
    const expense = {
        id: Date.now(),
        name: name,
        amount: Number(amount),
        category: category,
        date: date
    };

    // Add to array
    expenses.push(expense);

    // Save
    localStorage.setItem("expenses", JSON.stringify(expenses));

    // Clear form
    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseCategory").value = "";
    document.getElementById("expenseDate").value = "";

    // Display
    displayExpenses();
}


// ==============================
// DISPLAY EXPENSES
// ==============================

function displayExpenses() {

    const expenseList = document.getElementById("expenseList");

    expenseList.innerHTML = "";

    const searchElement = document.getElementById("searchExpense");
    const filterElement = document.getElementById("filterCategory");

    const searchText =
        searchElement ? searchElement.value.toLowerCase().trim() : "";

    const selectedCategory =
        filterElement ? filterElement.value : "All";

    let total = 0;
    let count = 0;

    expenses.forEach(function(expense) {

        // Search
        const matchesSearch =
            expense.name.toLowerCase().includes(searchText);

        // Category
        const matchesCategory =
            selectedCategory === "All" ||
            expense.category === selectedCategory;

        if (matchesSearch && matchesCategory) {

            total += expense.amount;
            count++;

            const li = document.createElement("li");

            li.className = "expense-item";

            li.innerHTML = `
                
                <div class="expense-info">

                    <h3>
                        ${expense.name} - ₹${expense.amount}
                    </h3>

                    <p>
                        ${expense.category} | ${expense.date}
                    </p>

                </div>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})">

                    Delete

                </button>

            `;

            expenseList.appendChild(li);
        }

    });


    // Update total
    document.getElementById("totalAmount").textContent = total;

    // Update count
    document.getElementById("transactionCount").textContent = count;


    // Update chart
    createChart();
}


// ==============================
// DELETE EXPENSE
// ==============================

function deleteExpense(id) {

    expenses = expenses.filter(function(expense) {

        return expense.id !== id;

    });

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    displayExpenses();
}


// ==============================
// CHART
// ==============================

let expenseChart = null;

function createChart() {

    const chartCanvas =
        document.getElementById("expenseChart");

    // If chart doesn't exist, stop
    if (!chartCanvas) {
        return;
    }

    // If Chart.js isn't loaded, stop
    if (typeof Chart === "undefined") {
        return;
    }

    const categoryTotals = {

        Food: 0,
        Travel: 0,
        Shopping: 0,
        Education: 0,
        Other: 0

    };


    expenses.forEach(function(expense) {

        if (categoryTotals[expense.category] !== undefined) {

            categoryTotals[expense.category] +=
                expense.amount;

        }

    });


    // Remove old chart
    if (expenseChart) {

        expenseChart.destroy();

    }


    // Create chart
    expenseChart = new Chart(

        chartCanvas.getContext("2d"),

        {

            type: "doughnut",

            data: {

                labels: Object.keys(categoryTotals),

                datasets: [

                    {

                        data: Object.values(categoryTotals)

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        }

    );

}


// ==============================
// SEARCH
// ==============================

const searchExpense =
    document.getElementById("searchExpense");

if (searchExpense) {

    searchExpense.addEventListener(
        "input",
        displayExpenses
    );

}


// ==============================
// CATEGORY FILTER
// ==============================

const filterCategory =
    document.getElementById("filterCategory");

if (filterCategory) {

    filterCategory.addEventListener(
        "change",
        displayExpenses
    );

}


// ==============================
// INITIAL LOAD
// ==============================

displayExpenses();