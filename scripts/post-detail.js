// scripts/post-detail.js

document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.getElementById('main-navbar');
  if (navbar) {
    navbar.setTextColor('#fff');
    navbar.setSecondaryTextColor('#fff');
    navbar.setLanguageSelectorTextColor('#fff');
    navbar.setBottomBorderColor('rgba(255,255,255,0.4)');
  }
  
  loadPost();
});

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

async function loadPost() {
  const postSlug = getQueryParam('post');
  
  if (!postSlug) {
    showError('No post specified.');
    return;
  }

  try {
    // Load all posts using your existing function
    const posts = await loadAllPosts();
    
    // Find post by slug
    const post = posts.find(p => p.slug === postSlug);
    
    if (!post) {
      showError('Post not found.');
      return;
    }

    // Set page title
    document.title = `The GADH: ${post.title}`;

    // Hero image (if available in frontmatter)
    const heroImg = document.getElementById('hero-img');
    if (post.image) {
      heroImg.src = post.image;
      heroImg.alt = post.title;
    } else {
      document.getElementById('post-hero').style.display = 'none';
    }

    // Meta
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-author').textContent = post.author || 'GADH Team';
    document.getElementById('post-date').textContent = formatDate(post.date);
    
    // First tag (or default)
    const tag = (post.tags && post.tags[0]) ? post.tags[0] : 'Update';
    document.getElementById('post-tag').textContent = tag;

    // Content (already converted to HTML by loadAllPosts)
    document.getElementById('post-content').innerHTML = post.content;

    // Tags
    if (post.tags && post.tags.length) {
      document.getElementById('post-tags').innerHTML =
        post.tags.map(t => `<span>${t}</span>`).join('');
    }

    // More posts (up to 3, excluding current)
    const others = posts
      .filter(p => p.slug !== postSlug)
      .slice(0, 3);
    
    if (others.length) {
      document.getElementById('more-posts-section').style.display = 'block';
      document.getElementById('more-posts-grid').innerHTML = others.map(p => `
        <a class="mini-card" href="post.html?post=${encodeURIComponent(p.slug)}">
          <span class="mini-tag">${(p.tags && p.tags[0]) || 'Update'}</span>
          <h3>${p.title}</h3>
          <span class="mini-date">${formatDate(p.date)}</span>
        </a>
      `).join('');
    }

  } catch(e) {
    console.error('Error loading post:', e);
    showError('Could not load post.');
  }
}

function showError(msg) {
  document.body.innerHTML = `<div class="post-error">${msg}</div>`;
}
