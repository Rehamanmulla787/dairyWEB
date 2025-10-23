// --- Start of Updated scripts.js ---

document.addEventListener("DOMContentLoaded", function () {
    const farmerList = document.getElementById("farmerList");
    const farmerInput = document.getElementById("farmerName");

    // Example farmers (Replace this with real data from Firebase if needed)
    const farmers = ["Dashrath Salunke", "Anand Nandgavn", "Parasa Alas"];

    // Load farmers into datalist
    function loadFarmers() {
        farmerList.innerHTML = ""; // Clear previous options
        farmers.forEach(farmer => {
            const option = document.createElement("option");
            option.value = farmer;
            farmerList.appendChild(option);
        });
    }

    loadFarmers(); // Populate the list on page load

    // Event: Show filtered suggestions while typing
    farmerInput.addEventListener("input", function () {
        const inputValue = this.value.toLowerCase();
        farmerList.innerHTML = ""; // Clear previous options

        farmers.forEach(farmer => {
            if (farmer.toLowerCase().includes(inputValue)) {
                const option = document.createElement("option");
                option.value = farmer;
                farmerList.appendChild(option);
            }
        });
    });
});


document.getElementById("billDate").addEventListener("change", generatePreviousDates);

function generatePreviousDates() {
    const selectedDate = new Date(document.getElementById("billDate").value);
    const morningTableBody = document.getElementById("morningTableBody");
    const eveningTableBody = document.getElementById("eveningTableBody");

    morningTableBody.innerHTML = "";
    eveningTableBody.innerHTML = "";

    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 6);

    const formattedOptions = { month: '2-digit', day: '2-digit' };

    for (let i = 0; i < 7; i++) {
        const formattedDate = currentDate.toLocaleDateString('en-GB', formattedOptions);
        const rowMorning = `
            <tr>
                <td>${formattedDate}</td>
                <td><input type="number" class="input litres-morning" onchange="calculateAmount('morning', this)"></td>
                <td><input type="number" class="input fat-morning" onchange="calculateAmount('morning', this)"></td>
                <td><input type="number" class="input snf-morning" onchange="calculateAmount('morning', this)"></td>
                <td class="total-amount-morning"></td>
            </tr>
        `;
        morningTableBody.innerHTML += rowMorning;

        const rowEvening = `
            <tr>
                <td>${formattedDate}</td>
                <td><input type="number" class="input litres-evening" onchange="calculateAmount('evening', this)"></td>
                <td><input type="number" class="input fat-evening" onchange="calculateAmount('evening', this)"></td>
                <td><input type="number" class="input snf-evening" onchange="calculateAmount('evening', this)"></td>
                <td class="total-amount-evening"></td>
            </tr>
        `;
        eveningTableBody.innerHTML += rowEvening;

        currentDate.setDate(currentDate.getDate() + 1);
    }
}


// --- START OF NEW/MODIFIED RATE LOGIC ---

