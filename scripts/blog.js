// ── Navbar init ──
document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;
  navbar.setTextColor('#fff');
  navbar.setSecondaryTextColor('#fff');
  navbar.setLanguageSelectorTextColor('#fff');
  navbar.setBottomBorderColor('#fff');

  // ── Reload posts when language changes ──
  navbar.addEventListener('languagechange', async function (event) {
    allPosts = await loadAllPosts(event.detail.language);
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    buildTagFilters();
    buildYearFilters();
    buildAuthorFilters();
    filterAndRenderPosts();
  });
  
  // Setup topics sidebar toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const filterBar = document.getElementById('filter-bar');
  const toggleArrow = document.querySelector('#sidebar-toggle .toggle-arrow');

  sidebarToggle.addEventListener('click', () => {
    filterBar.classList.toggle('open');
    toggleArrow.classList.toggle('open');
  });

  // Setup year sidebar toggle
  const yearSidebarToggle = document.getElementById('year-sidebar-toggle');
  const yearFilterBar = document.getElementById('year-filter-bar');
  const yearToggleArrow = document.querySelector('#year-sidebar-toggle .toggle-arrow');

  yearSidebarToggle.addEventListener('click', () => {
    yearFilterBar.classList.toggle('open');
    yearToggleArrow.classList.toggle('open');
  });

  // Setup author sidebar toggle
  const authorSidebarToggle = document.getElementById('author-sidebar-toggle');
  const authorFilterBar = document.getElementById('author-filter-bar');
  const authorToggleArrow = document.querySelector('#author-sidebar-toggle .toggle-arrow');

  authorSidebarToggle.addEventListener('click', () => {
    authorFilterBar.classList.toggle('open');
    authorToggleArrow.classList.toggle('open');
  });
});

// ── Load & render posts ──
let allPosts = [];
let activeFilters = new Set(['all']);
let activeYearFilters = new Set(); 
let activeAuthorFilters = new Set();
let searchQuery = '';  

async function loadPosts() {
  try {
    allPosts = await loadAllPosts();
    
    if (allPosts.length === 0) {
      throw new Error('No posts loaded');
    }
    
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    buildTagFilters();
    buildYearFilters();
    buildAuthorFilters();
    setupSearchInput();
    renderPosts(allPosts);
  } catch (e) {
    console.error('Error loading posts:', e);
    document.getElementById('posts-grid').innerHTML = `
      <div class="empty-state">
        <h2>No Posts Yet</h2>
        <p>Check back soon for updates.</p>
      </div>`;
  }
}

loadPosts();

function setupSearchInput() {
  const searchInput = document.getElementById('search-input');
  
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    filterAndRenderPosts();
  });
}

// ── Split a raw author string into individual author names ──
function splitAuthors(raw) {
  if (!raw) return ['GADH Team'];
  return raw
    .split(/,|\bin partnership with\b|\band\b/i)
    .map(s => s.trim())
    .filter(Boolean);
}

// ── Canonical form for dedupe / comparison (case + whitespace insensitive) ──
function normalizeAuthor(name) {
  return name.toLowerCase().replace(/\s+/g, ' ').trim();
}

function buildAuthorFilters() {
  // Collect unique authors across all posts, preserving display case from first occurrence
  const seen = new Map(); // normalized -> display
  allPosts.forEach(p => {
    splitAuthors(p.author).forEach(name => {
      const key = normalizeAuthor(name);
      if (!seen.has(key)) seen.set(key, name);
    });
  });
  const authors = [...seen.values()].sort((a, b) => a.localeCompare(b));

  const bar = document.getElementById('author-filter-bar');
  bar.innerHTML = '';

  authors.forEach(author => {
    const label = document.createElement('label');
    label.className = 'filter-checkbox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = author;
    checkbox.className = 'checkbox-input';

    const span = document.createElement('span');
    span.className = 'checkbox-label';
    span.textContent = author;

    label.appendChild(checkbox);
    label.appendChild(span);
    bar.appendChild(label);

    checkbox.addEventListener('change', () => {
      handleAuthorFilterChange();
    });
  });
}

