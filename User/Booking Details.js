import { FlightData } from '../Flight Data.js';

document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
    loadFooter();

    const flightNumber = getFlightNumberFromURL();
    const flight = getFlightDetails(flightNumber);

    if (flight) {
        displayFlightDetails(flight);
        updatePassengerFields(flight.availableSeats);
    } else {
        document.getElementById('flight-details').textContent = "Flight details not found.";
    }

    document.querySelector('.save-button').addEventListener('click', validateInputs);
});

function loadHeader() {
    fetch('../header.html')
        .then(response => response.text())
        .then(data => document.getElementById('header-placeholder').innerHTML = data)
        .catch(err => console.error("Header load failed:", err));
}

function loadFooter() {
    fetch('../footer.html')
        .then(response => response.text())
        .then(data => document.getElementById('footer-placeholder').innerHTML = data)
        .catch(err => console.error("Footer load failed:", err));
}

function getFlightNumberFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('flightNumber');
}

function getFlightDetails(flightNumber) {
    const flightData = new FlightData();
    return flightData.getFlights().find(flight => flight.flightNumber === flightNumber);
}

function displayFlightDetails(flight) {
    const details = `
        <strong>Flight No:</strong> ${flight.flightNumber} |
        <strong>Origin:</strong> ${flight.origin} |
        <strong>Destination:</strong> ${flight.destination} |
        <strong>Boarding:</strong> ${flight.boarding} |
        <strong>Landing:</strong> ${flight.landing} |
        <strong>Available Seats:</strong> ${flight.availableSeats}
    `;
    document.getElementById('flight-details').innerHTML = details;

    const numPassengersInput = document.getElementById('num-passengers');
    numPassengersInput.max = flight.availableSeats;
    numPassengersInput.addEventListener('input', () => updatePassengerFields(flight.availableSeats));
}

function updatePassengerFields(maxSeats) {
    const numPassengers = parseInt(document.getElementById('num-passengers').value, 10);
    const container = document.getElementById('passenger-fields');
    container.innerHTML = '';

    if (numPassengers > maxSeats) {
        container.innerHTML = `<p style="color: red;">You cannot book more than ${maxSeats} seats.</p>`;
        return;
    }

    for (let i = 1; i <= numPassengers; i++) {
        container.innerHTML += `
            <div class="passenger">
                <h3>Passenger ${i}</h3>
                <label for="name-${i}">Full Name:</label>
                <input type="text" id="name-${i}" placeholder="Enter full name"><br>
                <label for="passport-id-${i}">Passport ID:</label>
                <input type="text" id="passport-id-${i}" placeholder="Enter passport ID"><br>
            </div>
        `;
    }
}

function validateInputs() {
    const numPassengers = parseInt(document.getElementById('num-passengers').value, 10);
    let isValid = true;

    for (let i = 1; i <= numPassengers; i++) {
        const name = document.getElementById(`name-${i}`);
        const passportId = document.getElementById(`passport-id-${i}`);

        if (!name.value.trim()) {
            isValid = false;
            name.style.border = "2px solid red";
        } else {
            name.style.border = "";
        }

        if (!passportId.value.trim()) {
            isValid = false;
            passportId.style.border = "2px solid red";
        } else {
            passportId.style.border = "";
        }
    }

    if (isValid) {
        alert("Booking confirmed!");
    } else {
        alert("Please fill in all passenger details.");
    }
}
