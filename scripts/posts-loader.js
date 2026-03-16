// scripts/posts-loader.js

/**
 * Parses frontmatter from markdown
 * Expects format:
 * ---
 * id: "1"
 * title: "Post Title"
 * tags: ["tag1", "tag2"]
 * ---
 * Content here...
 */
function parseFrontmatter(markdown) {
  const lines = markdown.split('\n');
  
  // Find the frontmatter delimiters
  let firstDelimiter = -1;
  let secondDelimiter = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (firstDelimiter === -1) {
        firstDelimiter = i;
      } else {
        secondDelimiter = i;
        break;
      }
    }
  }
  
  // If no frontmatter found, return empty data
  if (firstDelimiter === -1 || secondDelimiter === -1) {
    return { data: {}, content: markdown };
  }
  
  // Extract frontmatter lines
  const frontmatterLines = lines.slice(firstDelimiter + 1, secondDelimiter);
  const content = lines.slice(secondDelimiter + 1).join('\n').trim();
  
  // Parse frontmatter into key-value pairs
  const data = {};
  
  frontmatterLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    
    // Handle JSON arrays like tags: ["tag1", "tag2"]
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.warn(`Failed to parse array for key "${key}":`, value);
      }
    }
    // Handle quoted strings
    else if ((value.startsWith('"') && value.endsWith('"')) || 
             (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    data[key] = value;
  });
  
  return { data, content };
}

/**
 * Loads all markdown posts from the posts/ folder
 * Returns array of post objects with metadata + content
 */
async function loadAllPosts() {
  try {
    // Fetch the manifest of post files
    const response = await fetch('posts-manifest.json');
    if (!response.ok) {
      throw new Error('Could not load posts-manifest.json');
    }
    const manifest = await response.json();
    
    // Load each markdown file
    const posts = await Promise.all(
      manifest.files.map(async (filename) => {
        try {
          const res = await fetch(`posts/${filename}`);
          if (!res.ok) {
            console.error(`Failed to load ${filename}`);
            return null;
          }
          
          const markdown = await res.text();
          const { data, content } = parseFrontmatter(markdown);
          
          // Validate required fields
          if (!data.id || !data.title || !data.date) {
            console.warn(`Post ${filename} missing required fields:`, data);
          }
          
          return {
            ...data,
            slug: filename.replace('.md', ''),
            content: markdownToHtml(content)
          };
        } catch (e) {
          console.error(`Error loading post ${filename}:`, e);
          return null;
        }
      })
    );
    
    // Filter out failed posts and sort newest first
    return posts
      .filter(post => post !== null)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (e) {
    console.error('Error loading posts:', e);
    return [];
  }
}

/**
 * Simple markdown to HTML converter
 * Handles: ## headers, > blockquotes, **bold**, *italic*
 */
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Headers (do this before paragraph conversion)
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  
  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Line breaks to paragraphs
  const paragraphs = html.split('\n\n').map(para => {
    const trimmed = para.trim();
    
    // Don't wrap if already a tag
    if (trimmed.startsWith('<h') || 
        trimmed.startsWith('<blockquote') || 
        trimmed.startsWith('<strong') ||
        trimmed.startsWith('<em')) {
      return trimmed;
    }
    
    return trimmed ? `<p>${trimmed}</p>` : '';
  }).filter(p => p);
  
  return paragraphs.join('\n');
}
