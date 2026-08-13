const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS2OExrmL9SLRTO0rtOWoQTvBbDAQYs7cAMhdDoXFWu3Xz6-vFk31LsosX5uSl_p5JW4ZuxPWP0KTNv/pub?gid=0&single=true&output=csv';

// Global variable to store loaded resources
let resourcesData = {
  dashboards: [],
  guides: [],
  reports: [],
  globalFund: [],
  advocacy: []
};

// Function to parse CSV text into array of objects
function parseCSV(csvText) {
  // Strip BOM (byte-order mark) that Google Sheets sometimes prepends
  const cleaned = csvText.replace(/^\uFEFF/, '');
  const lines = cleaned.split('\n');

  // Clean every header: strip BOM, quotes, and surrounding whitespace
  const headers = parseCSVLine(lines[0]).map(h =>
    h.replace(/^\uFEFF/, '').replace(/"/g, '').trim()
  );

  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    const values = parseCSVLine(lines[i]);
    const obj = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index] ? values[index].trim() : '';
    });
    
    data.push(obj);
  }
  
  return data;
}

// Function to properly parse CSV line (handles commas in quoted fields)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

// Function to convert CSV row to resource object
function csvRowToResource(row) {
  return {
    id: row.id,
    title: row.title,
    titleKey: row.titleKey || undefined,
    url: row.url,
    image: row.image,
    imageGif: row.imageGif || undefined,
    languages: row.languages.split('&').map(lang => lang.trim().toLowerCase()),
    source: row.source || '',
    author: row.author || '',   // NEW: partner/author field
    date: row.date || '', 
    archived: row.archived.toUpperCase() === 'TRUE',
    external: row.external.toUpperCase() === 'TRUE',
    gadhResource: row.gadhResource ? row.gadhResource.toUpperCase() === 'TRUE' : false
  };
}

// ============================================================
//  SKELETON LOADERS
// ============================================================

/**
 * Injects skeleton placeholder cards into every .image-grid
 * so users see a loading animation immediately.
 */
function showSkeletonLoaders() {
  const grids = document.querySelectorAll('section .image-grid');
  const skeletonCount = 6; // Cards per section while loading

  const skeletonCard = `
    <div class="image-item skeleton-item" aria-hidden="true">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-meta"></div>
      <div class="skeleton skeleton-meta skeleton-meta--short"></div>
    </div>`;

  grids.forEach(grid => {
    grid.innerHTML = Array(skeletonCount).fill(skeletonCard).join('');
  });
}

// ============================================================
//  RESOURCE LOADING
// ============================================================

