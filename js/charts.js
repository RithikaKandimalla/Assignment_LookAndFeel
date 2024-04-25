// charts.js
// Load data from JSON file
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const places = data.Places;
        const reviews = data.Reviews;

        // 1. Average Rating for Each Place (Pie Chart)
        const averageRatingByPlace = places.reduce((acc, place) => {
            const placeReviews = reviews.filter(review => review.business_id === place.business_id);
            const totalRating = placeReviews.reduce((sum, review) => sum + parseInt(review.rating), 0);
            const averageRating = totalRating / placeReviews.length || 0;
            acc.push(averageRating.toFixed(1)); // Store as an array for pie chart data
            return acc;
        }, []);

        const ctx1 = document.getElementById('averageRatingByPlaceChart').getContext('2d');
        new Chart(ctx1, {
            type: 'pie', // Change type to 'pie'
            data: {
                labels: places.map(place => place.name), // Labels are the place names
                datasets: [{
                    label: 'Average Rating',
                    data: averageRatingByPlace, // Use the array of average ratings
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        // Additional colors for each place
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        // Additional border colors for each place
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItem) {
                                // Assuming the labels array is accessible
                                let label = tooltipItem.chart.data.labels[tooltipItem.dataIndex];
                                let value = tooltipItem.formattedValue;
                                return `${label}: ${value}`;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Average Rating for Each Place'
                    }
                },
                // Disable the default labels on the pie chart to keep it clean
                plugins: {
                    legend: {
                        display: false // Disable legend to not show labels on top of the chart
                    }
                }
            }
        });

        // 2. Prices vs Places (Scatter Chart)
    const ctx2 = document.getElementById('pricesVsPlacesChart').getContext('2d');
new Chart(ctx2, {
    type: 'line',  // Change the type to 'line'
    data: {
        labels: places.map(place => place.name),  // Place names as labels
        datasets: [{
            label: 'Prices per Person',
            data: places.map(place => parseFloat(place.Price.split('/')[0].replace('*', '').trim())),  // Extracting prices
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,  // Set fill to false for a classic line chart appearance
            tension: 0.1  // Adds slight curvature to the line
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,  // Maintain an interval of 10 for prices
                    callback: function(value) {
                        return '$' + value;  // Formatting prices with a dollar sign
                    }
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Prices vs Places'
            }
        }
    }
});


        // 3. Top 5 Places by Rating (Horizontal Bar Chart)
        const sortedPlacesByRating = places.sort((a, b) => {
            const aRating = reviews.filter(review => review.business_id === a.business_id)
                .reduce((sum, review) => sum + parseInt(review.rating), 0) / reviews.filter(review => review.business_id === a.business_id).length;
            const bRating = reviews.filter(review => review.business_id === b.business_id)
                .reduce((sum, review) => sum + parseInt(review.rating), 0) / reviews.filter(review => review.business_id === b.business_id).length;
            return bRating - aRating;
        });

        const topFivePlaces = sortedPlacesByRating.slice(0, 5);

        const ctx3 = document.getElementById('topPlacesByRatingChart').getContext('2d');
        new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: topFivePlaces.map(place => place.name),
                datasets: [{
                    label: 'Average Rating',
                    data: topFivePlaces.map(place => {
                        const placeReviews = reviews.filter(review => review.business_id === place.business_id);
                        const totalRating = placeReviews.reduce((sum, review) => sum + parseInt(review.rating), 0);
                        const averageRating = totalRating / placeReviews.length;
                        return averageRating.toFixed(1);
                    }),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Top 5 Places by Rating'
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error loading data:', error));