// Milk Rate Chart converted from your Excel file
const milkRateChart = {
    "5.0": {
        "7.5": 28.0,
        "7.6": 29.0,
        "7.7": 30.0,
        "7.8": 31.0,
        "7.9": 32.0,
        "8.0": 33.0,
        "8.1": 34.0,
        "8.2": 35.0,
        "8.3": 36.0,
        "8.4": 37.0,
        "8.5": 38.0,
        "8.6": 38.9,
        "8.7": 39.7,
        "8.8": 40.4,
        "8.9": 41.0,
        "9.0": 41.5,
        "9.1": 41.5,
        "9.2": 41.5,
        "9.3": 41.5,
        "9.4": 41.5,
        "9.5": 41.5
    },
    "5.1": {
        "7.5": 29.5,
        "7.6": 30.5,
        "7.7": 31.5,
        "7.8": 32.5,
        "7.9": 33.5,
        "8.0": 34.5,
        "8.1": 35.5,
        "8.2": 36.5,
        "8.3": 37.5,
        "8.4": 38.5,
        "8.5": 39.5,
        "8.6": 40.4,
        "8.7": 41.2,
        "8.8": 41.9,
        "8.9": 42.5,
        "9.0": 43.0,
        "9.1": 43.0,
        "9.2": 43.0,
        "9.3": 43.0,
        "9.4": 43.0,
        "9.5": 43.0
    },
    "5.2": {
        "7.5": 30.9,
        "7.6": 31.9,
        "7.7": 32.9,
        "7.8": 33.9,
        "7.9": 34.9,
        "8.0": 35.9,
        "8.1": 36.9,
        "8.2": 37.9,
        "8.3": 38.9,
        "8.4": 39.9,
        "8.5": 40.9,
        "8.6": 41.8,
        "8.7": 42.6,
        "8.8": 43.3,
        "8.9": 43.9,
        "9.0": 44.4,
        "9.1": 44.4,
        "9.2": 44.4,
        "9.3": 44.4,
        "9.4": 44.4,
        "9.5": 44.4
    },
    "5.3": {
        "7.5": 32.2,
        "7.6": 33.2,
        "7.7": 34.2,
        "7.8": 35.2,
        "7.9": 36.2,
        "8.0": 37.2,
        "8.1": 38.2,
        "8.2": 39.2,
        "8.3": 40.2,
        "8.4": 41.2,
        "8.5": 42.2,
        "8.6": 43.1,
        "8.7": 43.9,
        "8.8": 44.6,
        "8.9": 45.2,
        "9.0": 45.7,
        "9.1": 45.7,
        "9.2": 45.7,
        "9.3": 45.7,
        "9.4": 45.7,
        "9.5": 45.7
    },
    "5.4": {
        "7.5": 33.4,
        "7.6": 34.4,
        "7.7": 35.4,
        "7.8": 36.4,
        "7.9": 37.4,
        "8.0": 38.4,
        "8.1": 39.4,
        "8.2": 40.4,
        "8.3": 41.4,
        "8.4": 42.4,
        "8.5": 43.4,
        "8.6": 44.3,
        "8.7": 45.1,
        "8.8": 45.8,
        "8.9": 46.4,
        "9.0": 46.9,
        "9.1": 46.9,
        "9.2": 46.9,
        "9.3": 46.9,
        "9.4": 46.9,
        "9.5": 46.9
    },
    "5.5": {
        "7.5": 34.5,
        "7.6": 35.5,
        "7.7": 36.5,
        "7.8": 37.5,
        "7.9": 38.5,
        "8.0": 39.5,
        "8.1": 40.5,
        "8.2": 41.5,
        "8.3": 42.5,
        "8.4": 43.5,
        "8.5": 44.5,
        "8.6": 45.4,
        "8.7": 46.2,
        "8.8": 46.9,
        "8.9": 47.5,
        "9.0": 48.0,
        "9.1": 48.1,
        "9.2": 48.2,
        "9.3": 48.3,
        "9.4": 48.4,
        "9.5": 48.5
    },
    "5.6": {
        "7.5": 35.5,
        "7.6": 36.5,
        "7.7": 37.5,
        "7.8": 38.5,
        "7.9": 39.5,
        "8.0": 40.5,
        "8.1": 41.5,
        "8.2": 42.5,
        "8.3": 43.5,
        "8.4": 44.5,
        "8.5": 45.5,
        "8.6": 46.4,
        "8.7": 47.2,
        "8.8": 47.9,
        "8.9": 48.5,
        "9.0": 49.0,
        "9.1": 49.1,
        "9.2": 49.2,
        "9.3": 49.3,
        "9.4": 49.4,
        "9.5": 49.5
    },
    "5.7": {
        "7.5": 36.4,
        "7.6": 37.4,
        "7.7": 38.4,
        "7.8": 39.4,
        "7.9": 40.4,
        "8.0": 41.4,
        "8.1": 42.4,
        "8.2": 43.4,
        "8.3": 44.4,
        "8.4": 45.4,
        "8.5": 46.4,
        "8.6": 47.3,
        "8.7": 48.1,
        "8.8": 48.8,
        "8.9": 49.4,
        "9.0": 49.9,
        "9.1": 50.0,
        "9.2": 50.1,
        "9.3": 50.2,
        "9.4": 50.3,
        "9.5": 50.4
    },
    "5.8": {
        "7.5": 37.2,
        "7.6": 38.2,
        "7.7": 39.2,
        "7.8": 40.2,
        "7.9": 41.2,
        "8.0": 42.2,
        "8.1": 43.2,
        "8.2": 44.2,
        "8.3": 45.2,
        "8.4": 46.2,
        "8.5": 47.2,
        "8.6": 48.1,
        "8.7": 48.9,
        "8.8": 49.6,
        "8.9": 50.2,
        "9.0": 50.7,
        "9.1": 50.8,
        "9.2": 50.9,
        "9.3": 51.0,
        "9.4": 51.1,
        "9.5": 51.2
    },
    "5.9": {
        "7.5": 37.9,
        "7.6": 38.9,
        "7.7": 39.9,
        "7.8": 40.9,
        "7.9": 41.9,
        "8.0": 42.9,
        "8.1": 43.9,
        "8.2": 44.9,
        "8.3": 45.9,
        "8.4": 46.9,
        "8.5": 47.9,
        "8.6": 48.8,
        "8.7": 49.6,
        "8.8": 50.3,
        "8.9": 50.9,
        "9.0": 51.4,
        "9.1": 51.5,
        "9.2": 51.6,
        "9.3": 51.7,
        "9.4": 51.8,
        "9.5": 51.9
    },
    "6.0": {
        "7.5": 38.5,
        "7.6": 39.5,
        "7.7": 40.5,
        "7.8": 41.5,
        "7.9": 42.5,
        "8.0": 43.5,
        "8.1": 44.5,
        "8.2": 45.5,
        "8.3": 46.5,
        "8.4": 47.5,
        "8.5": 48.5,
        "8.6": 49.4,
        "8.7": 50.2,
        "8.8": 50.9,
        "8.9": 51.5,
        "9.0": 52.0,
        "9.1": 52.1,
        "9.2": 52.2,
        "9.3": 52.3,
        "9.4": 52.4,
        "9.5": 52.5
    },
    "6.1": {
        "7.5": 39.1,
        "7.6": 40.1,
        "7.7": 41.1,
        "7.8": 42.1,
        "7.9": 43.1,
        "8.0": 44.1,
        "8.1": 45.1,
        "8.2": 46.1,
        "8.3": 47.1,
        "8.4": 48.1,
        "8.5": 49.1,
        "8.6": 50.0,
        "8.7": 50.8,
        "8.8": 51.5,
        "8.9": 52.1,
        "9.0": 52.6,
        "9.1": 52.7,
        "9.2": 52.8,
        "9.3": 52.9,
        "9.4": 53.0,
        "9.5": 53.1
    },
    "6.2": {
        "7.5": 39.6,
        "7.6": 40.6,
        "7.7": 41.6,
        "7.8": 42.6,
        "7.9": 43.6,
        "8.0": 44.6,
        "8.1": 45.6,
        "8.2": 46.6,
        "8.3": 47.6,
        "8.4": 48.6,
        "8.5": 49.6,
        "8.6": 50.5,
        "8.7": 51.3,
        "8.8": 52.0,
        "8.9": 52.6,
        "9.0": 53.1,
        "9.1": 53.2,
        "9.2": 53.3,
        "9.3": 53.4,
        "9.4": 53.5,
        "9.5": 53.6
    },
    "6.3": {
        "7.5": 40.0,
        "7.6": 41.0,
        "7.7": 42.0,
        "7.8": 43.0,
        "7.9": 44.0,
        "8.0": 45.0,
        "8.1": 46.0,
        "8.2": 47.0,
        "8.3": 48.0,
        "8.4": 49.0,
        "8.5": 50.0,
        "8.6": 50.9,
        "8.7": 51.7,
        "8.8": 52.4,
        "8.9": 53.0,
        "9.0": 53.5,
        "9.1": 53.6,
        "9.2": 53.7,
        "9.3": 53.8,
        "9.4": 53.9,
        "9.5": 54.0
    },
    "6.4": {
        "7.5": 40.4,
        "7.6": 41.4,
        "7.7": 42.4,
        "7.8": 43.4,
        "7.9": 44.4,
        "8.0": 45.4,
        "8.1": 46.4,
        "8.2": 47.4,
        "8.3": 48.4,
        "8.4": 49.4,
        "8.5": 50.4,
        "8.6": 51.3,
        "8.7": 52.1,
        "8.8": 52.8,
        "8.9": 53.4,
        "9.0": 53.9,
        "9.1": 54.0,
        "9.2": 54.1,
        "9.3": 54.2,
        "9.4": 54.3,
        "9.5": 54.4
    },
    "6.5": {
        "7.5": 40.7,
        "7.6": 41.7,
        "7.7": 42.7,
        "7.8": 43.7,
        "7.9": 44.7,
        "8.0": 45.7,
        "8.1": 46.7,
        "8.2": 47.7,
        "8.3": 48.7,
        "8.4": 49.7,
        "8.5": 50.7,
        "8.6": 51.6,
        "8.7": 52.4,
        "8.8": 53.1,
        "8.9": 53.7,
        "9.0": 54.2,
        "9.1": 54.3,
        "9.2": 54.4,
        "9.3": 54.5,
        "9.4": 54.6,
        "9.5": 54.7
    },
    "6.6": {
        "7.5": 41.0,
        "7.6": 42.0,
        "7.7": 43.0,
        "7.8": 44.0,
        "7.9": 45.0,
        "8.0": 46.0,
        "8.1": 47.0,
        "8.2": 48.0,
        "8.3": 49.0,
        "8.4": 50.0,
        "8.5": 51.0,
        "8.6": 51.9,
        "8.7": 52.7,
        "8.8": 53.4,
        "8.9": 54.0,
        "9.0": 54.5,
        "9.1": 54.6,
        "9.2": 54.7,
        "9.3": 54.8,
        "9.4": 54.9,
        "9.5": 55.0
    },
    "6.7": {
        "7.5": 41.2,
        "7.6": 42.2,
        "7.7": 43.2,
        "7.8": 44.2,
        "7.9": 45.2,
        "8.0": 46.2,
        "8.1": 47.2,
        "8.2": 48.2,
        "8.3": 49.2,
        "8.4": 50.2,
        "8.5": 51.2,
        "8.6": 52.1,
        "8.7": 52.9,
        "8.8": 53.6,
        "8.9": 54.2,
        "9.0": 54.7,
        "9.1": 54.8,
        "9.2": 54.9,
        "9.3": 55.0,
        "9.4": 55.1,
        "9.5": 55.2
    },
    "6.8": {
        "7.5": 41.4,
        "7.6": 42.4,
        "7.7": 43.4,
        "7.8": 44.4,
        "7.9": 45.4,
        "8.0": 46.4,
        "8.1": 47.4,
        "8.2": 48.4,
        "8.3": 49.4,
        "8.4": 50.4,
        "8.5": 51.4,
        "8.6": 52.3,
        "8.7": 53.1,
        "8.8": 53.8,
        "8.9": 54.4,
        "9.0": 54.9,
        "9.1": 55.0,
        "9.2": 55.1,
        "9.3": 55.2,
        "9.4": 55.3,
        "9.5": 55.4
    },
    "6.9": {
        "7.5": 41.5,
        "7.6": 42.5,
        "7.7": 43.5,
        "7.8": 44.5,
        "7.9": 45.5,
        "8.0": 46.5,
        "8.1": 47.5,
        "8.2": 48.5,
        "8.3": 49.5,
        "8.4": 50.5,
        "8.5": 51.5,
        "8.6": 52.4,
        "8.7": 53.2,
        "8.8": 53.9,
        "8.9": 54.5,
        "9.0": 55.0,
        "9.1": 55.1,
        "9.2": 55.2,
        "9.3": 55.3,
        "9.4": 55.4,
        "9.5": 55.5
    },
    "7.0": {
        "7.5": 41.6,
        "7.6": 42.6,
        "7.7": 43.6,
        "7.8": 44.6,
        "7.9": 45.6,
        "8.0": 46.6,
        "8.1": 47.6,
        "8.2": 48.6,
        "8.3": 49.6,
        "8.4": 50.6,
        "8.5": 51.6,
        "8.6": 52.5,
        "8.7": 53.3,
        "8.8": 54.0,
        "8.9": 54.6,
        "9.0": 55.1,
        "9.1": 55.2,
        "9.2": 55.3,
        "9.3": 55.4,
        "9.4": 55.5,
        "9.5": 55.6
    }
};

