import FlightDetails from './Flight Data.js';

function renderFlights() {
    const flightDetails = new FlightDetails(); // Instantiate the class
    const flights = flightDetails.getFlights(); // Retrieve the flights data
    const flightsContainer = document.getElementById('flights-container'); // Table body element

    flights.forEach(flight => {
        const row = document.createElement('tr');
        const bookButton = document.createElement('button');

        bookButton.className = 'book-button';
        bookButton.textContent = 'Book';
        bookButton.addEventListener('click', () => {
            goToBookingDetails(flight.flightNumber, flight.boarding, flight.landing, flight.availableSeats);
        });

        // Add available seats to the table
        row.innerHTML = `
            <td>${flight.flightNumber}</td>
            <td>${flight.origin}</td>
            <td>${flight.destination}</td>
            <td>${flight.boarding}</td>
            <td>${flight.landing}</td>
            <td>${flight.availableSeats}</td> <!-- Available seats -->
        `;

        const actionCell = document.createElement('td');
        actionCell.appendChild(bookButton);

        row.appendChild(actionCell);
        flightsContainer.appendChild(row);
    });
}

function goToBookingDetails(flightNumber, boarding, landing, availableSeats) {
    // Update path to Booking Details.html since both are in the same folder
    window.location.href = `./Booking Details.html?flightNumber=${flightNumber}&boarding=${encodeURIComponent(boarding)}&landing=${encodeURIComponent(landing)}&availableSeats=${availableSeats}`;
}

document.addEventListener('DOMContentLoaded', renderFlights);