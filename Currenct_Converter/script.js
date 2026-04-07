const converterForm = document.getElementById("converter-form");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const resultContainer = document.getElementById("result-container");
const resultValue = document.getElementById("result-value");
const exchangeRateText = document.getElementById("exchange-rate-text");
const swapBtn = document.getElementById("swap-btn");
const convertBtn = document.getElementById("convert-btn");

// Initial data fetch
async function init() {
    try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        const currencies = Object.keys(data.rates);

        populateDropdowns(currencies);
        // Set defaults
        fromCurrency.value = "USD";
        toCurrency.value = "EUR";
    } catch (error) {
        alert("Error connecting to the currency API.");
    }
}

function populateDropdowns(currencies) {
    currencies.forEach(currency => {
        const option = `<option value="${currency}">${currency}</option>`;
        fromCurrency.insertAdjacentHTML("beforeend", option);
        toCurrency.insertAdjacentHTML("beforeend", option);
    });
}

async function convertCurrency(e) {
    if (e) e.preventDefault();

    const amount = amountInput.value;
    if (amount <= 0 || amount === "") return;

    // UI Loading State
    convertBtn.innerText = "Converting...";
    convertBtn.disabled = true;

    try {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        const data = await response.json();

        const rate = data.rates[to];
        const convertedAmount = (amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Update UI
        resultContainer.classList.remove("hidden");
        exchangeRateText.innerText = `1 ${from} = ${rate.toFixed(4)} ${to}`;
        resultValue.innerText = `${convertedAmount} ${to}`;
    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        convertBtn.innerText = "Convert Now";
        convertBtn.disabled = false;
    }
}

// Swap currencies logic
swapBtn.addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    // Auto-convert on swap if there's an amount
    if (amountInput.value) convertCurrency();
});

converterForm.addEventListener("submit", convertCurrency);
init();