// Load the header content
document.addEventListener("DOMContentLoaded", function () {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    // Load the footer content
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-1').innerHTML = data;
        });
});
