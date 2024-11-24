import FlightDetails from './Flight Data.js';

document.addEventListener("DOMContentLoaded", function () {
    // Load the header
    fetch('../header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    // Load the footer
    fetch('../footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });

    // Retrieve flight details from URL
    const urlParams = new URLSearchParams(window.location.search);
    const flightNumber = urlParams.get('flightNumber');

    // Get flight data from Flight Data.js
    const flightDetails = new FlightDetails();
    const flights = flightDetails.getFlights();
    const flight = flights.find(f => f.flightNumber === flightNumber);

    // Populate flight details
    if (flight) {
        document.getElementById('flight-details').innerHTML = `
            <strong>Flight No:</strong> ${flight.flightNumber}<br>
            <strong>Origin:</strong> ${flight.origin}<br>
            <strong>Destination:</strong> ${flight.destination}<br>
            <strong>Boarding Time:</strong> ${flight.boarding}<br>
            <strong>Landing Time:</strong> ${flight.landing}
        `;
    } else {
        document.getElementById('flight-details').innerText = "Flight details not found.";
    }

    // Attach event listener to the "num-passengers" input
    const numPassengersInput = document.getElementById('num-passengers');
    numPassengersInput.addEventListener('input', updatePassengerFields);

    // Initialize passenger fields
    updatePassengerFields();
});

// Function to dynamically generate passenger fields
function updatePassengerFields() {
    const numPassengers = parseInt(document.getElementById('num-passengers').value, 10);
    const passengerFieldsContainer = document.getElementById('passenger-fields');

    // Clear existing fields
    passengerFieldsContainer.innerHTML = '';

    // Add fields for each passenger
    for (let i = 1; i <= numPassengers; i++) {
        const passengerDiv = document.createElement('div');
        passengerDiv.className = 'passenger';
        passengerDiv.innerHTML = `
            <h3>Passenger ${i}</h3>
            <label for="name-${i}">Full Name:</label>
            <input type="text" id="name-${i}" name="name-${i}" placeholder="Enter name" required><br>
            <label for="passport-id-${i}">Passport ID:</label>
            <input type="text" id="passport-id-${i}" name="passport-id-${i}" placeholder="Enter Passport ID" required><br>
        `;
        passengerFieldsContainer.appendChild(passengerDiv);
    }
}