/**
 * Looks up the rate based on Fat and SNF from the milkRateChart.
 * @param {number} fat - The Fat percentage.
 * @param {number} snf - The SNF percentage.
 * @returns {number} The rate per litre, or 0.00 if not found.
 */
function getRate(fat, snf) {
    // Round to one decimal place and convert to string key for lookup
    const fatKey = parseFloat(fat).toFixed(1);
    const snfKey = parseFloat(snf).toFixed(1);

    // Look up the rate: milkRateChart[fatKey][snfKey]
    const rate = milkRateChart[fatKey] ? milkRateChart[fatKey][snfKey] : undefined;

    return rate !== undefined ? rate : 0.00;
}

/**
 * Calculates the total amount for a row using the milk rate chart lookup.
 * @param {string} tableType - 'morning' or 'evening'.
 * @param {HTMLElement} element - The input element that was changed.
 */
function calculateAmount(tableType, element) {
    const row = element.parentElement.parentElement;
    
    // Get values from the respective inputs
    const litres = parseFloat(row.querySelector(`.litres-${tableType}`)?.value || 0);
    const fat = parseFloat(row.querySelector(`.fat-${tableType}`)?.value || 0);
    const snf = parseFloat(row.querySelector(`.snf-${tableType}`)?.value || 0);

    // Look up the rate
    const ratePerLitre = getRate(fat, snf); 
    
    // Calculate total amount
    const totalAmount = (litres * ratePerLitre);

    // Update the Rate cell and the Total Amount cell
    row.querySelector(`.rate-${tableType}`).textContent = ratePerLitre.toFixed(2);
    row.querySelector(`.total-amount-${tableType}`).textContent = totalAmount.toFixed(2);

    calculateTotals();
}

