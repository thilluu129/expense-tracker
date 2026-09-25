// =========================================
// MONTH NAMES
// =========================================

const monthNames = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"

];


// =========================================
// CURRENT DATE
// =========================================

const currentDate = new Date();

let selectedMonth =
    currentDate.getMonth();

let selectedYear =
    currentDate.getFullYear();


// =========================================
// LOAD DATA
// =========================================

let monthlyData =
    JSON.parse(
        localStorage.getItem(
            "monthlyExpenseData"
        )
    ) || {};


// =========================================
// VARIABLES
// =========================================

let editingExpenseId = null;

let expenseChart = null;


// =========================================
// GET MONTH KEY
// =========================================

function getMonthKey() {

    return (
        selectedYear +
        "-" +
        selectedMonth
    );

}


// =========================================
// GET CURRENT MONTH DATA
// =========================================

function getCurrentMonthData() {

    const key =
        getMonthKey();


    if (!monthlyData[key]) {

        monthlyData[key] = {

            budget: 0,

            expenses: []

        };

    }


    return monthlyData[key];

}


// =========================================
// SAVE DATA
// =========================================

function saveMonthlyData() {

    localStorage.setItem(

        "monthlyExpenseData",

        JSON.stringify(
            monthlyData
        )

    );

}


// =========================================
// CREATE YEAR OPTIONS
// =========================================

function createYearOptions() {

    const yearSelector =
        document.getElementById(
            "yearSelector"
        );


    const currentYear =
        currentDate.getFullYear();


    for (
        let year = currentYear - 5;
        year <= currentYear + 5;
        year++
    ) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            year;


        option.textContent =
            year;


        yearSelector.appendChild(
            option
        );

    }


    yearSelector.value =
        selectedYear;

}


// =========================================
// UPDATE MONTH TEXT
// =========================================

function updateSelectedMonthText() {

    const text =
        document.getElementById(
            "selectedMonthText"
        );


    const chartMonthName =
        document.getElementById(
            "chartMonthName"
        );


    const monthText =
        monthNames[selectedMonth] +
        " " +
        selectedYear;


    text.textContent =
        monthText;


    chartMonthName.textContent =
        monthText;

}


// =========================================
// CHANGE MONTH
// =========================================

function changeMonth() {

    selectedMonth =
        Number(
            document.getElementById(
                "monthSelector"
            ).value
        );


    selectedYear =
        Number(
            document.getElementById(
                "yearSelector"
            ).value
        );


    editingExpenseId =
        null;


    clearForm();


    document.getElementById(
        "expenseButton"
    ).textContent =
        "Add Expense";


    document.getElementById(
        "cancelEditButton"
    ).style.display =
        "none";


    document.getElementById(
        "searchExpense"
    ).value =
        "";


    document.getElementById(
        "filterCategory"
    ).value =
        "All";


    document.getElementById(
        "filterDate"
    ).value =
        "";


    updateSelectedMonthText();

    setDateInputLimits();

    loadCurrentMonth();

    displayExpenses();

}


// =========================================
// DATE LIMITS
// =========================================

function setDateInputLimits() {

    const expenseDate =
        document.getElementById(
            "expenseDate"
        );


    const filterDate =
        document.getElementById(
            "filterDate"
        );


    const month =
        String(
            selectedMonth + 1
        ).padStart(
            2,
            "0"
        );


    const firstDay =
        selectedYear +
        "-" +
        month +
        "-01";


    const lastDay =
        new Date(
            selectedYear,
            selectedMonth + 1,
            0
        );


    const lastDayString =
        selectedYear +
        "-" +
        month +
        "-" +
        String(
            lastDay.getDate()
        ).padStart(
            2,
            "0"
        );


    expenseDate.min =
        firstDay;


    expenseDate.max =
        lastDayString;


    filterDate.min =
        firstDay;


    filterDate.max =
        lastDayString;


    if (
        !expenseDate.value ||
        expenseDate.value < firstDay ||
        expenseDate.value > lastDayString
    ) {

        expenseDate.value =
            firstDay;

    }

}


// =========================================
// LOAD CURRENT MONTH
// =========================================

