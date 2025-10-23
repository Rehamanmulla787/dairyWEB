// --- Start of Updated firebase.js ---

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyClzVL2lyNaTLsAFqegfizFw909ji14qdo",
    authDomain: "dairysoln.firebaseapp.com",
    projectId: "dairysoln",
    storageBucket: "dairysoln.firebasestorage.app",
    messagingSenderId: "782781424996",
    appId: "1:782781424996:web:d74329e1bd9c1343810671",
    measurementId: "G-X946E1MNT0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

async function saveData() {
    document.getElementById("loader").style.display = "block";

    const billDate = document.getElementById("billDate").value;
    const farmerName = document.getElementById("farmerName").value;
    const balance = document.getElementById("balance").value;

    if (!billDate || !farmerName) {
        alert("Please enter both Bill Date and Farmer Name before saving.");
        return;
    }

    const morningData = [];
    const eveningData = [];

    document.querySelectorAll("#morningTableBody tr").forEach(row => {
        morningData.push({
            date: row.querySelector("td:first-child").textContent,
            litres: parseFloat(row.querySelector(".litres-morning").value || 0),
            fat: parseFloat(row.querySelector(".fat-morning").value || 0),
            snf: parseFloat(row.querySelector(".snf-morning").value || 0),
            rate: parseFloat(row.querySelector(".rate-morning").textContent || 0), // NEW: Save Rate
            totalAmount: parseFloat(row.querySelector(".total-amount-morning").textContent || 0),
        });
    });

    document.querySelectorAll("#eveningTableBody tr").forEach(row => {
        eveningData.push({
            date: row.querySelector("td:first-child").textContent,
            litres: parseFloat(row.querySelector(".litres-evening").value || 0),
            fat: parseFloat(row.querySelector(".fat-evening").value || 0),
            snf: parseFloat(row.querySelector(".snf-evening").value || 0),
            rate: parseFloat(row.querySelector(".rate-evening").textContent || 0), // NEW: Save Rate
            totalAmount: parseFloat(row.querySelector(".total-amount-evening").textContent || 0),
        });
    });

    let totalMorningLitres = 0, totalMorningAmount = 0;
    morningData.forEach(data => { totalMorningLitres += data.litres; totalMorningAmount += data.totalAmount; });

    let totalEveningLitres = 0, totalEveningAmount = 0;
    eveningData.forEach(data => { totalEveningLitres += data.litres; totalEveningAmount += data.totalAmount; });

    let totalLitres = totalMorningLitres + totalEveningLitres;
    let totalAmount = totalMorningAmount + totalEveningAmount;

    // Correct Firestore references using modular SDK
    const farmerRef = doc(collection(db, "milk-data"), farmerName);
    const dateRef = doc(collection(farmerRef, "date"), billDate);

    const data = {
        farmerName,
        billDate,
        balance,
        morning: morningData,
        evening: eveningData,
        totalMorningLitres,
        totalMorningAmount,
        totalEveningLitres,
        totalEveningAmount,
        totalLitres,
        totalAmount
    };

    try {
        await setDoc(dateRef, data);
        document.getElementById("loader").style.display = "none";
        alert("Data saved successfully!");
    } catch (error) {
        console.error("Error saving data: ", error);
        document.getElementById("loader").style.display = "none";
        alert("Error saving data. Please try again.");
    }
}

async function fetchSavedData() {
    const billDate = document.getElementById("billDate").value;
    const farmerName = document.getElementById("farmerName").value;

    if (!billDate || !farmerName) {
        alert("Please enter both Bill Date and Farmer Name before saving.");
        return;
    }

    document.getElementById("loader").style.display = "block";

    const farmerRef = doc(collection(db, "milk-data"), farmerName);
    const dateRef = doc(collection(farmerRef, "date"), billDate);

    try {
        const docSnap = await getDoc(dateRef);
        if (docSnap.exists()) {
            const data = docSnap.data();

            document.getElementById("balance").value = data.balance;
            document.getElementById("morningTotalLitres").textContent = data.totalMorningLitres.toFixed(2);
            document.getElementById("morningTotalAmount").textContent = data.totalMorningAmount.toFixed(2);
            document.getElementById("eveningTotalLitres").textContent = data.totalEveningLitres.toFixed(2);
            document.getElementById("eveningTotalAmount").textContent = data.totalEveningAmount.toFixed(2);
            document.getElementById("totalLitres").textContent = data.totalLitres.toFixed(2);
            document.getElementById("totalAmount").textContent = data.totalAmount.toFixed(2);

            // Populate morning table
            document.querySelectorAll("#morningTableBody tr").forEach((row, index) => {
                if (data.morning[index]) {
                    row.querySelector(".litres-morning").value = data.morning[index].litres;
                    row.querySelector(".fat-morning").value = data.morning[index].fat;
                    row.querySelector(".snf-morning").value = data.morning[index].snf;
                    row.querySelector(".rate-morning").textContent = data.morning[index].rate.toFixed(2); // NEW: Populate Rate
                    row.querySelector(".total-amount-morning").textContent = data.morning[index].totalAmount.toFixed(2);
                }
            });

            // Populate evening table
            document.querySelectorAll("#eveningTableBody tr").forEach((row, index) => {
                if (data.evening[index]) {
                    row.querySelector(".litres-evening").value = data.evening[index].litres;
                    row.querySelector(".fat-evening").value = data.evening[index].fat;
                    row.querySelector(".snf-evening").value = data.evening[index].snf;
                    row.querySelector(".rate-evening").textContent = data.evening[index].rate.toFixed(2); // NEW: Populate Rate
                    row.querySelector(".total-amount-evening").textContent = data.evening[index].totalAmount.toFixed(2);
                }
            });
        } else {
            alert("No data found for the selected date and farmer name.");
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
        alert("Error fetching data. Please try again later.");
    }

    document.getElementById("loader").style.display = "none";
}
// Ensure functions are accessible globally
window.saveData = saveData;
window.fetchSavedData = fetchSavedData;

// --- End of Updated firebase.js ---