// REMOVED the previous 'calcAmount(fat, snf)' function.

// --- END OF NEW/MODIFIED RATE LOGIC ---


// Function to calculate totals (Only minor updates for the new Rate column)
function calculateTotals() {
    let totalLitresMorning = 0, totalAmountMorning = 0;
    let totalLitresEvening = 0, totalAmountEvening = 0;

    document.querySelectorAll("#morningTableBody tr").forEach(row => {
        totalLitresMorning += parseFloat(row.querySelector(".litres-morning")?.value || 0);
        // Note: Reads total amount from the display TD, not recalculating
        totalAmountMorning += parseFloat(row.querySelector(".total-amount-morning")?.textContent || "0");
    });

    document.querySelectorAll("#eveningTableBody tr").forEach(row => {
        totalLitresEvening += parseFloat(row.querySelector(".litres-evening")?.value || 0);
        totalAmountEvening += parseFloat(row.querySelector(".total-amount-evening")?.textContent || "0");
    });

    document.getElementById("morningTotalLitres").textContent = totalLitresMorning.toFixed(2);
    document.getElementById("morningTotalAmount").textContent = totalAmountMorning.toFixed(2);
    document.getElementById("eveningTotalLitres").textContent = totalLitresEvening.toFixed(2);
    document.getElementById("eveningTotalAmount").textContent = totalAmountEvening.toFixed(2);

    document.getElementById("totalLitres").textContent = (totalLitresMorning + totalLitresEvening).toFixed(2);
    document.getElementById("totalAmount").textContent = (totalAmountMorning + totalAmountEvening).toFixed(2);
}

