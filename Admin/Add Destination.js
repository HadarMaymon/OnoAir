document.addEventListener("DOMContentLoaded", function () {
    // Load the header
    fetch('../header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error("Error loading header:", error);
        });

    // Load the footer
    fetch('../footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error("Error loading footer:", error);
        });

    // Form submission logic
    const form = document.getElementById("destination-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from refreshing the page

        // Get form data
        const destinationCode = document.getElementById("destination-code").value.trim();
        const destinationName = document.getElementById("destination-name").value.trim();
        const airportName = document.getElementById("airport-name").value.trim();
        const airportUrl = document.getElementById("airport-url").value.trim();
        const imageUrl = document.getElementById("image-url").value.trim();

        // Validate form data
        if (!destinationCode || !destinationName || !airportName || !airportUrl || !imageUrl) {
            alert("Please fill in all fields.");
            return;
        }

        // Create a new destination object
        const newDestination = {
            destinationCode,
            destinationName,
            airportName,
            airportUrl,
            imageUrl
        };

        // Log the new destination to the console (can be sent to a server or stored locally)
        console.log("New Destination Added:", newDestination);

        // Reset the form
        form.reset();

        // Show success message
        alert("Destination added successfully!");
    });
});