function handleAuthorFilterChange() {
  const authorCheckboxes = document.querySelectorAll('#author-filter-bar .checkbox-input');
  activeAuthorFilters.clear();
  
  authorCheckboxes.forEach(cb => {
    if (cb.checked) activeAuthorFilters.add(cb.value);
  });
  
  filterAndRenderPosts();
}

function buildYearFilters() {
  const years = [...new Set(allPosts.map(p => new Date(p.date).getFullYear()))];
  years.sort((a, b) => b - a);
  
  const bar = document.getElementById('year-filter-bar');
  bar.innerHTML = '';
  
  years.forEach(year => {
    const label = document.createElement('label');
    label.className = 'filter-checkbox';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = year;
    checkbox.className = 'checkbox-input';
    
    const span = document.createElement('span');
    span.className = 'checkbox-label';
    span.textContent = year;
    
    label.appendChild(checkbox);
    label.appendChild(span);
    bar.appendChild(label);
    
    checkbox.addEventListener('change', () => {
      handleYearFilterChange();
    });
  });
}

function handleYearFilterChange() {
  const yearCheckboxes = document.querySelectorAll('#year-filter-bar .checkbox-input');
  activeYearFilters.clear();
  
  yearCheckboxes.forEach(cb => {
    if (cb.checked) activeYearFilters.add(parseInt(cb.value));
  });
  
  filterAndRenderPosts();
}

function buildTagFilters() {
  const tags = [...new Set(allPosts.flatMap(p => p.tags || []))];
  const bar = document.getElementById('filter-bar');
  bar.innerHTML = '';
  
  tags.forEach(tag => {
    const label = document.createElement('label');
    label.className = 'filter-checkbox';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = tag;
    checkbox.className = 'checkbox-input';
    
    const span = document.createElement('span');
    span.className = 'checkbox-label';
    span.textContent = tag;
    
    label.appendChild(checkbox);
    label.appendChild(span);
    bar.appendChild(label);
    
    checkbox.addEventListener('change', () => {
      handleFilterChange();
    });
  });
}

function handleFilterChange() {
  const otherCheckboxes = document.querySelectorAll('.checkbox-input');
  activeFilters.clear();
  
  const anyOtherChecked = Array.from(otherCheckboxes).some(cb => cb.checked);
  
  if (!anyOtherChecked) {
    activeFilters.add('all');
  } else {
    otherCheckboxes.forEach(cb => {
      if (cb.checked) activeFilters.add(cb.value);
    });
  }
  
  filterAndRenderPosts();
}

function removeActiveFilter(type, value) {
  if (type === 'search') {
    searchQuery = '';
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
    }
  } else if (type === 'topic') {
    activeFilters.delete(value);
    if (activeFilters.size === 0) activeFilters.add('all');
    const checkbox = document.querySelector(`#filter-bar input[value="${value}"]`);
    if (checkbox) checkbox.checked = false;
  } else if (type === 'year') {
    activeYearFilters.delete(value);
    const checkbox = document.querySelector(`#year-filter-bar input[value="${value}"]`);
    if (checkbox) checkbox.checked = false;
  } else if (type === 'author') {
    activeAuthorFilters.delete(value);
    const checkbox = document.querySelector(`#author-filter-bar input[value="${value}"]`);
    if (checkbox) checkbox.checked = false;
  }
  
  filterAndRenderPosts();
}

