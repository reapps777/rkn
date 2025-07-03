document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    const initMainContent = () => {
        if (splashScreen) splashScreen.style.display = 'none';
        if (mainContent) {
            mainContent.style.display = 'block';
            // Initialize animations
            loadFeatures();
            loadBlogPosts();
            initScrollAnimations();
            initHeaderAnimations();
            initStatsAnimation();
        }
    };

    // Use PerformanceNavigationTiming API to check navigation type
    const navigationEntries = performance.getEntriesByType("navigation");
    if (navigationEntries.length > 0 && navigationEntries[0].type === 'back_forward') {
        // If navigating back, skip splash screen and show content immediately.
        initMainContent();
    } else {
        // For initial load or reload, show splash screen for 3 seconds.
        setTimeout(initMainContent, 3000);
    }
});

// Parallax mouse move for header phones
function initHeaderAnimations() {
    const phone1 = document.querySelector('.phone1');
    const phone2 = document.querySelector('.phone2');
    const header = document.querySelector('.header');

    if (!header || !phone1 || !phone2) return;

    header.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = header;
        
        const xPos = (clientX / offsetWidth - 0.5) * 20; // Intensity
        const yPos = (clientY / offsetHeight - 0.5) * 20;

        // Apply transform, preserving original rotation and base translation
        phone1.style.transform = `translate(${-xPos}px, ${-yPos}px) rotate(-15deg)`;
        phone2.style.transform = `translate(${xPos}px, ${yPos}px) rotate(15deg)`;
    });
}

// Animate numbers counting up
function initStatsAnimation() {
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;

    const animateCountUp = (el) => {
        const text = el.dataset.value || el.innerText;
        const target = parseFloat(text.replace(/[^0-9.]/g, ''));
        const suffix = text.replace(/[0-9.]/g, '');

        if (isNaN(target)) return;

        let current = 0;
        const duration = 2000; // 2 seconds
        const stepTime = 16; // roughly 60fps
        const steps = duration / stepTime;
        const increment = target / steps;

        const updateCount = () => {
            current += increment;
            if (current < target) {
                let displayValue = (target % 1 !== 0) ? current.toFixed(1) : Math.ceil(current);
                el.innerText = displayValue + suffix;
                requestAnimationFrame(updateCount);
            } else {
                el.innerText = text;
            }
        };
        
        el.innerText = '0' + suffix;
        requestAnimationFrame(updateCount);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat h3');
                statNumbers.forEach(animateCountUp);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 });

    observer.observe(statsSection);
}

// Load features from JSON
async function loadFeatures() {
    try {
        const response = await fetch('assets/features.json');
        const features = await response.json();
        
        const featuresSection = document.getElementById('features');
        featuresSection.innerHTML = '';
        
        features.forEach((feature, index) => {
            const featureElement = createFeatureElement(feature, index);
            featuresSection.appendChild(featureElement);
        });
        
        initScrollAnimations();
    } catch (error) {
        console.error('Error loading features:', error);
        loadDefaultFeatures();
    }
}

// Create feature element
function createFeatureElement(feature, index) {
    const featureDiv = document.createElement('div');
    featureDiv.className = 'feature';
    
    featureDiv.innerHTML = `
        <div class="feature-content">
            <div class="feature-text">
                <h2>${feature.title}</h2>
                <p>${feature.description}</p>
            </div>
            <div class="feature-image">
                <div class="feature-phones">
                    <img src="${feature.image2}" alt="Feature Phone" class="feature-phone" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDE2MCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMzIwIiByeD0iMjAiIGZpbGw9IiMzMzMiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI2MCIgeT0iMTQwIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMSA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDMgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+'">
                </div>
            </div>
        </div>
    `;
    
    if (index % 2 !== 0) {
        featureDiv.querySelector('.feature-content').classList.add('reverse');
    }

    return featureDiv;
}

async function loadBlogPosts() {
    try {
        const response = await fetch('assets/blog.json');
        const blogPosts = await response.json();
        
        const blogGrid = document.getElementById('blog-grid');
        blogGrid.innerHTML = '';
        
        // Limit to 3 blog posts maximum
        const limitedPosts = blogPosts.slice(0, 3);
        
        limitedPosts.forEach(post => {
            const blogCard = createBlogCard(post);
            blogGrid.appendChild(blogCard);
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
        loadDefaultBlogPosts();
    }
}

// Create blog card element
function createBlogCard(post) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'blog-card';
    cardDiv.onclick = () => openBlogPost(post.id);
    
    cardDiv.innerHTML = `
        <div class="blog-card-image">
            <img src="${post.image}" alt="${post.title}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNDQ0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNiI+QmxvZyBJbWFnZTwvdGV4dD4KPC9zdmc+'">
        </div>
        <div class="blog-card-content">
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="blog-card-meta">${post.date}</div>
        </div>
    `;
    
    return cardDiv;
}

// Open blog post
function openBlogPost(postId) {
    window.location.href = `blog.html?id=${postId}`;
}

// Initialize scroll animations for features
function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.feature');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}