// Function to load resources from Google Sheets
async function loadResourcesFromSheet() {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    // Clear existing data
    resourcesData = {
      dashboards: [],
      guides: [],
      reports: [],
      globalFund: [],
      advocacy: []
    };
    
    // Organize rows by category
    rows.forEach(row => {
      const resource = csvRowToResource(row);
      const category = row.category;
      
      if (resourcesData[category]) {
        resourcesData[category].push(resource);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error loading resources from Google Sheets:', error);
    console.error('Falling back to example data structure');
    
    // Fallback: Show error message to user
    showErrorMessage('Unable to load resources from Google Sheets. Please check the CSV URL.');
    return false;
  }
}

// Function to show error message
function showErrorMessage(message) {
  const sections = document.querySelectorAll('section .image-grid');
  sections.forEach(section => {
    section.innerHTML = `
      <div style="width: 100%; padding: 20px; text-align: center; color: #d9534f; background-color: #f9f2f2; border: 1px solid #d9534f; border-radius: 5px; margin: 20px 0;">
        <strong>Error:</strong> ${message}
      </div>
    `;
  });
}

// ============================================================
//  RESOURCE CARD RENDERING
// ============================================================

// Function to create resource item HTML
function createResourceItem(resource) {
  const languageAttr = resource.languages.join(' & ');
  const targetAttr = resource.external ? 'target="_blank"' : '';
  const gadhClass = resource.gadhResource ? 'gadh-resource' : '';
  const archivedClass = resource.archived ? 'archived-resource' : '';
  
  // For dashboards with GIF versions
  const hasGif = resource.imageGif ? true : false;
  
  // ----------------------------------------------------------
  // Build author + date metadata (handles all four combos)
  // ----------------------------------------------------------
  const hasAuthor = resource.author && resource.author.trim() !== '';
  const hasDate   = resource.date   && resource.date.trim()   !== '';

  // Format date: handles M/D/YYYY and MM/DD/YYYY (e.g. "1/1/2026" or "01/01/2026")
  let formattedDate = '';
  if (hasDate) {
    const raw = resource.date.trim();
    const parts = raw.split('/');
    if (parts.length === 3) {
      const m = parseInt(parts[0], 10);
      const d = parseInt(parts[1], 10);
      const y = parseInt(parts[2], 10);
      const parsed = new Date(Date.UTC(y, m - 1, d));
      if (!isNaN(parsed.getTime()) && y > 1000) {
        formattedDate = parsed.toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
        });
      } else {
        formattedDate = raw; // fallback: show raw string
      }
    } else {
      formattedDate = raw; // fallback: show raw string
    }
  }

  let metadataHtml = '';
  if (hasAuthor || hasDate) {
    metadataHtml = '<div class="resource-metadata">';
    if (hasAuthor) {
      metadataHtml += `<div class="resource-author">${resource.author}</div>`;
    }
    if (hasDate) {
      metadataHtml += `<div class="resource-date">${formattedDate}</div>`;
    }
    metadataHtml += '</div>';
  }

  // ----------------------------------------------------------
  // Compose card HTML
  // ----------------------------------------------------------
  let html = `
    <div class="image-item ${gadhClass} ${archivedClass}" data-language="${languageAttr}" data-source="${resource.source}" data-archived="${resource.archived}">
      <a href="${resource.url}" ${targetAttr}>`;
  
  if (hasGif) {
    html += `
        <img src="${resource.image}" alt="${resource.title}" class="image-placeholder" loading="lazy">
        <img src="${resource.imageGif}" alt="${resource.title}" class="image-gif" style="display: none;">`;
  } else {
    html += `
        <img src="${resource.image}" alt="${resource.title}" loading="lazy">`;
  }
  
  html += `
      </a>
      <a href="${resource.url}" ${targetAttr}>
        <h5${resource.titleKey ? ` id="${resource.titleKey}"` : ''}>${resource.title}</h5>
      </a>`;
  
  // Metadata section (author + date)
  if (metadataHtml) {
    html += metadataHtml;
  }
  
  html += `
    </div>`;
  
  return html;
}

// Function to render a section
function renderSection(sectionId, resources) {
  const container = document.querySelector(`#${sectionId} .image-grid`);
  if (!container) return;
  
  // Separate active and archived resources
  const activeResources = resources.filter(r => !r.archived);
  const archivedResources = resources.filter(r => r.archived);
  
  // Sort to prioritize GADH resources
  activeResources.sort((a, b) => {
    if (a.gadhResource && !b.gadhResource) return -1;
    if (!a.gadhResource && b.gadhResource) return 1;
    return 0;
  });
  
  // Render active resources
  let html = activeResources.map(resource => createResourceItem(resource)).join('');
  
  // Add archived section if there are archived resources
  if (archivedResources.length > 0) {
    html += `
      <div class="archived-section-divider">
        <button class="archived-toggle" onclick="toggleArchivedResources('${sectionId}')">
          <span>More Resources (${archivedResources.length})</span>
          <span class="arrow">▼</span>
        </button>
        <div class="archived-content" id="archived-${sectionId}">
          ${archivedResources.map(resource => createResourceItem(resource)).join('')}
        </div>
      </div>`;
  }
  
  container.innerHTML = html;
}

// Function to toggle archived resources visibility
function toggleArchivedResources(sectionId) {
  const archivedContent = document.getElementById(`archived-${sectionId}`);
  const toggleButton = archivedContent.previousElementSibling;
  
  if (archivedContent.classList.contains('show')) {
    archivedContent.classList.remove('show');
    toggleButton.classList.remove('open');
  } else {
    archivedContent.classList.add('show');
    toggleButton.classList.add('open');
  }
}

// Function to update resource counts
function updateResourceCounts() {
  const sections = ['dashboards', 'guides', 'reports', 'gf', 'advocacy'];
  
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Count only visible, non-archived resources
    const visibleItems = section.querySelectorAll('.image-item:not([style*="display: none"]):not(.archived-content .image-item)');
    const count = visibleItems.length;
    
    // Update section title count
    const sectionCount = document.getElementById(`section-count-${sectionId}`);
    if (sectionCount) {
      sectionCount.textContent = `(${count} resource${count !== 1 ? 's' : ''})`;
    }
    
    // Update nav count
    const navCount = document.getElementById(`count-${sectionId}`);
    if (navCount) {
      navCount.textContent = `(${count})`;
    }
  });
}