function displayActiveFilters() {  
  const container = document.getElementById('active-filters-display');
  container.innerHTML = '';
  
  const allActiveFilters = [];
  
  if (searchQuery.trim() !== '') {
    allActiveFilters.push({ type: 'search', value: searchQuery });
  }
  
  activeFilters.forEach(filter => {
    if (filter !== 'all') allActiveFilters.push({ type: 'topic', value: filter });
  });
  
  activeYearFilters.forEach(year => {
    allActiveFilters.push({ type: 'year', value: year });
  });
  
  activeAuthorFilters.forEach(author => {
    allActiveFilters.push({ type: 'author', value: author });
  });
  
  allActiveFilters.forEach(filter => {
    const tag = document.createElement('div');
    tag.className = 'filter-tag';
    
    const label = document.createElement('span');
    label.textContent = filter.value;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'filter-tag-remove';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      removeActiveFilter(filter.type, filter.value);
    });
    
    tag.appendChild(label);
    tag.appendChild(removeBtn);
    container.appendChild(tag);
  });
}

function filterAndRenderPosts() {
  let filtered;
  
  if (activeFilters.has('all')) {
    filtered = allPosts;
  } else {
    filtered = allPosts.filter(p => {
      const postTags = p.tags || [];
      return postTags.some(tag => activeFilters.has(tag));
    });
  }
  
  if (activeYearFilters.size > 0) {
    filtered = filtered.filter(p => {
      const postYear = new Date(p.date).getFullYear();
      return activeYearFilters.has(postYear);
    });
  }
  
  if (activeAuthorFilters.size > 0) {
    filtered = filtered.filter(p => {
      const postAuthors = splitAuthors(p.author).map(normalizeAuthor);
      return [...activeAuthorFilters].some(f =>
        postAuthors.includes(normalizeAuthor(f))
      );
    });
  }
  
  if (searchQuery.trim() !== '') {
    filtered = filtered.filter(p => {
      const title = (p.title || '').toLowerCase();
      const author = (p.author || 'GADH Team').toLowerCase();
      const excerpt = (p.excerpt || p.content || '').toLowerCase();
      return title.includes(searchQuery) || author.includes(searchQuery) || excerpt.includes(searchQuery);
    });
  }
  
  displayActiveFilters();
  renderPosts(filtered);
} 

function renderPosts(posts) {
  const grid = document.getElementById('posts-grid');
  const countDisplayed = document.getElementById('count-displayed');
  const countTotal = document.getElementById('count-total');
  
  countDisplayed.textContent = posts.length;
  countTotal.textContent = allPosts.length;
  
  if (posts.length === 0) {
    grid.innerHTML = `<div class="empty-state"><h2>No Posts Found</h2><p>Try a different filter.</p></div>`;
    return;
  }
  grid.innerHTML = posts.map((post, i) => cardHTML(post, i)).join('');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ── Truncate to a fixed character length, cutting on a word boundary ──
const EXCERPT_TRUNCATE_LENGTH = 140; // adjust to taste

function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  // avoid chopping a word in half — back up to the last space if it's not too far back
  const lastSpace = cut.lastIndexOf(' ');
  const clean = lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut;
  return clean.trimEnd().replace(/[.,;:!?]$/, '') + ' ...';
}

function cardHTML(post, index) {
  const isFeatured = index === 0;
  const imgSrc = post.image ? post.image : 'images/blog-placeholder.jpg';
  const tag = (post.tags && post.tags[0]) ? post.tags[0] : 'Update';
  const rawExcerpt = post.excerpt || post.content.substring(0, 160) + '…';
  const excerpt = isFeatured ? rawExcerpt : truncateText(rawExcerpt, EXCERPT_TRUNCATE_LENGTH);
  return `
    <a class="post-card" href="post.html?post=${encodeURIComponent(post.slug)}">
      <img class="card-image" src="${imgSrc}" alt="${post.title}" loading="${isFeatured ? 'eager' : 'lazy'}">
      <div class="card-body">
        <span class="card-tag">${tag}</span>
        <h2 class="card-title">${post.title}</h2>
        <p class="card-excerpt">${excerpt}</p>
        <div class="card-meta">
          <span>${post.author || 'GADH Team'}</span>
          <span class="dot">·</span>
          <span>${formatDate(post.date)}</span>
        </div>
        <span class="card-read-more">Read More →</span>
      </div>
    </a>`;
}