function loadCurrentMonth() {

    const data =
        getCurrentMonthData();


    document.getElementById(
        "budgetInput"
    ).value =
        data.budget || "";


    updateBudget();

}


// =========================================
// SET BUDGET
// =========================================

function setBudget() {

    const input =
        document.getElementById(
            "budgetInput"
        );


    const value =
        Number(
            input.value
        );


    if (value <= 0) {

        alert(
            "Please enter a valid budget."
        );

        return;

    }


    const data =
        getCurrentMonthData();


    data.budget =
        value;


    saveMonthlyData();


    updateBudget();

}


// =========================================
// ADD / UPDATE EXPENSE
// =========================================

function addExpense() {

    const name =
        document.getElementById(
            "expenseName"
        ).value.trim();


    const amount =
        document.getElementById(
            "expenseAmount"
        ).value;


    const category =
        document.getElementById(
            "expenseCategory"
        ).value;


    const date =
        document.getElementById(
            "expenseDate"
        ).value;


    if (
        name === "" ||
        amount === "" ||
        category === "" ||
        date === ""
    ) {

        alert(
            "Please fill all fields."
        );

        return;

    }


    if (
        Number(amount) <= 0
    ) {

        alert(
            "Amount must be greater than 0."
        );

        return;

    }


    const expenseDateObject =
        new Date(
            date + "T00:00:00"
        );


    if (
        expenseDateObject.getMonth() !==
        selectedMonth ||

        expenseDateObject.getFullYear() !==
        selectedYear
    ) {

        alert(
            "Please select a date from " +
            monthNames[selectedMonth] +
            " " +
            selectedYear +
            "."
        );

        return;

    }


    const data =
        getCurrentMonthData();


    // UPDATE

    if (
        editingExpenseId !== null
    ) {

        data.expenses =
            data.expenses.map(
                function(expense) {

                    if (
                        expense.id ===
                        editingExpenseId
                    ) {

                        return {

                            id:
                                expense.id,

                            name:
                                name,

                            amount:
                                Number(amount),

                            category:
                                category,

                            date:
                                date

                        };

                    }


                    return expense;

                }
            );


        editingExpenseId =
            null;


        document.getElementById(
            "expenseButton"
        ).textContent =
            "Add Expense";


        document.getElementById(
            "cancelEditButton"
        ).style.display =
            "none";

    }


    // ADD

    else {

        const expense = {

            id:
                Date.now(),

            name:
                name,

            amount:
                Number(amount),

            category:
                category,

            date:
                date

        };


        data.expenses.push(
            expense
        );

    }


    saveMonthlyData();


    clearForm();


    displayExpenses();

}


// =========================================
// CLEAR FORM
// =========================================

function clearForm() {

    document.getElementById(
        "expenseName"
    ).value =
        "";


    document.getElementById(
        "expenseAmount"
    ).value =
        "";


    document.getElementById(
        "expenseCategory"
    ).value =
        "";


    setDateInputLimits();

}


// =========================================
// DISPLAY EXPENSES
// =========================================