function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    const resourceSections = document.querySelectorAll('section');

    resourceSections.forEach(function(section) {
      const sectionId = section.getAttribute('id');
      const resourceItems = section.querySelectorAll('.image-item');
      const archivedContent = document.getElementById(`archived-${sectionId}`);
      const toggleButton = archivedContent?.previousElementSibling;
      const archivedDivider = archivedContent?.closest('.archived-section-divider');

      let hasArchivedMatches = false;
      let hasActiveMatches = false;

      resourceItems.forEach(function(item) {
        const title = item.querySelector('h5');
        const isArchived = !!item.closest('.archived-content');
        const matches = !searchTerm || (title && title.textContent.toLowerCase().includes(searchTerm));

        item.style.cssText = matches ? '' : 'display: none !important;';

        if (title) {
          if (searchTerm && matches) {
            const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            title.innerHTML = title.textContent.replace(regex, '<mark>$1</mark>');
          } else {
            title.innerHTML = title.textContent;
          }
        }

        if (matches && isArchived) hasArchivedMatches = true;
        if (matches && !isArchived) hasActiveMatches = true;
      });

      // Always keep the section visible (even if no matches, so no-results message shows)
      section.style.display = 'block';

      // Handle archived section visibility
      if (archivedContent) {
        if (!searchTerm) {
          // No search term — restore default collapsed state
          archivedContent.classList.remove('show');
          if (toggleButton) toggleButton.classList.remove('open');
          if (archivedDivider) archivedDivider.style.display = '';
        } else if (hasArchivedMatches) {
          // Has matching archived results — open and show
          archivedContent.classList.add('show');
          if (toggleButton) toggleButton.classList.add('open');
          if (archivedDivider) archivedDivider.style.display = '';
        } else {
          // Searching but no archived matches — hide entire archived divider
          if (archivedDivider) archivedDivider.style.display = 'none';
        }
      }

      // Inject or remove no-results message for active (non-archived) items
      const grid = section.querySelector('.image-grid');
      let noResults = grid ? grid.querySelector('.no-results-message') : null;

      if (!hasActiveMatches && searchTerm && grid) {
        if (!noResults) {
          noResults = document.createElement('div');
          noResults.className = 'no-results-message';
          grid.appendChild(noResults);
        }
        noResults.textContent = getNoResultsText(searchTerm);
      } else if (noResults) {
        noResults.remove();
      }
    });

    updateResourceCounts();
  });
}

// Returns the localised "no results" string
function getNoResultsText(term) {
  // If your language-data.js exposes a getCurrentLanguage() or window.currentLang, use it.
  // Adjust the key name to match whatever key you use in language-data.js.
  const lang = (typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : null)
            || window.currentLang
            || document.documentElement.lang
            || 'en';

  const messages = {
    en:         `No results found for "${term}"`,
    fr:         `Aucun résultat pour « ${term} »`,
    es:         `No se encontraron resultados para "${term}"`,
    pt:         `Nenhum resultado encontrado para "${term}"`,
    ru:         `По запросу «${term}» ничего не найдено`,
    ar:         `لا توجد نتائج لـ "${term}"`,
    id:         `Tidak ada hasil untuk "${term}"`,
  };

  // Try exact match first, then first two chars (e.g. "en-US" → "en")
  return messages[lang] || messages[lang.slice(0, 2)] || messages['en'];
}
// Function to initialize all resources
async function initializeResources() {
  showSkeletonLoaders();
  
  const loaded = await loadResourcesFromSheet();
  
  if (loaded) {
    renderSection('dashboards', resourcesData.dashboards);
    renderSection('guides', resourcesData.guides);
    renderSection('reports', resourcesData.reports);
    renderSection('gf', resourcesData.globalFund);
    renderSection('advocacy', resourcesData.advocacy);
    
    initializeGifLoading();
    updateResourceCounts();
    
    // Initialize search AFTER resources are in the DOM
    initializeSearch();
    
    const languageFilter = document.getElementById('languageFilter');
    if (languageFilter && languageFilter.value !== 'all') {
      languageFilter.dispatchEvent(new Event('change'));
    }
  }
}

// Function to handle GIF loading
function initializeGifLoading() {
  const imagePlaceholders = document.querySelectorAll('.image-placeholder');
  const imageGifs = document.querySelectorAll('.image-gif');

  imagePlaceholders.forEach(function(placeholder, index) {
    const gif = imageGifs[index];
    if (gif) {
      gif.onload = function() {
        placeholder.style.display = 'none';
        gif.style.display = 'inline';
      };
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeResources();
});