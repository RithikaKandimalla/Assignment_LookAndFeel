 let reviews = [];
let places = [];
 
// Load data from JSON file
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Handle the loaded data
        places = data.Places;
        reviews = data.Reviews;
        const placeTypes = data['Business Type'];
 
        // Render places list on the places page
        const currentPage = window.location.href.split('/').pop();
        if (currentPage === 'business-details.html') {
            const businessListContainer = document.getElementById('business-list');
            if (businessListContainer) {
                renderPlacesList(places, businessListContainer);
            }
        }
    })
    .catch(error => console.error('Error loading data:', error));
 
// Function to create a business element with basic details
const createBusinessElement = (place) => {
    const businessElement = document.createElement('div');
    businessElement.classList.add('business-item');
    businessElement.setAttribute('data-business-id', place.business_id);
 
    const imageElement = document.createElement('img');
    imageElement.src = place.image;
    imageElement.alt = place.name + ' image';
    businessElement.appendChild(imageElement);
 
    // Create a paragraph element for the place's name
    const nameElement = document.createElement('div');
    nameElement.textContent = place.name;
    businessElement.appendChild(nameElement);
 
    // Create a paragraph element for the place's address
    const addressElement = document.createElement('div');
    addressElement.textContent = `Address: ${place.address}, ${place.city}, ${place.state} ${place.zipcode}`;
    businessElement.appendChild(addressElement);
 
    // Create a paragraph element for the place's phone
    const phoneElement = document.createElement('div');
    phoneElement.textContent = `Phone: ${place.phone}`;
    businessElement.appendChild(phoneElement);
 
    // Create a link element for the place's website
    const websiteElement = document.createElement('a');
    websiteElement.href = place.website;
    websiteElement.textContent = 'Website';
    businessElement.appendChild(websiteElement);
 
    // Add review form
    const addReviewButton = document.createElement('button');
    addReviewButton.textContent = 'Add Review';
    addReviewButton.addEventListener('click', () => openAddReviewModal(place.business_id));
    businessElement.appendChild(addReviewButton);
 
    // Render reviews for the place
    const reviewsContainer = document.createElement('div');
    reviewsContainer.classList.add('reviews-container');
    const placeReviews = reviews.filter(review => review.business_id === place.business_id);
    renderReviews(placeReviews, reviewsContainer, place.business_id);
    businessElement.appendChild(reviewsContainer);
 
    return businessElement;
};
 
// Function to render reviews
// Function to render reviews
const renderReviews = (reviews, container, businessId) => {
    container.innerHTML = '';

    if (reviews.length > 0) {
        const totalRating = reviews.reduce((acc, curr) => acc + parseInt(curr.rating), 0);
        const averageRating = totalRating / reviews.length;
        const averageRatingElement = document.createElement('div');
        averageRatingElement.textContent = `Average Rating: ${averageRating.toFixed(1)}`;
        container.appendChild(averageRatingElement);

        const reviewsList = document.createElement('ul');
        reviews.forEach(review => {
            const reviewItem = document.createElement('li');
            reviewItem.textContent = `Rating: ${review.rating} - Reviewed by: ${review['Reviewed by ']}`;

            // Add edit and delete buttons for each review
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => openEditReviewModal(review, businessId), { once: true });
            reviewItem.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteReview(review.review_id, businessId), { once: true });
            reviewItem.appendChild(deleteButton);

            reviewsList.appendChild(reviewItem);
        });
        container.appendChild(reviewsList);
    } else {
        const noReviewsElement = document.createElement('div');
        noReviewsElement.textContent = 'No reviews yet.';
        container.appendChild(noReviewsElement);
    }
};