function displayExpenses() {

    const list =
        document.getElementById(
            "expenseList"
        );


    list.innerHTML =
        "";


    const data =
        getCurrentMonthData();


    const searchText =
        document.getElementById(
            "searchExpense"
        ).value
        .toLowerCase()
        .trim();


    const selectedCategory =
        document.getElementById(
            "filterCategory"
        ).value;


    const selectedDate =
        document.getElementById(
            "filterDate"
        ).value;


    let total =
        0;


    let count =
        0;


    let dateTotal =
        0;


    let dateCount =
        0;


    data.expenses.forEach(
        function(expense) {


            const matchesSearch =
                expense.name
                    .toLowerCase()
                    .includes(
                        searchText
                    );


            const matchesCategory =
                selectedCategory ===
                    "All" ||

                expense.category ===
                    selectedCategory;


            const matchesDate =
                selectedDate === "" ||

                expense.date ===
                    selectedDate;


            if (
                selectedDate !== "" &&
                expense.date ===
                    selectedDate
            ) {

                dateTotal +=
                    expense.amount;

                dateCount++;

            }


            if (
                matchesSearch &&
                matchesCategory &&
                matchesDate
            ) {

                total +=
                    expense.amount;


                count++;


                const li =
                    document.createElement(
                        "li"
                    );


                li.className =
                    "expense-item";


                li.innerHTML = `

                    <div class="expense-info">

                        <h3>
                            ${expense.name}
                            - ₹${expense.amount.toLocaleString("en-IN")}
                        </h3>

                        <p>
                            ${expense.category}
                            •
                            ${expense.date}
                        </p>

                    </div>


                    <div class="expense-actions">

                        <button
                            onclick="editExpense(${expense.id})">

                            Edit

                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteExpense(${expense.id})">

                            Delete

                        </button>

                    </div>

                `;


                list.appendChild(
                    li
                );

            }

        }
    );


    document.getElementById(
        "totalAmount"
    ).textContent =
        total.toLocaleString(
            "en-IN"
        );


    document.getElementById(
        "transactionCount"
    ).textContent =
        count;


    document.getElementById(
        "dateTotal"
    ).textContent =
        dateTotal.toLocaleString(
            "en-IN"
        );


    document.getElementById(
        "dateCount"
    ).textContent =
        dateCount;


    updateBudget();

    createChart();

    updateSelectedMonthText();

}


// =========================================
// UPDATE BUDGET
// =========================================

function updateBudget() {

    const data =
        getCurrentMonthData();


    const total =
        data.expenses.reduce(
            function(sum, expense) {

                return (
                    sum +
                    expense.amount
                );

            },
            0
        );


    const remaining =
        data.budget -
        total;


    document.getElementById(
        "budgetAmount"
    ).textContent =
        data.budget.toLocaleString(
            "en-IN"
        );


    document.getElementById(
        "remainingBudget"
    ).textContent =
        remaining.toLocaleString(
            "en-IN"
        );


    const message =
        document.getElementById(
            "budgetMessage"
        );


    if (
        data.budget === 0
    ) {

        message.textContent =
            "Please set a budget for " +
            monthNames[selectedMonth] +
            " " +
            selectedYear +
            ".";

    }

    else if (
        remaining < 0
    ) {

        message.textContent =
            "⚠️ Budget exceeded!";

    }

    else {

        message.textContent =
            "✓ You are within your budget.";

    }


    // UPDATE PROGRESS BAR

    updateBudgetProgress();

}


// =========================================
// MONTHLY SPENDING PROGRESS
// =========================================

function updateBudgetProgress() {

    const data =
        getCurrentMonthData();


    const spent =
        data.expenses.reduce(
            function(sum, expense) {

                return (
                    sum +
                    expense.amount
                );

            },
            0
        );


    const budget =
        Number(
            data.budget
        );


    const spentElement =
        document.getElementById(
            "progressSpent"
        );


    const budgetElement =
        document.getElementById(
            "progressBudget"
        );


    const percentageElement =
        document.getElementById(
            "progressPercent"
        );


    const progressBar =
        document.getElementById(
            "budgetProgressBar"
        );


    const messageElement =
        document.getElementById(
            "progressMessage"
        );


    spentElement.textContent =
        "₹" +
        spent.toLocaleString(
            "en-IN"
        );


    budgetElement.textContent =
        "₹" +
        budget.toLocaleString(
            "en-IN"
        );


    // NO BUDGET

    if (
        budget <= 0
    ) {

        percentageElement.textContent =
            "0%";


        progressBar.style.width =
            "0%";


        progressBar.className =
            "progress-fill";


        messageElement.textContent =
            "Set a budget to see your spending progress.";


        return;

    }


    const percentage =
        (
            spent /
            budget
        ) * 100;


    /*
       The displayed percentage can
       exceed 100%, but the progress
       bar itself stops at 100%.
    */

    percentageElement.textContent =
        percentage.toFixed(1) +
        "%";


    const barWidth =
        Math.min(
            percentage,
            100
        );


    progressBar.style.width =
        barWidth + "%";


    // RESET CLASSES

    progressBar.className =
        "progress-fill";


    // NORMAL

    if (
        percentage < 80
    ) {

        progressBar.classList.add(
            "normal"
        );


        messageElement.textContent =
            "✓ You are using your budget comfortably.";

    }


    // WARNING

    else if (
        percentage < 100
    ) {

        progressBar.classList.add(
            "warning"
        );


        messageElement.textContent =
            "⚠️ You are getting close to your monthly budget.";

    }


    // EXCEEDED

    else {

        progressBar.classList.add(
            "danger"
        );


        const exceeded =
            spent -
            budget;


        messageElement.textContent =
            "⚠️ Budget exceeded by ₹" +
            exceeded.toLocaleString(
                "en-IN"
            ) +
            ".";

    }

}


