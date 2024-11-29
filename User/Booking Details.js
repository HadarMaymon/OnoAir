import FlightDetails from '../Flight Data.js';

document.addEventListener("DOMContentLoaded", () => {
    // Ensure header and footer are loaded
    loadHeader();
    loadFooter();

    // Retrieve flight info from the URL
    const flightNumber = getFlightNumberFromURL();
    const flight = getFlightDetails(flightNumber);

    // If flight is found, display its details and initialize passenger input
    if (flight) {
        displayFlightDetails(flight);
        setupPassengerInput(flight.availableSeats);
    } else {
        showError("Flight details not found.");
    }

    // Attach event listener to Save button
    const saveButton = document.querySelector('.save-button');
    if (saveButton) {
        saveButton.addEventListener('click', validateBookingInputs);
    } else {
        console.error("Save button not found. Ensure the button has the 'save-button' class.");
    }
});

// Load header dynamically
function loadHeader() {
    fetch('../header.html')
        .then(response => response.text())
        .then(data => document.getElementById('header-placeholder').innerHTML = data)
        .catch(err => console.error("Header load failed:", err));
}

// Load footer dynamically
function loadFooter() {
    fetch('../footer.html')
        .then(response => response.text())
        .then(data => document.getElementById('footer-placeholder').innerHTML = data)
        .catch(err => console.error("Footer load failed:", err));
}

// Extract flight number from URL
function getFlightNumberFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('flightNumber');
}

// Retrieve flight details based on flight number
function getFlightDetails(flightNumber) {
    const flightDetails = new FlightDetails();
    return flightDetails.getFlights().find(flight => flight.flightNumber === flightNumber);
}

// Display flight information in the DOM
function displayFlightDetails(flight) {
    const flightInfo = `
        <strong>Flight No:</strong> ${flight.flightNumber}<br>
        <strong>Origin:</strong> ${flight.origin}<br>
        <strong>Destination:</strong> ${flight.destination}<br>
        <strong>Boarding Time:</strong> ${flight.boarding}<br>
        <strong>Landing Time:</strong> ${flight.landing}<br>
        <strong>Available Seats:</strong> ${flight.availableSeats}
    `;
    document.getElementById('flight-details').innerHTML = flightInfo;

    // Set max passengers based on available seats
    const numPassengersInput = document.getElementById('num-passengers');
    numPassengersInput.max = flight.availableSeats;

    // Add event listener for passenger input changes
    numPassengersInput.addEventListener('input', () => updatePassengerFields(flight.availableSeats));
}

// Generate passenger input fields dynamically
function updatePassengerFields(maxSeats) {
    const numPassengers = parseInt(document.getElementById('num-passengers').value, 10);
    const container = document.getElementById('passenger-fields');
    container.innerHTML = '';

    // Check if input exceeds available seats
    if (numPassengers > maxSeats) {
        container.innerHTML = `<p style="color: red;">You can't book more than ${maxSeats} seats.</p>`;
        return;
    }

    // Generate fields for each passenger
    for (let i = 1; i <= numPassengers; i++) {
        container.innerHTML += `
            <div class="passenger">
                <h3>Passenger ${i}</h3>
                <label for="name-${i}">Full Name:</label>
                <input type="text" id="name-${i}" placeholder="Enter full name"><br>
                <label for="passport-${i}">Passport ID:</label>
                <input type="text" id="passport-${i}" placeholder="Enter passport ID"><br>
            </div>
        `;
    }
}

// Function to validate inputs
export function validateInputs() {
    console.log('here')
    const numPassengers = parseInt(document.getElementById('num-passengers').value, 10);
    const passengerFieldsContainer = document.getElementById('passenger-fields');
    let isValid = true;

    // Loop through each passenger's inputs to validate
    for (let i = 1; i <= numPassengers; i++) {
        const nameInput = document.getElementById(`name-${i}`);
        const passportInput = document.getElementById(`passport-id-${i}`);

        // Check if name is filled
        if (!nameInput.value.trim()) {
            isValid = false;
            nameInput.style.border = "2px solid red"; // Highlight invalid input
        } else {
            nameInput.style.border = ""; // Remove highlight if valid
        }

        // Check if passport ID is filled
        if (!passportInput.value.trim()) {
            isValid = false;
            passportInput.style.border = "2px solid red"; // Highlight invalid input
        } else {
            passportInput.style.border = ""; // Remove highlight if valid
        }
    }

    // Show alert only if all inputs are valid
    if (isValid) {
        alert("Order is confirmed");
    } else {
        alert("Please fill all required fields.");
    }
}
