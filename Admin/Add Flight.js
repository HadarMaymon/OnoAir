const airports = [
    "Tel Aviv (Ben Gurion Airport)",
    "New York (JFK Airport)",
    "London (Heathrow Airport)",
    "Paris (Charles de Gaulle Airport)",
    "Tokyo (Haneda Airport)",
    "Dubai (Dubai International Airport)",
    "Berlin (Brandenburg Airport)",
    "Sydney (Kingsford Smith Airport)",
    "Rome (Leonardo da Vinci Airport)",
    "Singapore (Changi Airport)"
];

function populateAirportOptions() {
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');

    airports.forEach(airport => {
        const optionOrigin = document.createElement('option');
        optionOrigin.value = airport;
        optionOrigin.textContent = airport;
        originSelect.appendChild(optionOrigin);

        const optionDestination = document.createElement('option');
        optionDestination.value = airport;
        optionDestination.textContent = airport;
        destinationSelect.appendChild(optionDestination);
    });
}

function validateForm(event) {
    event.preventDefault(); // Prevent form submission

    const flightNo = document.getElementById('flight-no').value.trim();
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const boardingDate = document.getElementById('boarding-date').value;
    const boardingTime = document.getElementById('boarding-time').value;
    const arrivalDate = document.getElementById('arrival-date').value;
    const arrivalTime = document.getElementById('arrival-time').value;
    const noOfSeats = document.getElementById('no-of-seats').value;

    // Validation checks
    if (!flightNo) {
        alert("Please enter the flight number.");
        return;
    }

    if (!origin || !destination) {
        alert("Please select both origin and destination.");
        return;
    }

    if (origin === destination) {
        alert("Origin and destination cannot be the same.");
        return;
    }

    if (!boardingDate || !boardingTime) {
        alert("Please select the boarding date and time.");
        return;
    }

    if (!arrivalDate || !arrivalTime) {
        alert("Please select the arrival date and time.");
        return;
    }

    if (new Date(`${boardingDate}T${boardingTime}`) >= new Date(`${arrivalDate}T${arrivalTime}`)) {
        alert("Arrival date and time must be after boarding date and time.");
        return;
    }

    if (!noOfSeats || noOfSeats < 1 || noOfSeats > 300) {
        alert("Please enter a valid number of seats (1-300).");
        return;
    }

    // Success alert
    alert("Flight added successfully!");

    // Reset form fields
    document.getElementById('add-flight-form').reset();
}

document.addEventListener("DOMContentLoaded", function() {
    // Load header and footer
    fetch('../header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    fetch('../footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });

    // Populate airport options
    populateAirportOptions();

    // Add form validation
    document.getElementById('add-flight-form').addEventListener('submit', validateForm);
});
