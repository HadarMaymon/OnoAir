import { FlightData } from '../Flight Data.js';

document.addEventListener("DOMContentLoaded", () => {
    // Load the header and footer
    loadHeader();
    loadFooter();

    // Populate the dropdowns for origin and destination
    populateAirportOptions();

    // Add form submission event listener
    document.getElementById('add-flight-form').addEventListener('submit', validateAndAddFlight);
});

function loadHeader() {
    fetch('../header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));
}

function loadFooter() {
    fetch('../footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

function populateAirportOptions() {
    const flightData = new FlightData();
    const flights = flightData.getFlights();

    // Use a Set to store unique airport names
    const airports = new Set();

    flights.forEach(flight => {
        airports.add(flight.origin);
        airports.add(flight.destination);
    });

    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');

    // Clear existing options
    originSelect.innerHTML = '<option value="">Select Origin</option>';
    destinationSelect.innerHTML = '<option value="">Select Destination</option>';

    // Populate dropdowns with unique airports
    airports.forEach(airport => {
        const originOption = document.createElement('option');
        originOption.value = airport;
        originOption.textContent = airport;

        const destinationOption = document.createElement('option');
        destinationOption.value = airport;
        destinationOption.textContent = airport;

        originSelect.appendChild(originOption);
        destinationSelect.appendChild(destinationOption);
    });
}

document.getElementById('add-flight-form').addEventListener('submit', validateAndAddFlight);

function validateAndAddFlight(event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve form values
    const flightNo = document.getElementById('flight-no').value.trim();
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const boardingDate = document.getElementById('boarding-date').value;
    const boardingTime = document.getElementById('boarding-time').value;
    const arrivalDate = document.getElementById('arrival-date').value;
    const arrivalTime = document.getElementById('arrival-time').value;
    const noOfSeats = document.getElementById('no-of-seats').value;

    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = ''; // Clear any previous messages

    // Reset input styles
    const inputs = document.querySelectorAll('#add-flight-form input, #add-flight-form select');
    inputs.forEach(input => input.classList.remove('error-border'));

    // Validation
    let isValid = true;
    const messages = [];

    if (!flightNo) {
        isValid = false;
        document.getElementById('flight-no').classList.add('error-border');
        messages.push("Flight number is required.");
    }

    if (!origin || !destination) {
        isValid = false;
        if (!origin) document.getElementById('origin').classList.add('error-border');
        if (!destination) document.getElementById('destination').classList.add('error-border');
        messages.push("Both origin and destination must be selected.");
    }

    if (origin === destination) {
        isValid = false;
        document.getElementById('destination').classList.add('error-border');
        messages.push("Origin and destination cannot be the same.");
    }

    if (!boardingDate || !boardingTime) {
        isValid = false;
        if (!boardingDate) document.getElementById('boarding-date').classList.add('error-border');
        if (!boardingTime) document.getElementById('boarding-time').classList.add('error-border');
        messages.push("Boarding date and time must be selected.");
    }

    if (!arrivalDate || !arrivalTime) {
        isValid = false;
        if (!arrivalDate) document.getElementById('arrival-date').classList.add('error-border');
        if (!arrivalTime) document.getElementById('arrival-time').classList.add('error-border');
        messages.push("Arrival date and time must be selected.");
    }

    const boardingDateTime = new Date(`${boardingDate}T${boardingTime}`);
    const arrivalDateTime = new Date(`${arrivalDate}T${arrivalTime}`);

    if (boardingDateTime >= arrivalDateTime) {
        isValid = false;
        document.getElementById('arrival-date').classList.add('error-border');
        document.getElementById('arrival-time').classList.add('error-border');
        messages.push("Arrival date and time must be after boarding date and time.");
    }

    if (boardingDateTime < new Date()) {
        isValid = false;
        document.getElementById('boarding-date').classList.add('error-border');
        document.getElementById('boarding-time').classList.add('error-border');
        messages.push("Boarding date and time cannot be in the past.");
    }

    if (!noOfSeats || noOfSeats < 1 || noOfSeats > 300) {
        isValid = false;
        document.getElementById('no-of-seats').classList.add('error-border');
        messages.push("Number of seats must be between 1 and 300.");
    }

    if (!isValid) {
        const errorBox = document.createElement('div');
        errorBox.classList.add('error-box');
        errorBox.innerHTML = `
            <p class="error-summary">Please correct the errors above to proceed:</p>
            <ul>
                ${messages.map(msg => `<li>${msg}</li>`).join('')}
            </ul>
        `;
        messageContainer.appendChild(errorBox);
        return;
    }

    // Success message and flight details
    const successMessage = `
        <p class="success-message">Flight added successfully!</p>
        <div class="flight-details-container">
            <p><strong>Flight No:</strong> ${flightNo}</p>
            <p><strong>Origin:</strong> ${origin}</p>
            <p><strong>Destination:</strong> ${destination}</p>
            <p><strong>Boarding:</strong> ${boardingDateTime.toLocaleString()}</p>
            <p><strong>Arrival:</strong> ${arrivalDateTime.toLocaleString()}</p>
            <p><strong>Number of Seats:</strong> ${noOfSeats}</p>
        </div>
    `;
    messageContainer.innerHTML = successMessage;

    // Redirect to Manage Flight page after 5 seconds
    setTimeout(() => {
        window.location.href = "Manage Flight.html";
    }, 5000);
}
