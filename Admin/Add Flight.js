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
    event.preventDefault(); // Prevent default form submission behavior

    // Retrieve form values
    const flightNo = document.getElementById('flight-no').value.trim();
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const boardingDate = document.getElementById('boarding-date').value;
    const boardingTime = document.getElementById('boarding-time').value;
    const arrivalDate = document.getElementById('arrival-date').value;
    const arrivalTime = document.getElementById('arrival-time').value;
    const noOfSeats = document.getElementById('no-of-seats').value;

    // Validation logic
    if (!flightNo) {
        alert("Error: Please enter the flight number.");
        return;
    }

    if (!origin || !destination) {
        alert("Error: Please select both origin and destination.");
        return;
    }

    if (origin === destination) {
        alert("Error: Origin and destination cannot be the same.");
        return;
    }

    if (!boardingDate || !boardingTime) {
        alert("Error: Please select the boarding date and time.");
        return;
    }

    if (!arrivalDate || !arrivalTime) {
        alert("Error: Please select the arrival date and time.");
        return;
    }

    const boardingDateTime = new Date(`${boardingDate}T${boardingTime}`);
    const arrivalDateTime = new Date(`${arrivalDate}T${arrivalTime}`);

    if (boardingDateTime >= arrivalDateTime) {
        alert("Error: Arrival date and time must be after boarding date and time.");
        return;
    }

    if (!noOfSeats || noOfSeats < 1 || noOfSeats > 300) {
        alert("Error: Please enter a valid number of seats (1-300).");
        return;
    }

    // Show success message
    alert("Flight added successfully!");

    // Redirect to Manage Flight page
    window.location.href = "Manage Flight.html";
}

document.addEventListener("DOMContentLoaded", function () {
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

    // Attach form submission event listener
    document.getElementById('add-flight-form').addEventListener('submit', validateForm);
});