document.addEventListener("keydown", function (event) {
    const activeElement = document.activeElement;

    if (activeElement.tagName === "INPUT") {
        let row = activeElement.closest("tr");
        if (!row) return;  
        
        let table = row.closest("tbody");
        if (!table) return; 

        let inputs = Array.from(table.querySelectorAll("input"));
        let index = inputs.indexOf(activeElement);

        if (event.key === "ArrowRight" && index < inputs.length - 1) {
            event.preventDefault(); // Prevent browser auto-fill
            inputs[index + 1].focus();
        } 
        else if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            inputs[index - 1].focus();
        } 
        else if (event.key === "ArrowDown") {
            let cellIndex = activeElement.parentElement?.cellIndex;
            if (cellIndex !== undefined) {
                let nextRow = row.nextElementSibling;
                let nextInput = nextRow?.children[cellIndex]?.querySelector("input");
                if (nextInput) {
                    event.preventDefault();
                    nextInput.focus();
                }
            }
        } 
        else if (event.key === "ArrowUp") {
            let cellIndex = activeElement.parentElement?.cellIndex;
            if (cellIndex !== undefined) {
                let prevRow = row.previousElementSibling;
                let prevInput = prevRow?.children[cellIndex]?.querySelector("input");
                if (prevInput) {
                    event.preventDefault();
                    prevInput.focus();
                }
            }
        }
    }
});


