document.addEventListener('DOMContentLoaded', function() {
    const reviewsContainer = document.querySelector('.reviews-scroll-container');
    if (!reviewsContainer) return;

    fetch('/reviews.json')
        .then(response => response.json())
        .then(data => {
            const reviews = data.reviews || [];
            const fiveStarReviews = reviews.filter(review => review.starRating === 'FIVE' || review.starRating === 5);
            
            if (fiveStarReviews.length === 0) return;

            // Select 4 random reviews
            const selectedReviews = [];
            const shuffled = [...fiveStarReviews].sort(() => 0.5 - Math.random());
            // Get up to 4 reviews
            const count = Math.min(4, shuffled.length);
            for (let i = 0; i < count; i++) {
                selectedReviews.push(shuffled[i]);
            }

            // Render Reviews
            renderReviews(selectedReviews, reviewsContainer);

            // Update Schema
            updateSchema(selectedReviews, fiveStarReviews.length);
        })
        .catch(error => console.error('Error loading reviews:', error));
});

function renderReviews(reviews, container) {
    container.innerHTML = ''; // Clear existing content

    reviews.forEach(review => {
        const name = review.reviewer.displayName;
        const comment = review.comment || "No comment provided.";
        const date = new Date(review.createTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const avatarColor = getRandomColor();

        const reviewHtml = `
            <div class="review-item">
                <div class="d-flex gap-3 align-items-start">
                    <div class="review-avatar-img" style="background-color: ${avatarColor}; color: white; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: 50%; font-weight: bold;">${initials}</div>
                    <div>
                        <div class="review-author fw-bold">${name}</div>
                        <div class="d-flex text-secondary-brand small my-1">
                            <i class="bi bi-star-fill text-warning"></i>
                            <i class="bi bi-star-fill text-warning"></i>
                            <i class="bi bi-star-fill text-warning"></i>
                            <i class="bi bi-star-fill text-warning"></i>
                            <i class="bi bi-star-fill text-warning"></i>
                        </div>
                        <div class="review-date text-muted small">${date}</div>
                    </div>
                </div>
                <p class="review-text mt-2">"${comment}"</p>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', reviewHtml);
    });
    
    // Re-add the "View All" button at the bottom of the container if needed, 
    // but the design has it outside or at the bottom. 
    // In the original HTML, .google-review-btn-container was a sibling of .reviews-scroll-container, 
    // but inside .reviews-card. 
    // The .reviews-scroll-container contained .review-item elements.
    // So we just append items to .reviews-scroll-container.
}

function updateSchema(displayedReviews, totalCount) {
    const schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (!schemaScript) return;

    try {
        const schema = JSON.parse(schemaScript.textContent);
        
        // Update AggregateRating
        if (schema.aggregateRating) {
            schema.aggregateRating.reviewCount = Math.max(schema.aggregateRating.reviewCount, totalCount);
        }

        // Add Review objects
        schema.review = displayedReviews.map(review => ({
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": review.reviewer.displayName
            },
            "datePublished": review.createTime.split('T')[0],
            "reviewBody": review.comment || "",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": 5,
                "bestRating": 5,
                "worstRating": 1
            }
        }));

        schemaScript.textContent = JSON.stringify(schema, null, 2);
    } catch (e) {
        console.error('Error updating schema:', e);
    }
}

function getRandomColor() {
    const colors = ['#28a745', '#0d6efd', '#6f42c1', '#dc3545', '#fd7e14', '#20c997'];
    return colors[Math.floor(Math.random() * colors.length)];
}
