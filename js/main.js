document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
        .then(response => response.json())
        .then(businesses => {
            const listContainer = document.getElementById('business-list');
            businesses.forEach(business => {
                const div = document.createElement('div');
                div.className = 'business-item';
                div.innerHTML = `<h3 class="business-name">${business.name}</h3>
                                 <p>${business.address}</p>
                                 <p>${business.phone}</p>
                                 <a href="${business.website}" class="business-link" target="_blank">Visit Website</a>`;
                listContainer.appendChild(div);
            });
        })
        .catch(error => console.error('Error loading the data:', error));
});

function searchBusinesses() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const businessItems = document.getElementsByClassName('business-item');

    for (let i = 0; i < businessItems.length; i++) {
        let name = businessItems[i].getElementsByTagName("h3")[0];
        if (name.innerHTML.toLowerCase().indexOf(input) > -1) {
            businessItems[i].style.display = "";
        } else {
            businessItems[i].style.display = "none";
        }
    }
}
