import { BookingData } from '../Booking Data.js';

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

function loadBookings() {
    const bookingData = new BookingData();
    const bookings = bookingData.getBookings();
    const bookingsContainer = document.getElementById('bookings-container');

    // Clear container before rendering
    bookingsContainer.innerHTML = '';

    // Create booking elements dynamically
    bookings.forEach(booking => {
        const bookingElement = document.createElement('div');
        bookingElement.classList.add('booking');

        bookingElement.innerHTML = `
            <div class="booking-image">
                <img src="${booking.image}" alt="${booking.alt}">
            </div>
            <div class="booking-details">
                <p><strong>Origin:</strong> ${booking.origin}</p>
                <p><strong>Boarding:</strong> ${booking.boarding}</p>
                <p><strong>Destination:</strong> ${booking.destination}</p>
                <p><strong>Landing:</strong> ${booking.landing}</p>
                <p><strong>No. of passengers:</strong> ${booking.passengers}</p>
            </div>
        `;

        bookingsContainer.appendChild(bookingElement);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadBookings();
});
