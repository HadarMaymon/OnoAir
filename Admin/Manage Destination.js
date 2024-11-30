import { DestinationManager } from '/Destination Data.js';

document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
    loadFooter();
    renderDestinations();

    // Add event listener for the search button
    document.getElementById('searchButton').addEventListener('click', filterDestinations);

    // Add event listener for the "Enter" key in the search input
    document.getElementById('searchInput').addEventListener('keyup', (event) => {
        if (event.key === "Enter") {
            filterDestinations();
        }
    });
});

// Load the header dynamically
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

// Load the footer dynamically
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

// Render the destination table
function renderDestinations() {
    const destinationManager = new DestinationManager();
    const destinations = destinationManager.getDestinations();
    const tableBody = document.getElementById('destination-table');

    tableBody.innerHTML = '';

    destinations.forEach(destination => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${destination.departure}</td>
            <td>${destination.arrival}</td>
            <td>${destination.departureTime}</td>
            <td>${destination.arrivalTime}</td>
            <td><a href="${destination.airportWebsite}" target="_blank">${destination.airportWebsite}</a></td>
        `;
        tableBody.appendChild(row);
    });
}

// Filter destinations by search input
function filterDestinations() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#destination-table tr');

    rows.forEach(row => {
        const departure = row.cells[0].textContent.toLowerCase();
        const arrival = row.cells[1].textContent.toLowerCase();

        if (departure.includes(query) || arrival.includes(query)) {
            row.style.display = ''; // Show matching rows
        } else {
            row.style.display = 'none'; // Hide non-matching rows
        }
    });
}
