// Load data from JSON file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Handle the loaded data
    const places = data.Places;
    const reviews = data.Reviews;
    const businessTypes = data.BusinessType;

    // Render featured businesses on the home page
    const featuredBusinessesContainer = document.getElementById('featured-businesses');
    if (featuredBusinessesContainer) {
      const featuredBusinesses = places.slice(0, 3);
      featuredBusinesses.forEach(business => {
        const businessElement = document.createElement('div');
        businessElement.textContent = business.name;
        featuredBusinessesContainer.appendChild(businessElement);
      });
    }

    // Render business list on the businesses page
    const businessListContainer = document.getElementById('business-list');
    if (businessListContainer) {
      places.forEach(business => {
        const businessElement = document.createElement('div');
        businessElement.textContent = business.name;
        businessElement.addEventListener('click', () => {
          renderBusinessDetails(business);
          window.location.href = 'business-details.html';
        });
        businessListContainer.appendChild(businessElement);
      });
    }

    // Render business details on the business-details page
    const renderBusinessDetails = (business) => {
      const businessName = document.getElementById('business-name');
      const businessLogo = document.getElementById('business-logo');
      const businessAddress = document.getElementById('business-address');
      const businessPhone = document.getElementById('business-phone');
      const businessWebsite = document.getElementById('business-website');
      const businessReviewsContainer = document.getElementById('business-reviews');

      if (businessName && businessLogo && businessAddress && businessPhone && businessWebsite && businessReviewsContainer) {
        businessName.textContent = business.name;
        businessLogo.src = 'img/usf-logo-png-2.png'; // Replace with your logo file path
        businessAddress.textContent = `${business.address}, ${business.city}, ${business.state} ${business.zipcode}`;
        businessPhone.textContent = business.phone;
        businessWebsite.href = business.website;

        // Clear existing reviews
        businessReviewsContainer.innerHTML = '';

        // Render reviews for the business
        const businessReviews = reviews.filter(review => review.business_id === business.business_id);
        businessReviews.forEach(review => {
          const reviewElement = document.createElement('div');
          reviewElement.textContent = `${review.rating} stars by ${review.Reviewed_by}`;
          businessReviewsContainer.appendChild(reviewElement);
        });
      }
    };

    // Check the current page URL and render the appropriate content
    const currentPage = window.location.href.split('/').pop();
    if (currentPage === 'business-details.html') {
      const urlParams = new URLSearchParams(window.location.search);
      const businessId = urlParams.get('id');
      const business = places.find(place => place.business_id === businessId);
      if (business) {
        renderBusinessDetails(business);
      }
    }
  })
  .catch(error => console.error('Error loading data:', error));

 
