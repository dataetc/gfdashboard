// Google Sheets CSV URL - Replace with your published CSV URL
// To get this: File > Share > Publish to web > Choose CSV format
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
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    const values = parseCSVLine(lines[i]);
    const obj = {};
    
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index] ? values[index].trim() : '';
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
    date: row.date || '', 
    archived: row.archived.toUpperCase() === 'TRUE',
    external: row.external.toUpperCase() === 'TRUE',
    gadhResource: row.gadhResource ? row.gadhResource.toUpperCase() === 'TRUE' : false // New gadhResource field
  };
}

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
    
    console.log('Resources loaded successfully from Google Sheets');
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

// Function to create resource item HTML
function createResourceItem(resource) {
  const languageAttr = resource.languages.join(' & ');
  const targetAttr = resource.external ? 'target="_blank"' : '';
  const gadhClass = resource.gadhResource ? 'gadh-resource' : ''; // Use gadhResource field
  const archivedClass = resource.archived ? 'archived-resource' : '';
  
  // For dashboards with GIF versions
  const hasGif = resource.imageGif ? true : false;
  
  // Build metadata section (source and date)
  let metadataHtml = '<div class="resource-metadata">';
  
  if (resource.source) {
    metadataHtml += `<div class="resource-source">Source: ${resource.source}</div>`;
  }
  
  if (resource.date) {
    metadataHtml += `<div class="resource-date">${resource.date}</div>`;
  }
  
  metadataHtml += '</div>';
  
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
  
  // Only add metadata if there's source or date
  if (resource.source || resource.date) {
    html += metadataHtml;
  }
  
  if (resource.archived) {
    html += ``// `<div class="archived-badge">Archived</div>`;
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
  
  // Sort to prioritize GADH resources (using gadhResource field)
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

// Function to initialize all resources
async function initializeResources() {
  // Show loading message
  const sections = document.querySelectorAll('section .image-grid');
  sections.forEach(section => {
    section.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Loading resources...</div>';
  });
  
  // Load data from Google Sheets
  const loaded = await loadResourcesFromSheet();
  
  if (loaded) {
    // Render all sections
    renderSection('dashboards', resourcesData.dashboards);
    renderSection('guides', resourcesData.guides);
    renderSection('reports', resourcesData.reports);
    renderSection('gf', resourcesData.globalFund);
    renderSection('advocacy', resourcesData.advocacy);
    
    // Initialize GIF loading for dashboards
    initializeGifLoading();
    
    // Update resource counts
    updateResourceCounts();
    
    // Re-trigger language filter if one is selected
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