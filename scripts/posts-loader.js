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
  markdown = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
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
function getCurrentLanguage() {
  return localStorage.getItem('preferredLanguage') ||
    new URLSearchParams(window.location.search).get('lang') ||
    'EN';
}

async function loadAllPosts(lang) {
  lang = lang || getCurrentLanguage();
  try {
    const response = await fetch('posts-manifest.json');
    if (!response.ok) throw new Error('Could not load posts-manifest.json');
    const manifest = await response.json();
    const posts = await Promise.all(
      manifest.posts.map(async (meta) => {
        try {
          // Pick the right file: language-specific → EN → legacy `file` field
          const fileForLang = meta.files
            ? (meta.files[lang] || meta.files['EN'] || meta.file)
            : meta.file;

          // Resolve language-aware metadata fields with EN fallback
          const resolvedTitle = (meta.titles && (meta.titles[lang] || meta.titles['EN'])) || meta.title;
          const resolvedExcerpt = (meta.excerpts && (meta.excerpts[lang] || meta.excerpts['EN'])) || meta.excerpt;

          const res = await fetch(`posts/${fileForLang}`);
          if (!res.ok) {
            // If the language file is missing, try falling back to EN
            if (fileForLang !== meta.file && meta.files && meta.files['EN']) {
              const fallback = await fetch(`posts/${meta.files['EN']}`);
              if (!fallback.ok) { console.error(`Failed to load ${meta.file}`); return null; }
              const markdown = await fallback.text();
              return { ...meta, title: resolvedTitle, excerpt: resolvedExcerpt, content: markdownToHtml(markdown) };
            }
            console.error(`Failed to load ${fileForLang}`);
            return null;
          }
          const markdown = await res.text();
          return { ...meta, title: resolvedTitle, excerpt: resolvedExcerpt, content: markdownToHtml(markdown) };
        } catch (e) {
          console.error(`Error loading post ${meta.file}:`, e);
          return null;
        }
      })
    );
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

  // Images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');

  // Tags that are block-level: we will (a) not wrap them in <p>, and
  // (b) keep their entire contents as a single chunk even if the author
  // left blank lines inside.
  const BLOCK_TAGS = [
    'h1','h2','h3','h4','h5','h6',
    'p','div','section','article','aside','figure','figcaption',
    'table','thead','tbody','tfoot','tr','td','th',
    'ul','ol','li',
    'blockquote','pre','hr','iframe','video','audio','img'
  ];

  // Split into chunks. A chunk is either:
  //   - a block-level HTML element (from its opening tag to its matching
  //     closing tag, inclusive), or
  //   - a run of text/inline-HTML between such elements, which we then
  //     further split on blank lines into paragraphs.
  const chunks = [];
  let i = 0;
  while (i < html.length) {
    // Try to match a block-level opening tag at this position
    const rest = html.slice(i);
    const openMatch = rest.match(/^\s*<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/);

    if (openMatch && BLOCK_TAGS.includes(openMatch[1].toLowerCase())) {
      const tagName = openMatch[1].toLowerCase();
      const leadingWs = openMatch[0].match(/^\s*/)[0];
      const startOfTag = i + leadingWs.length;

      // Self-closing / void elements: just consume the tag itself.
      const VOID = ['hr','img'];
      const isSelfClosed = openMatch[0].endsWith('/>');
      if (VOID.includes(tagName) || isSelfClosed) {
        chunks.push({ type: 'block', text: html.slice(startOfTag, i + openMatch[0].length) });
        i += openMatch[0].length;
        continue;
      }

      // Find matching closing tag, respecting nesting of the same tag name.
      const openRe = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
      const closeRe = new RegExp(`</${tagName}\\s*>`, 'gi');
      let depth = 1;
      let cursor = i + openMatch[0].length;
      let endIdx = -1;
      while (cursor < html.length) {
        openRe.lastIndex = cursor;
        closeRe.lastIndex = cursor;
        const nextOpen = openRe.exec(html);
        const nextClose = closeRe.exec(html);
        if (!nextClose) break;
        if (nextOpen && nextOpen.index < nextClose.index) {
          depth++;
          cursor = nextOpen.index + nextOpen[0].length;
        } else {
          depth--;
          cursor = nextClose.index + nextClose[0].length;
          if (depth === 0) { endIdx = cursor; break; }
        }
      }

      if (endIdx !== -1) {
        chunks.push({ type: 'block', text: html.slice(startOfTag, endIdx) });
        i = endIdx;
        continue;
      }
      // Unmatched opener: fall through and treat as text
    }

    // No block tag here — gather text until the next block tag opener (or end)
    let next = html.length;
    const scanRe = /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
    scanRe.lastIndex = i + 1;
    let m;
    while ((m = scanRe.exec(html)) !== null) {
      if (BLOCK_TAGS.includes(m[1].toLowerCase())) { next = m.index; break; }
    }
    const textChunk = html.slice(i, next);
    if (textChunk.trim()) chunks.push({ type: 'text', text: textChunk });
    i = next;
  }

  // Now render: text chunks become <p>s split on blank lines; block chunks pass through
  const out = chunks.map(chunk => {
    if (chunk.type === 'block') return chunk.text;
    return chunk.text
      .split(/\n{2,}/)
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => `<p>${p}</p>`)
      .join('\n');
  });

  return out.join('\n');
}