function createTableRow(rowData) {
    const row = document.createElement("tr");

    // Create and append cells for date, litres, fat, snf, rate, and totalAmount
    const dateCell = document.createElement("td");
    dateCell.textContent = rowData.date;
    row.appendChild(dateCell);

    const litresCell = document.createElement("td");
    const litresInput = document.createElement("input");
    litresInput.type = "number";
    litresInput.value = rowData.litres;
    litresInput.addEventListener("input", () => calculateAmount('morning', litresInput)); // Use the updated calculateAmount
    litresCell.appendChild(litresInput);
    row.appendChild(litresCell);

    const fatCell = document.createElement("td");
    const fatInput = document.createElement("input");
    fatInput.type = "number";
    fatInput.value = rowData.fat;
    fatInput.addEventListener("input", () => calculateAmount('morning', fatInput)); // Use the updated calculateAmount
    fatCell.appendChild(fatInput);
    row.appendChild(fatCell);

    const snfCell = document.createElement("td");
    const snfInput = document.createElement("input");
    snfInput.type = "number";
    snfInput.value = rowData.snf;
    snfInput.addEventListener("input", () => calculateAmount('morning', snfInput)); // Use the updated calculateAmount
    snfCell.appendChild(snfInput);
    row.appendChild(snfCell);
    
    // New Rate Cell
    const rateCell = document.createElement("td");
    // Ensure the rate is looked up on creation
    rateCell.textContent = getRate(rowData.fat, rowData.snf).toFixed(2); 
    rateCell.classList.add(`rate-${rowData.type}`); // Assuming rowData has a 'type' property ('morning'/'evening')
    row.appendChild(rateCell);


    const totalAmountCell = document.createElement("td");
    totalAmountCell.textContent = rowData.totalAmount;
    totalAmountCell.classList.add(`total-amount-${rowData.type}`);
    row.appendChild(totalAmountCell);

    return row;
}

function clearData() {
    const elementsToClear = [
        "billDate", "farmerName", "balance", 
        "morningTotalLitres", "morningTotalAmount",
        "eveningTotalLitres", "eveningTotalAmount",
        "totalLitres", "totalAmount", "signature"
    ];

    // Clear input fields and displayed text
    elementsToClear.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (element.tagName === "INPUT") {
                element.value = "";
            } else {
                element.textContent = "-"; // Set to default display
            }
        }
    });

    // Clear all table data (both text content and inputs inside tables)
    document.querySelectorAll("table tbody").forEach(tbody => tbody.innerHTML = "");

    // Clear inputs inside tables (if tables use inputs for data entry)
    document.querySelectorAll("table input").forEach(input => input.value = "");
    
    // Re-generate the table rows with the new structure
    generatePreviousDates();

    alert("All data cleared successfully");
}


document.addEventListener("DOMContentLoaded", () => {
    // Set today's date on load and generate table rows
    document.getElementById("billDate").value = new Date().toISOString().substring(0, 10);
    generatePreviousDates();

    const darkModeToggle = document.createElement("button");
    darkModeToggle.innerHTML = "🌙"; // Default icon as moon
    darkModeToggle.classList.add("dark-mode-toggle");
    document.body.appendChild(darkModeToggle);

    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeToggle.innerHTML = "☀️"; // Change to sun
    }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        document.body.style.transition = "background-color 0.3s ease-in-out, color 0.3s ease-in-out";
        
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.innerHTML = "☀️";
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.innerHTML = "🌙";
        }
    });
});
// --- End of Updated scripts.js ---