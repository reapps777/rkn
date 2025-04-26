// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize testimonials
    initTestimonials();
    
    // Set up event handlers
    setupEventHandlers();
    
    // Add resize event handler to adjust testimonial card heights
    window.addEventListener('resize', adjustTestimonialHeight);
});

// Testimonials 
const testimonials = [
    {
        text: "\"This app makes streaming my local videos a breeze. The interface is sleek and intuitive, and adding URLs is quick and easy. I love organizing my videos into categories. Support was super helpful when I had a question about playback settings, and updates keep everything running smoothly. Great app!\"",
        author: "Sarah Bennett",
        position: "Canada",
        rating: "★★★★★",
        avatar: "img_sarah.webp"
    },
    {
        text: "\"I'm impressed with this video player's performance. The UI is clean and easy to use, and playback is consistently smooth, even for high-quality videos. Sorting videos into categories is a game-changer for organization. I reached out to support with a minor issue, and they responded promptly. Regular updates are a bonus!\"",
        author: "Michael Carter",
        position: "United States",
        rating: "★★★★★",
        avatar: "img_michel.webp"
    },
    {
        text: "\"This app is perfect for managing and streaming my video content. Adding URLs is straightforward, and the player delivers reliable, high-quality playback. The interface is modern and user-friendly, and I appreciate the frequent updates that fix bugs and improve functionality. Support was quick to assist when I needed help. Highly recommend!\"",
        author: "Emma Wilson",
        position: "Australia",
        rating: "★★★★★",
        avatar: "img_emma.webp"
    }
];

function initTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (!track || !dotsContainer) return;
    
    // Clear existing content
    track.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // Create testimonial cards and dots
    testimonials.forEach((testimonial, index) => {
        const card = createTestimonialCard(testimonial, index);
        track.appendChild(card);

        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.setAttribute('data-index', index);
        dotsContainer.appendChild(dot);
    });
    
    // Set initial state
    updateTestimonialsDisplay(0);
    
    // Initial height adjustment
    setTimeout(adjustTestimonialHeight, 100);
}

function createTestimonialCard(testimonial, index) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('data-index', index);
    
    card.innerHTML = `
        <p class="testimonial-text">${testimonial.text}</p>
        <div class="testimonial-author">
            <div class="author-avatar">
                <img src="${testimonial.avatar}" alt="${testimonial.author}" onerror="this.src='/assets/avatar-placeholder.svg'">
            </div>
            <div class="author-info">
                <h4>${testimonial.author}</h4>
                <p>${testimonial.position}</p>
            </div>
            <div class="rating">${testimonial.rating}</div>
        </div>
    `;
    
    return card;
}

function updateTestimonialsDisplay(activeIndex) {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    if (!cards.length || !dots.length) return;
    
    // Update card classes
    cards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'next');
        
        if (index === activeIndex) {
            card.classList.add('active');
        } else if (index === getPrevIndex(activeIndex, cards.length)) {
            card.classList.add('prev');
        } else if (index === getNextIndex(activeIndex, cards.length)) {
            card.classList.add('next');
        }
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        if (index === activeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Adjust heights after display update
    adjustTestimonialHeight();
}

function getPrevIndex(currentIndex, totalCount) {
    return (currentIndex - 1 + totalCount) % totalCount;
}

function getNextIndex(currentIndex, totalCount) {
    return (currentIndex + 1) % totalCount;
}

function changeTestimonial(direction) {
    const cards = document.querySelectorAll('.testimonial-card');
    const activeCard = document.querySelector('.testimonial-card.active');
    
    if (!activeCard || !cards.length) return;
    
    const currentIndex = parseInt(activeCard.getAttribute('data-index'));
    let newIndex;
    
    if (direction === 'next') {
        newIndex = getNextIndex(currentIndex, cards.length);
    } else {
        newIndex = getPrevIndex(currentIndex, cards.length);
    }
    
    updateTestimonialsDisplay(newIndex);
}

// Adjust the heights of the testimonial cards and track
function adjustTestimonialHeight() {
    const activeCard = document.querySelector('.testimonial-card.active');
    const track = document.getElementById('testimonialsTrack');
    
    if (!activeCard || !track) return;
    
    // Get the height of the active card
    const cardHeight = activeCard.offsetHeight;
    
    // Set the track height to match the active card
    track.style.height = `${cardHeight}px`;
}

// Event handlers setup
function setupEventHandlers() {
    // Testimonial navigation
    const nextButton = document.getElementById('nextTestimonial');
    const prevButton = document.getElementById('prevTestimonial');
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            changeTestimonial('next');
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', function() {
            changeTestimonial('prev');
        });
    }
    
    // Dot navigation
    document.querySelectorAll('.testimonials .dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateTestimonialsDisplay(index);
        });
    });
    
    // Touch swipe support for testimonials
    setupSwipeDetection();
}

// Add swipe detection for mobile
function setupSwipeDetection() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const minSwipeDistance = 50;
        if (touchEndX < touchStartX - minSwipeDistance) {
            // Swiped left
            changeTestimonial('next');
        }
        if (touchEndX > touchStartX + minSwipeDistance) {
            // Swiped right
            changeTestimonial('prev');
        }
    }
}