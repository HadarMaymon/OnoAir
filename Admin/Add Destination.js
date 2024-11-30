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

        // Log the new destination to the console (optional)
        console.log("New Destination Added:", newDestination);

        // Display success message
        const successMessage = document.createElement("div");
        successMessage.innerHTML = `
            <p style="color: blue; font-weight: bold; margin-top: 10px;">Destination added successfully!</p>
            <div style="margin-top: 10px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; background: #f9f9f9;">
                <p><strong>Code:</strong> ${newDestination.destinationCode}</p>
                <p><strong>Name:</strong> ${newDestination.destinationName}</p>
                <p><strong>Airport:</strong> ${newDestination.airportName}</p>
                <p><strong>URL:</strong> <a href="${newDestination.airportUrl}" target="_blank">${newDestination.airportUrl}</a></p>
                <p><strong>Image:</strong> <a href="${newDestination.imageUrl}" target="_blank">${newDestination.imageUrl}</a></p>
            </div>
        `;
        form.parentElement.appendChild(successMessage);

        // Reset the form
        form.reset();

        // Redirect to Manage Destination page after 5 seconds
        setTimeout(() => {
            window.location.href = "Manage Destination.html";
        }, 5000);
    });
});