// =========================================
// EDIT EXPENSE
// =========================================

function editExpense(id) {

    const data =
        getCurrentMonthData();


    const expense =
        data.expenses.find(
            function(expense) {

                return (
                    expense.id === id
                );

            }
        );


    if (!expense) {

        return;

    }


    document.getElementById(
        "expenseName"
    ).value =
        expense.name;


    document.getElementById(
        "expenseAmount"
    ).value =
        expense.amount;


    document.getElementById(
        "expenseCategory"
    ).value =
        expense.category;


    document.getElementById(
        "expenseDate"
    ).value =
        expense.date;


    editingExpenseId =
        id;


    document.getElementById(
        "expenseButton"
    ).textContent =
        "Update Expense";


    document.getElementById(
        "cancelEditButton"
    ).style.display =
        "inline-block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =========================================
// DELETE EXPENSE
// =========================================

function deleteExpense(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmDelete) {

        return;

    }


    const data =
        getCurrentMonthData();


    data.expenses =
        data.expenses.filter(
            function(expense) {

                return (
                    expense.id !== id
                );

            }
        );


    saveMonthlyData();


    displayExpenses();

}


// =========================================
// CANCEL EDIT
// =========================================

function cancelEdit() {

    editingExpenseId =
        null;


    clearForm();


    document.getElementById(
        "expenseButton"
    ).textContent =
        "Add Expense";


    document.getElementById(
        "cancelEditButton"
    ).style.display =
        "none";

}


// =========================================
// DOWNLOAD CSV
// =========================================

