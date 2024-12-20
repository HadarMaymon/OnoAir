import { FlightData } from '../Flight Data.js';

document.addEventListener("DOMContentLoaded", () => {
    renderFlights();

    document.getElementById('searchButton').addEventListener('click', filterFlights);

    document.getElementById('searchInput').addEventListener('keyup', (event) => {
        if (event.key === "Enter") {
            filterFlights();
        }
    });
});

function renderFlights() {
    const flightData = new FlightData();
    const flights = flightData.getFlights();
    const flightsContainer = document.getElementById('flights-container');

    flightsContainer.innerHTML = '';

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

        const actionCell = document.createElement('td');
        const bookButton = document.createElement('button');
        bookButton.className = 'book-button';
        bookButton.textContent = 'Book';
        bookButton.addEventListener('click', () => {
            goToBookingDetails(flight);
        });

        actionCell.appendChild(bookButton);
        row.appendChild(actionCell);

        flightsContainer.appendChild(row);
    });
}

function goToBookingDetails(flight) {
    const queryParams = new URLSearchParams({
        flightNumber: flight.flightNumber,
        origin: flight.origin,
        destination: flight.destination,
        boarding: flight.boarding,
        landing: flight.landing,
        availableSeats: flight.availableSeats
    });

    window.location.href = `./Booking Details.html?${queryParams.toString()}`;
}

function filterFlights() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#flights-container tr');
    let visibleRows = 0;

    rows.forEach(row => {
        const origin = row.cells[1].textContent.toLowerCase();
        const destination = row.cells[2].textContent.toLowerCase();

        if (origin.includes(query) || destination.includes(query)) {
            row.style.display = ''; // Show matching rows
            visibleRows++;
        } else {
            row.style.display = 'none'; // Hide non-matching rows
        }
    });

    const messageContainer = document.getElementById('no-results-message');
    if (visibleRows === 0) {
        messageContainer.textContent = `No flights match your search for "${query}".`;
        messageContainer.style.display = 'block'; // Show the message
    } else {
        messageContainer.style.display = 'none'; // Hide the message
    }
}
