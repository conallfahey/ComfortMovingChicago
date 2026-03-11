document.addEventListener('DOMContentLoaded', function() {
    const blogPosts = [
        {
            title: "Why Bigger Isn’t Always Better: Small vs. Big Movers",
            url: "/blog/blog-small-vs-big-moving-companies.html",
            badge: "Expert Advice",
            badgeClass: "bg-secondary-brand",
            date: "Mar 4, 2026",
            excerpt: "Discover why choosing a small, owner-operated moving company can save you money and stress compared to big van lines."
        },
        {
            title: "Best Time to Move in Chicago: Parking & Weather",
            url: "/blog/blog-best-time-to-move-chicago.html",
            badge: "Planning",
            badgeClass: "bg-secondary-brand",
            date: "Nov 7, 2025",
            excerpt: "From Lakeview to South Loop, learn the best months to schedule your move and how to handle CDOT permits."
        },
        {
            title: "Elevator Reservations & Loading Zones",
            url: "/blog/blog-elevator-loading-zone-permits-chicago.html",
            badge: "Logistics",
            badgeClass: "bg-brand-blue text-white",
            date: "Oct 29, 2025",
            excerpt: "High-rise move compliance made simple. Avoid tickets and delays with our step-by-step guide."
        },
        {
            title: "Moving to Wicker Park, Lincoln Park, or South Loop",
            url: "/blog/blog-moving-wicker-lincoln-south-loop.html",
            badge: "Neighborhoods",
            badgeClass: "bg-secondary-brand",
            date: "Oct 15, 2025",
            excerpt: "Local tips on parking, stairs, and timing for specific Chicago neighborhoods."
        },
        {
            title: "Office Move Planning Guide",
            url: "/blog/blog-office-move.html",
            badge: "Commercial",
            badgeClass: "bg-secondary-brand",
            date: "Nov 10, 2023",
            excerpt: "Minimize downtime and ensure a smooth transition for your business."
        },
        {
            title: "Understanding Moving Quotes",
            url: "/blog/blog-understanding-moving-quotes.html",
            badge: "Planning",
            badgeClass: "bg-secondary-brand",
            date: "Sep 29, 2023",
            excerpt: "Navigate the confusing world of moving estimates with confidence."
        },
        {
            title: "How Much to Tip Movers",
            url: "/blog/blog-tipping-movers.html",
            badge: "Etiquette",
            badgeClass: "bg-brand-blue text-white",
            date: "Sep 26, 2023",
            excerpt: "A complete guide to moving day etiquette and gratuity."
        },
        {
            title: "Moving with Pets",
            url: "/blog/blog-moving-with-pets.html",
            badge: "Pet Friendly",
            badgeClass: "bg-secondary-brand",
            date: "Sep 22, 2023",
            excerpt: "Keep your furry friends safe and happy during the move."
        },
        {
            title: "The Ultimate Moving Checklist",
            url: "/blog/blog-moving-checklist.html",
            badge: "Planning",
            badgeClass: "bg-brand-blue text-white",
            date: "Sep 18, 2023",
            excerpt: "A week-by-week guide to a smooth and organized move."
        },
        {
            title: "Expert Packing Tips",
            url: "/blog/blog-packing-tips.html",
            badge: "Packing",
            badgeClass: "bg-secondary-brand",
            date: "Sep 15, 2023",
            excerpt: "Pack efficiently and ensure your belongings arrive safely."
        },
        {
            title: "Change of Address Checklist",
            url: "/blog/blog-change-of-address.html",
            badge: "Essentials",
            badgeClass: "bg-secondary-brand",
            date: "Sep 19, 2023",
            excerpt: "Don't forget to update your address with these key organizations and services."
        },
        {
            title: "Declutter Before You Move",
            url: "/blog/blog-decluttering-before-move.html",
            badge: "Tips",
            badgeClass: "bg-brand-blue text-white",
            date: "Sep 12, 2023",
            excerpt: "Save time and money by downsizing your belongings before the movers arrive."
        },
        {
            title: "Hoisting: What It Is and Why You Should Use It",
            url: "/blog/blog-hoisting-benefits.html",
            badge: "Specialty",
            badgeClass: "bg-secondary-brand",
            date: "Aug 12, 2023",
            excerpt: "Safely move large items when stairs or elevators aren’t an option."
        },
        {
            title: "5 Tips for a Stress-Free Moving Day",
            url: "/blog/blog-stress-free-moving-day.html",
            badge: "Tips",
            badgeClass: "bg-brand-blue text-white",
            date: "Aug 15, 2023",
            excerpt: "How to prepare for the big day and keep your sanity intact with proper planning."
        },
        {
            title: "First Apartment Essentials",
            url: "/blog/blog-first-apartment.html",
            badge: "Checklist",
            badgeClass: "bg-brand-blue text-white",
            date: "Aug 1, 2023",
            excerpt: "Everything you need to turn your new apartment into a home."
        },
        {
            title: "Navigating Chicago's Neighborhoods",
            url: "/blog/blog-chicago-neighborhoods-guide.html",
            badge: "Guide",
            badgeClass: "bg-secondary-brand",
            date: "July 22, 2023",
            excerpt: "What to know about moving in different parts of the Windy City, from high-rises to walk-ups."
        },
        {
            title: "The Ultimate Guide to Packing Fragile Items",
            url: "/blog/blog-packing-fragile-items.html",
            badge: "Packing",
            badgeClass: "bg-brand-blue text-white",
            date: "June 10, 2023",
            excerpt: "Protect your valuables with these professional packing techniques for dishes and art."
        },
        {
            title: "Eco-Friendly Moving Tips",
            url: "/blog/blog-sustainable-moving.html",
            badge: "Eco-Friendly",
            badgeClass: "bg-secondary-brand",
            date: "Apr 22, 2023",
            excerpt: "Reduce waste and move sustainably with these green practices."
        }
    ];

    const container = document.getElementById('featured-blog-container');
    if (!container) return;

    // Shuffle and pick 3
    const shuffled = [...blogPosts].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    let html = '';
    selected.forEach(post => {
        html += `
        <div class="col-md-6 col-lg-4 d-flex align-items-stretch">
            <a href="${post.url}" class="text-decoration-none w-100">
                <div class="service-card-modern h-100 d-flex flex-column">
                    <div class="mb-3">
                        <span class="badge ${post.badgeClass} rounded-pill">${post.badge}</span>
                        <span class="text-muted small ms-2">${post.date}</span>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-3">${post.title}</h3>
                    <p class="text-muted mb-4 flex-grow-1">${post.excerpt}</p>
                    <div class="d-flex align-items-center text-brand-blue fw-bold mt-auto">
                        Read Article <i class="bi bi-arrow-right ms-2"></i>
                    </div>
                </div>
            </a>
        </div>
        `;
    });

    container.innerHTML = html;
});