function downloadCSV() {

    const data =
        getCurrentMonthData();


    if (
        data.expenses.length === 0
    ) {

        alert(
            "No expenses available for " +
            monthNames[selectedMonth] +
            " " +
            selectedYear +
            "."
        );


        return;

    }


    let csv =
        "Expense Name,Amount,Category,Date\n";


    data.expenses.forEach(
        function(expense) {

            csv +=
                `"${expense.name}",` +
                `"${expense.amount}",` +
                `"${expense.category}",` +
                `"${expense.date}"\n`;

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "expense-report-" +
        monthNames[selectedMonth] +
        "-" +
        selectedYear +
        ".csv";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


// =========================================
// PROFESSIONAL PIE CHART
// =========================================

function createChart() {

    const canvas =
        document.getElementById(
            "expenseChart"
        );


    if (
        !canvas ||
        typeof Chart ===
            "undefined"
    ) {

        return;

    }


    const data =
        getCurrentMonthData();


    const categoryTotals = {

        Food: 0,

        Travel: 0,

        Shopping: 0,

        Education: 0,

        Other: 0

    };


    data.expenses.forEach(
        function(expense) {

            if (
                categoryTotals[
                    expense.category
                ] !== undefined
            ) {

                categoryTotals[
                    expense.category
                ] +=
                    expense.amount;

            }

        }
    );


    const labels = [];

    const values = [];


    Object.keys(
        categoryTotals
    ).forEach(
        function(category) {

            if (
                categoryTotals[
                    category
                ] > 0
            ) {

                labels.push(
                    category
                );


                values.push(
                    categoryTotals[
                        category
                    ]
                );

            }

        }
    );


    if (expenseChart) {

        expenseChart.destroy();

        expenseChart = null;

    }


    if (
        values.length === 0
    ) {

        const context =
            canvas.getContext(
                "2d"
            );


        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        return;

    }


    const total =
        values.reduce(
            function(sum, value) {

                return (
                    sum + value
                );

            },
            0
        );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    const chartColors = [

        "#6366f1",

        "#10b981",

        "#f59e0b",

        "#ef4444",

        "#8b5cf6"

    ];


    expenseChart =
        new Chart(

            canvas.getContext(
                "2d"
            ),

            {

                type: "pie",


                data: {

                    labels:
                        labels,


                    datasets: [

                        {

                            data:
                                values,

                            backgroundColor:
                                labels.map(
                                    function(
                                        label,
                                        index
                                    ) {

                                        return chartColors[
                                            index %
                                            chartColors.length
                                        ];

                                    }
                                ),

                            borderWidth:
                                4,

                            borderColor:
                                isDark
                                    ? "#181b21"
                                    : "#ffffff",

                            hoverOffset:
                                12

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        true,


                    layout: {

                        padding:
                            35

                    },


                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                padding:
                                    20,

                                color:
                                    isDark
                                        ? "#f3f4f6"
                                        : "#374151",

                                font: {

                                    size:
                                        14,

                                    weight:
                                        "600"

                                }

                            }

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        const amount =
                                            context.raw;


                                        const percentage =
                                            (
                                                amount /
                                                total *
                                                100
                                            ).toFixed(
                                                1
                                            );


                                        return (

                                            context.label +

                                            ": ₹" +

                                            amount.toLocaleString(
                                                "en-IN"
                                            ) +

                                            " (" +

                                            percentage +

                                            "%)"

                                        );

                                    }

                            }

                        },


                        datalabels: {

                            color:
                                "#ffffff",

                            textStrokeColor:
                                "rgba(0,0,0,0.4)",

                            textStrokeWidth:
                                2,

                            font: {

                                size:
                                    13,

                                weight:
                                    "bold"

                            },


                            formatter:
                                function(
                                    value,
                                    context
                                ) {

                                    const percentage =
                                        (
                                            value /
                                            total *
                                            100
                                        ).toFixed(
                                            1
                                        );


                                    const category =
                                        context
                                            .chart
                                            .data
                                            .labels[
                                                context
                                                    .dataIndex
                                            ];


                                    return (

                                        category +

                                        "\n₹" +

                                        value.toLocaleString(
                                            "en-IN"
                                        ) +

                                        "\n" +

                                        percentage +

                                        "%"

                                    );

                                }

                        }

                    }

                },


                plugins: [

                    ChartDataLabels

                ]

            }

        );

}


// =========================================
// SEARCH
// =========================================

document.getElementById(
    "searchExpense"
).addEventListener(
    "input",
    displayExpenses
);


// =========================================
// CATEGORY FILTER
// =========================================

document.getElementById(
    "filterCategory"
).addEventListener(
    "change",
    displayExpenses
);


// =========================================
// DATE FILTER
// =========================================

document.getElementById(
    "filterDate"
).addEventListener(
    "change",
    displayExpenses
);


// =========================================
// CLEAR DATE FILTER
// =========================================

function clearDateFilter() {

    document.getElementById(
        "filterDate"
    ).value =
        "";


    displayExpenses();

}


// =========================================
// DARK MODE
// =========================================

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "darkMode",
        isDark
    );


    updateThemeButton();


    createChart();

}


// =========================================
// UPDATE THEME BUTTON
// =========================================

function updateThemeButton() {

    const button =
        document.getElementById(
            "themeButton"
        );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    button.textContent =
        isDark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";

}


// =========================================
// LOAD DARK MODE
// =========================================

function loadDarkMode() {

    const savedMode =
        localStorage.getItem(
            "darkMode"
        );


    if (
        savedMode === "true"
    ) {

        document.body.classList.add(
            "dark"
        );

    }

    else {

        document.body.classList.remove(
            "dark"
        );

    }


    updateThemeButton();

}


// =========================================
// INITIALIZE
// =========================================

document.getElementById(
    "monthSelector"
).value =
    selectedMonth;


createYearOptions();


document.getElementById(
    "monthSelector"
).addEventListener(
    "change",
    changeMonth
);


document.getElementById(
    "yearSelector"
).addEventListener(
    "change",
    changeMonth
);


updateSelectedMonthText();


setDateInputLimits();


loadCurrentMonth();


loadDarkMode();


displayExpenses();