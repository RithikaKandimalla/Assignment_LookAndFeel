 // Load data from JSON file
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Handle the loaded data
        const places = data.Places;
        const currentPage = window.location.href.split('/').pop();
        if (currentPage === 'business.html') {
            const businessDetailsContainer = document.getElementById('business-details');
            if (businessDetailsContainer) {
                renderBusinessDetails(places, businessDetailsContainer);
            }
        }
    })
    .catch(error => console.error('Error loading data:', error));

// Function to render business details table
const renderBusinessDetails = (places, container) => {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Name</th><th>Weekday Timings</th><th>Weekend Timings</th><th>Price</th>';
    table.appendChild(headerRow);

    places.forEach(place => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${place.name}</td>
            <td>${place.timings.Weekdays}</td>
            <td>${place.timings.Weekends}</td>
            <td>${place.Price}</td>
        `;
        table.appendChild(row);
    });

    container.appendChild(table);
};
