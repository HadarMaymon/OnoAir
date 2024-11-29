import FlightDetails from '/Flight Data.js';

document.addEventListener("DOMContentLoaded", function () {
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

    loadFlights();
});

function loadFlights() {
    const flightDetails = new FlightDetails();
    const flights = flightDetails.getFlights();
    const flightsContainer = document.getElementById('flights-container');

    flights.forEach(flight => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${flight.flightNumber}</td>
            <td>${flight.origin}</td>
            <td>${flight.destination}</td>
            <td>${flight.boarding}</td>
            <td>${flight.landing}</td>
            <td>${flight.availableSeats}</td>
        `;
        flightsContainer.appendChild(row);
    });
}
