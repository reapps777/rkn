document.addEventListener('DOMContentLoaded', function() {
    loadBlogPost();
    loadPopularPosts();
});

// Get post ID from URL
function getPostId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1';
}

// Load blog post content
async function loadBlogPost() {
    const postId = getPostId();
    
    try {
        const response = await fetch('assets/blog.json');
        const blogPosts = await response.json();
        
        const post = blogPosts.find(p => p.id.toString() === postId);
        
        if (post) {
            displayBlogPost(post);
        } else {
            displayDefaultPost();
        }
    } catch (error) {
        console.error('Error loading blog post:', error);
        displayDefaultPost();
    }
}

// Display blog post
function displayBlogPost(post) {
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-author').textContent = post.author || 'Defanzo';
    document.getElementById('post-date').textContent = post.date;
    
    const postImage = document.getElementById('post-image');
    postImage.src = post.image;
    postImage.alt = post.title;
    postImage.onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDYwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNDQ0Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyNCI+QmxvZyBJbWFnZTwvdGV4dD4KPC9zdmc+';
    };
    
    document.getElementById('post-content').innerHTML = post.content || getDefaultContent();
    
    // Update page title
    document.title = `${post.title} - ClipFy`;
}


// Load popular posts
async function loadPopularPosts() {
    try {
        const response = await fetch('assets/blog.json');
        const blogPosts = await response.json();
        
        const currentPostId = getPostId();
        // Show all blogs except the current one (removed .slice(0, 4) limit)
        const popularPosts = blogPosts.filter(post => post.id.toString() !== currentPostId);
        
        const popularPostsContainer = document.getElementById('popular-posts');
        popularPostsContainer.innerHTML = '';
        
        popularPosts.forEach(post => {
            const popularPost = createPopularPost(post);
            popularPostsContainer.appendChild(popularPost);
        });
    } catch (error) {
        console.error('Error loading popular posts:', error);
        loadDefaultPopularPosts();
    }
}

// Create popular post element
function createPopularPost(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'popular-post';
    postDiv.onclick = () => {
        window.location.href = `blog.html?id=${post.id}`;
    };
    
    postDiv.innerHTML = `
        <div class="popular-post-image">
            <img src="${post.image}" alt="${post.title}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNDQ0Ii8+Cjx0ZXh0IHg9IjQwIiB5PSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiPkltYWdlPC90ZXh0Pgo8L3N2Zz4K'">
        </div>
        <div class="popular-post-content">
            <h4>${post.title.length > 50 ? post.title.substring(0, 50) + '...' : post.title}</h4>
            <div class="popular-post-meta">${post.date}</div>
        </div>
    `;
    
    return postDiv;
}