// Function to open Add Review modal
const openAddReviewModal = (businessId) => {
    const modal = document.getElementById('add-review-modal');
    modal.style.display = 'block';

    const closeButton = modal.querySelector('.close');
    closeButton.onclick = () => modal.style.display = 'none';

    const addReviewForm = document.getElementById('add-review-form');
    addReviewForm.onsubmit = (event) => {
        event.preventDefault();
        const rating = addReviewForm.rating.value;
        const reviewer = addReviewForm.reviewer.value;
        if (rating && reviewer) {
            const newReview = {
                review_id: String(Date.now()), // Unique ID based on timestamp
                business_id: businessId,
                rating: rating,
                'Reviewed by ': reviewer
            };
            reviews.push(newReview);
            // Update reviews in data.json (simulate persistence)
            updateReviewsInJSONFile(reviews);
            // Close modal
            modal.style.display = 'none';
            // Refresh the reviews container
            const placeElement = document.querySelector(`.business-item[data-business-id="${businessId}"]`);
            const reviewsContainer = placeElement.querySelector('.reviews-container');
            const placeReviews = reviews.filter(review => review.business_id === businessId);
            renderReviews(placeReviews, reviewsContainer, businessId);
        } else {
            alert('Please provide both rating and reviewer name.');
        }
    };
};
// Function to open Edit Review modal
const openEditReviewModal = (review, businessId) => {
    const modal = document.getElementById('edit-review-modal');
    modal.style.display = 'block';
 
    const closeButton = modal.querySelector('.close');
    closeButton.onclick = () => modal.style.display = 'none';
 
    const editReviewForm = document.getElementById('edit-review-form');
    editReviewForm.rating.value = review.rating;
    editReviewForm.reviewer.value = review['Reviewed by '];
 
    editReviewForm.onsubmit = (event) => {
        event.preventDefault();
        const updatedRating = editReviewForm.rating.value;
        const updatedReviewer = editReviewForm.reviewer.value;
        if (updatedRating && updatedReviewer) {
            const updatedReview = {
                ...review,
                rating: updatedRating,
                'Reviewed by ': updatedReviewer
            };
            // Update the review in the reviews array
            const reviewIndex = reviews.findIndex(r => r.review_id === review.review_id);
            reviews[reviewIndex] = updatedReview;
 
            // Update reviews in data.json (simulate persistence)
            updateReviewsInJSONFile(reviews);
 
            // Close modal
            modal.style.display = 'none';
 
            // Re-render the reviews container
            const placeElement = document.querySelector(`.business-item[data-business-id="${businessId}"]`);
            const reviewsContainer = placeElement.querySelector('.reviews-container');
            const placeReviews = reviews.filter(review => review.business_id === businessId);
            renderReviews(placeReviews, reviewsContainer, businessId);
        } else {
            alert('Please provide both rating and reviewer name.');
        }
    };
};
 
// Function to delete a review
const deleteReview = (reviewId, businessId) => {
    if (confirm('Are you sure you want to delete this review?')) {
        // Remove the review from the reviews array
        reviews = reviews.filter(review => review.review_id !== reviewId);
 
        // Update reviews in data.json (simulate persistence)
        updateReviewsInJSONFile(reviews);
 
        // Re-render the reviews container
        const placeElement = document.querySelector(`.business-item[data-business-id="${businessId}"]`);
        const reviewsContainer = placeElement.querySelector('.reviews-container');
        const placeReviews = reviews.filter(review => review.business_id === businessId);
        renderReviews(placeReviews, reviewsContainer, businessId);
    }
};
 
// Function to update reviews in the data.json file (simulated persistence)
const updateReviewsInJSONFile = (reviews) => {
    // Simulate updating reviews in JSON data (you would replace this with actual API call or storage mechanism)
    fetch('update_reviews.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviews),
    })
        .then(response => {
            if (response.ok) {
                console.log('Reviews updated successfully');
                return response.json();
            }
            throw new Error('Failed to update reviews');
        })
        .catch(error => console.error('Error updating reviews:', error));
};
// Function to render the details of the selected place
// Function to render the details of the selected place
const renderPlacesList = (places, container) => {
    places.forEach(place => {
        const businessElement = createBusinessElement(place);
        container.appendChild(businessElement);
    });
};
