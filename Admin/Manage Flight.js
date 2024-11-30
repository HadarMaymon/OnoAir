import { FlightData } from '../Flight Data.js';

// Load header, footer, and flights when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
    loadFooter();
    loadFlights();

    // Add event listener to the search button
    document.getElementById('searchButton').addEventListener('click', filterFlights);

    // Add event listener for "Enter" key on the search input
    document.getElementById('searchInput').addEventListener('keyup', (event) => {
        if (event.key === "Enter") {
            filterFlights();
        }
    });
});

// Function to load the header dynamically
function loadHeader() {
    fetch('../header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error("Error loading header:", error);
        });
}

// Function to load the footer dynamically
function loadFooter() {
    fetch('../footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error("Error loading footer:", error);
        });
}

// Function to load flights into the table
function loadFlights() {
    const flightData = new FlightData();
    const flights = flightData.getFlights(); 
    const flightsContainer = document.getElementById('flights-container');

    // Clear existing rows to avoid duplicates
    flightsContainer.innerHTML = '';

    // Populate the table with flight data
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

// Function to filter flights based on search input
function filterFlights() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const flightRows = document.querySelectorAll('#flights-container tr');

    flightRows.forEach(row => {
        const origin = row.cells[1].textContent.toLowerCase();
        const destination = row.cells[2].textContent.toLowerCase();

        if (origin.includes(query) || destination.includes(query)) {
            row.style.display = ''; // Show matching rows
        } else {
            row.style.display = 'none'; // Hide non-matching rows
        }
    });
}
